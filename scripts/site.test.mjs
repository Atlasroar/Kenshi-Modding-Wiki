import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { createHash } from "node:crypto"
import { access, glob, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { extname, join, resolve, sep } from "node:path"
import test from "node:test"
import { fromHtml } from "hast-util-from-html"
import { visit } from "unist-util-visit"
import yaml from "js-yaml"
import sharp from "sharp"

const root = resolve(import.meta.dirname, "..")
const output = join(root, "public")
const config = yaml.load(await readFile(join(root, "quartz.config.yaml"), "utf8"))
const imports = JSON.parse(await readFile(join(root, "docs", "modding-imports.json"), "utf8"))
const retiredSlugs = new Set(imports.retiredGuides.map((guide) => guide.slug))
const activeImports = imports.guides.filter((guide) => !retiredSlugs.has(guide.slug))
const navigation = JSON.parse(await readFile(join(root, "site", "navigation.json"), "utf8"))
const site = new URL(`https://${config.configuration.baseUrl}/`)
const documents = new Map()

for await (const filename of glob("**/*.html", { cwd: output })) {
  const html = await readFile(join(output, filename), "utf8")
  const elements = []
  visit(fromHtml(html), "element", (node) => {
    elements.push(node)
  })
  documents.set(filename.split(sep).join("/"), { html, elements })
}

assert.ok(documents.has("index.html"), "Run npm run build before npm run test:site")

function elementsFor(page) {
  assert.ok(documents.has(page), `Missing generated page: ${page}`)
  return documents.get(page).elements
}

function linksTo(nodes, slug, from) {
  const normalize = (url) =>
    url.pathname
      .replace(/\.html$/, "")
      .replace(/\/index$/, "")
      .replace(/\/$/, "")
  return nodes.some(
    (node) =>
      node.tagName === "a" &&
      typeof node.properties.href === "string" &&
      normalize(new URL(node.properties.href, new URL(from + ".html", site))) ===
        normalize(new URL(slug, site)),
  )
}

async function findTarget(url) {
  const relative = decodeURIComponent(url.pathname.slice(site.pathname.length))
  const filename = resolve(output, ...relative.split("/"))
  assert.ok(
    filename === output || filename.startsWith(output + sep),
    `Path escaped output: ${url.href}`,
  )
  const candidates = extname(filename)
    ? [filename]
    : [filename + ".html", join(filename, "index.html")]
  for (const candidate of candidates) {
    try {
      await access(candidate)
      return candidate
    } catch (error) {
      if (error.code !== "ENOENT") throw error
    }
  }
  assert.fail(`Missing generated link or asset: ${url.href}`)
}

test("internal navigation, heading links, and assets resolve under the Pages subpath", async () => {
  for (const [page, { elements }] of documents) {
    const body = elements.find((node) => node.tagName === "body")
    if (body?.properties.dataSlug) {
      assert.equal(
        body.properties.dataBasepath,
        site.pathname.slice(0, -1),
        `Runtime navigation needs the production basepath in ${page}; run npm run build`,
      )
    }
    const pageUrl = new URL(page, site)
    for (const element of elements) {
      for (const property of ["href", "src"]) {
        const value = element.properties[property]
        if (typeof value !== "string" || value === "" || value === "#") continue
        assert.doesNotMatch(value, /^(?:file:|[a-z]:\\)/i, `Local path in ${page}`)
        const url = new URL(value, pageUrl)
        if (url.origin !== site.origin) continue
        assert.ok(
          url.pathname === site.pathname.slice(0, -1) || url.pathname.startsWith(site.pathname),
          `Link escapes the repository subpath in ${page}: ${value}`,
        )
        const target = await findTarget(url)
        if (url.hash && extname(target) === ".html") {
          const html = await readFile(target, "utf8")
          let found = false
          visit(fromHtml(html), "element", (node) => {
            if (node.properties.id === decodeURIComponent(url.hash.slice(1))) found = true
          })
          assert.ok(found, `Missing heading target in ${page}: ${value}`)
        }
      }
    }
  }
})

test("modder pages retain themed cards, tables, page classes, and warnings", () => {
  const home = elementsFor("index.html")
  const guide = elementsFor("modding/assets/armor-color-maps.html")
  assert.ok(home.some((node) => node.properties.dataCallout === "multi-column"))
  assert.equal(home.filter((node) => node.properties.dataCallout === "paper_gradient_1").length, 2)
  assert.ok(
    elementsFor("modding/characters/creating-a-race.html").some(
      (node) => node.properties.dataCallout === "warning",
    ),
  )
  assert.ok(guide.some((node) => node.tagName === "table"))
  assert.ok(
    guide.some(
      (node) => node.tagName === "article" && node.properties.className?.includes("page-kenshi"),
    ),
  )
  assert.ok(linksTo(home, "fcs/index", "index"))
  assert.ok(linksTo(home, "world-editor/index", "index"))
})

test("the homepage combines the approved game sources and keeps a distinct modding entry point", () => {
  const article = elementsFor("index.html").find((node) => node.tagName === "article")
  let text = ""
  visit(article, "text", (node) => {
    text += node.value
  })
  for (const subject of [
    /Lo-Fi Games/,
    /sword-punk/,
    /squad-based/,
    /settlement building/,
    /training and experience/,
    /Wounds, hunger, captivity/,
    /What is Kenshi/,
    /From playing to modding/,
    /not a complete encyclopedia/,
    /unofficial community project/,
  ])
    assert.match(text, subject)
  assert.doesNotMatch(text, /All 17 modding guides are available|first 17 guides/)
  assert.ok(linksTo(elementsFor("index.html"), "credits", "index"))
  assert.match(text, /Help improve the manual/)
  const homepageLinks = []
  visit(article, "element", (node) => {
    if (node.tagName === "a") homepageLinks.push(node)
  })
  assert.ok(
    homepageLinks.some(
      (node) => node.properties.href === "https://github.com/Atlasroar/Kenshi-Modding-Wiki/wiki",
    ),
    "The contribution blurb must link directly to the project Wiki",
  )
  assert.ok(
    elementsFor("credits.html").some(
      (node) =>
        node.tagName === "a" && node.properties.href === imports.homepage.sources[1].sourceUrl,
    ),
  )
})

test("graph, reader controls and page-mapped Giscus comments are connected to the layout", () => {
  for (const [page, { elements: nodes }] of documents) {
    if (!nodes.some((node) => node.tagName === "body" && node.properties.dataSlug)) continue
    const sidebar = nodes.find(
      (node) =>
        node.tagName === "div" &&
        node.properties.className?.includes("right") &&
        node.properties.className?.includes("sidebar"),
    )
    assert.ok(sidebar, `Missing right sidebar: ${page}`)
    assert.ok(
      sidebar.children
        .find((node) => node.type === "element")
        ?.properties.className?.includes("graph"),
      `Graph must be first in the right sidebar: ${page}`,
    )
    if (page !== "404.html")
      assert.ok(
        nodes.some(
          (node) => node.tagName === "button" && node.properties.className?.includes("readermode"),
        ),
        `Missing reader toggle: ${page}`,
      )
  }
  const comments = elementsFor("modding/dialogue/creating-dialogue.html").find((node) =>
    node.properties.className?.includes("giscus"),
  )
  assert.ok(comments, "Guide comments must be rendered")
  assert.equal(comments.properties.dataRepo, "Atlasroar/Kenshi-Modding-Wiki")
  assert.equal(comments.properties.dataRepoId, "R_kgDOVvcLwA")
  assert.equal(comments.properties.dataCategoryId, "DIC_kwDOVvcLwM4DLMsQ")
  assert.equal(
    comments.properties.dataMapping,
    "pathname",
    "Preview hosts must not fragment threads",
  )
  assert.equal(comments.properties.dataStrict, "1")
  assert.equal(comments.properties.dataThemeUrl, "https://giscus.app/themes")
  for (const page of ["index.html", "credits.html"]) {
    assert.ok(!elementsFor(page).some((node) => node.properties.className?.includes("giscus")))
  }
})

test("social previews have generated, correctly sized images and production URLs", async () => {
  const urls = new Set()
  for (const page of [
    "index.html",
    "modding/dialogue/creating-dialogue.html",
    "modding/fcs/complete-guide.html",
  ]) {
    const nodes = elementsFor(page)
    const image = nodes.find(
      (node) => node.tagName === "meta" && node.properties.property === "og:image",
    )
    const twitter = nodes.find(
      (node) => node.tagName === "meta" && node.properties.name === "twitter:image",
    )
    assert.ok(image, `Missing social image: ${page}`)
    const url = new URL(image.properties.content)
    assert.ok(url.href.startsWith(site.href), `Social image must retain the Pages subpath: ${page}`)
    assert.equal(twitter?.properties.content, url.href)
    const metadata = await sharp(await findTarget(url)).metadata()
    assert.equal(metadata.width, 1200)
    assert.equal(metadata.height, 630)
    assert.equal(metadata.format, "webp")
    urls.add(url.href)
  }
  assert.equal(urls.size, 3, "Each page needs its own preview, not one shared fallback")
})

test("published pages enter search without remote font or analytics resources", async () => {
  const index = JSON.parse(await readFile(join(output, "static", "contentIndex.json"), "utf8"))
  assert.ok(index.index, "The homepage must enter search")
  assert.ok(index["modding/fcs/complete-guide"], "The FCS guide must enter search")
  for (const [page, { html, elements }] of documents) {
    assert.doesNotMatch(
      html,
      /\b[A-Z]:\\(?:Users|Obsidian)\\/i,
      `Private filesystem path leaked into ${page}`,
    )
    for (const node of elements) {
      const source = node.properties.src ?? node.properties.href
      if (typeof source !== "string") continue
      if (node.tagName === "script" || node.tagName === "link") {
        assert.doesNotMatch(
          source,
          /fonts\.(?:googleapis|gstatic)\.com|plausible\.io|google-analytics\.com/,
        )
      }
    }
  }
})

test("all approved guides are reachable, searchable, and retain source notices and warnings", async () => {
  const index = JSON.parse(await readFile(join(output, "static", "contentIndex.json"), "utf8"))
  const landing = elementsFor("modding/index.html")
  assert.ok(index["modding/index"], "The modding landing page must enter search")
  assert.equal(imports.guides.length, 17)
  for (const { slug } of activeImports) {
    assert.ok(index[slug], `The imported guide must enter search: ${slug}`)
    const nodes = elementsFor(slug + ".html")
    assert.ok(
      linksTo(landing, slug, "modding/index"),
      `The guide must be reachable from the topic index: ${slug}`,
    )
    assert.ok(
      linksTo(nodes, "modding/index", slug),
      `The guide must link back to its topic index: ${slug}`,
    )
    for (const node of nodes) {
      if (node.tagName === "a") {
        assert.doesNotMatch(node.properties.href ?? "", /^(?:Category|[a-z]{2,3}):/i)
      }
    }
    assert.match(documents.get(slug + ".html").html, /Source and migration status/)
  }
  for (const slug of [
    "modding/characters/creating-a-race",
    "modding/world/building-collision-navmesh",
    "modding/dialogue/find-specific-dialogue",
    "modding/world/vendor-lists",
  ]) {
    assert.match(documents.get(slug + ".html").html, /Work in progress/)
  }
  for (const [slug, names] of [
    ["modding/dialogue/find-specific-dialogue", ["Tablesalt", "Cattrina", "Shidan"]],
    ["modding/world/building-collision-navmesh", ["Boron"]],
    ["modding/world/kill-npcs-at-game-start", ["Cattrina"]],
    ["modding/characters/name-databases", ["Shidan"]],
  ]) {
    for (const name of names) assert.ok(documents.get(slug + ".html").html.includes(name))
  }
  const race = documents.get("modding/characters/creating-a-race.html").html
  assert.match(race, /Work in progress/)
  assert.match(race, /DO NOT COPY SOMEONE ELSE/)
  assert.ok(
    elementsFor("modding/assets/armor-color-maps.html").some((node) => node.tagName === "table"),
  )
})

test("source image locations and unimported references remain explicit without broken media", () => {
  let images = 0
  let references = 0
  const approvedMedia = imports.adaptations.flatMap((source) => source.media)
  const consolidated = imports.retiredGuides.filter((guide) => guide.consolidatedInto)
  const auditedImports = imports.guides.filter(
    (guide) =>
      !retiredSlugs.has(guide.slug) || consolidated.some((entry) => entry.slug === guide.slug),
  )
  for (const {
    slug,
    imagePlaceholders,
    pendingReferences,
    restoredImages = [],
    additionalImages = [],
  } of auditedImports) {
    const consolidation = consolidated.find((guide) => guide.slug === slug)
    const destination = consolidation?.consolidatedInto ?? slug
    const article = elementsFor(destination + ".html").find((node) => node.tagName === "article")
    assert.ok(article, `Missing article body: ${slug}`)
    let content = article
    if (consolidation) {
      content = undefined
      visit(article, "element", (node, start, parent) => {
        if (node.tagName === "h2" && node.properties.id === consolidation.sectionId) {
          const next = parent.children.findIndex(
            (child, position) => position > start && child.tagName === "h2",
          )
          content = {
            type: "root",
            children: parent.children.slice(start, next < 0 ? undefined : next),
          }
        }
      })
      assert.ok(content, `Missing consolidated section: ${slug}`)
    }
    const nodes = []
    visit(content, "element", (node) => {
      nodes.push(node)
    })
    const placeholders = nodes.filter((node) =>
      node.properties.className?.includes("image-placeholder"),
    )
    const pending = nodes.filter((node) => node.properties.className?.includes("pending-reference"))
    assert.equal(
      placeholders.length + restoredImages.length,
      imagePlaceholders.length,
      `Image locations changed: ${slug}`,
    )
    assert.equal(pending.length, pendingReferences.length, `Reference notices changed: ${slug}`)
    for (const node of placeholders) {
      assert.equal(node.properties.role, "note")
      assert.ok(
        node.children.some((child) => child.value?.startsWith("Place relevant image here:")),
      )
    }
    for (const node of pending) {
      assert.ok(node.children.some((child) => child.value?.includes("reference page not imported")))
    }
    const rendered = nodes.filter((node) => node.tagName === "img")
    assert.equal(
      rendered.length,
      restoredImages.length + additionalImages.length,
      `Unreviewed image in ${slug}`,
    )
    const positions = []
    let restoredIndex = 0
    const imageUrl = (node) => new URL(node.properties.src, new URL(slug + ".html", site)).href
    const additional = additionalImages.map((file) => {
      const record = approvedMedia.find((entry) => entry.sourceFile === file)
      assert.ok(record, `Unapproved additional image: ${file}`)
      assert.ok(rendered.some((node) => imageUrl(node) === new URL(record.asset, site).href))
      return new URL(record.asset, site).href
    })
    for (const node of nodes) {
      if (node.properties.className?.includes("image-placeholder")) {
        positions.push(Number(node.properties.dataImageIndex))
      } else if (node.tagName === "img" && !additional.includes(imageUrl(node))) {
        const restoration = restoredImages[restoredIndex++]
        assert.ok(restoration, `Undeclared restoration: ${slug}`)
        const record = approvedMedia.find((entry) => entry.sourceFile === restoration.sourceFile)
        assert.ok(record, `Unapproved restoration: ${restoration.sourceFile}`)
        assert.equal(
          imageUrl(node),
          new URL(record.asset, site).href,
          `Wrong restored position: ${slug}`,
        )
        assert.equal(node.properties.alt, record.alt)
        positions.push(restoration.index)
      }
    }
    assert.deepEqual(
      positions,
      imagePlaceholders.map((entry) => entry.index),
      `Historical source positions changed: ${slug}`,
    )
    assert.doesNotMatch(
      documents.get(destination + ".html").html,
      /(?:gilcdn|guildedcdn)\.com|[?&](?:amp;)?(?:Expires|Policy|Signature|Key-Pair-Id)=/i,
      `Expired signed media URL in ${slug}`,
    )
    images += placeholders.length + restoredImages.length
    references += pending.length
  }
  assert.equal(images, 46, "Every audited source image must retain its visible location")
  assert.equal(references, 8, "Every out-of-batch article reference must remain explicit")
})

test("the complete guide preserves consolidated content without retired pages", async () => {
  const article = elementsFor("modding/fcs/complete-guide.html").find(
    (node) => node.tagName === "article",
  )
  const sources = []
  const remaining = []
  visit(article, "element", (node) => {
    if (node.tagName === "img")
      sources.push(
        new URL(node.properties.src, new URL("modding/fcs/complete-guide.html", site)).href,
      )
    if (node.properties.className?.includes("image-placeholder"))
      remaining.push(Number(node.properties.dataImageIndex))
  })
  assert.deepEqual(
    sources.sort(),
    imports.adaptations[0].media.map((record) => new URL(record.asset, site).href).sort(),
  )
  assert.deepEqual(
    remaining,
    [5, 6, 7, 8],
    "Only the four unmatched legacy illustrations should remain pending",
  )
  let text = ""
  visit(article, "text", (node) => {
    text += node.value
  })
  assert.doesNotMatch(text, /For a shorter task-based learning path/)
  assert.ok(
    !article.children.some((node) => node.tagName === "h3" && node.properties.id === "sources"),
    "The removed introductory Sources section must not return",
  )
  for (const detail of [
    "Check the active destination",
    "Missing is not necessarily unwanted",
    "Review the selection",
    "Check dependencies before deleting",
    "can block = true",
    "faction > 1",
    "text0 : Hello",
    "text : Hello",
    "outpost; build materials > 100",
    "faction.anti slavery = true",
    "functionality.consumes.value > 500",
    "Steam name",
    "Increase the version on every update",
    "Dependencies",
    "appropriate tags",
    "square .jpg thumbnail below 1 MB",
    "512 x 512",
    "1024 x 1024",
    "PNG thumbnails may not display correctly",
    "private visibility",
    "concise change notes",
    "refresh control can load the description from Steam",
    "Not connected to Steam",
    "reopen it through Steam",
    "not independently retested",
  ]) {
    assert.ok(text.includes(detail), `Consolidation lost guidance: ${detail}`)
  }
  const index = JSON.parse(await readFile(join(output, "static", "contentIndex.json"), "utf8"))
  for (const slug of [
    "modding/fcs/using-the-fcs",
    "modding/fcs/searching-and-editing-data",
    "modding/fcs/managing-mods",
    "modding/fcs/checking-mod-errors",
    ...retiredSlugs,
  ]) {
    await assert.rejects(access(join(root, "content", slug + ".md")), { code: "ENOENT" })
    assert.ok(!documents.has(slug + ".html"), `Retired page or redirect still emitted: ${slug}`)
    assert.ok(!index[slug], `Retired page still searchable: ${slug}`)
    for (const [page, { elements }] of documents) {
      assert.ok(
        !linksTo(elements, slug, page.replace(/\.html$/, "")),
        `Link to retired page in ${page}: ${slug}`,
      )
    }
  }
})

test("the FCS adaptation preserves source coverage, attribution, and all restored original screenshots", async () => {
  const index = JSON.parse(await readFile(join(output, "static", "contentIndex.json"), "utf8"))
  const assigned = navigation.flatMap((section) => section.guides)
  const credits = elementsFor("credits.html")
  assert.ok(
    credits.some(
      (node) =>
        node.tagName === "a" &&
        node.properties.href ===
          "https://github.com/Atlasroar/Kenshi-Modding-Wiki/blob/main/docs/modding-imports.json",
    ),
    "Detailed original image provenance must remain accessible from Credits",
  )
  let images = 0
  for (const source of imports.adaptations) {
    assert.ok(
      credits.some((node) => node.tagName === "a" && node.properties.href === source.licenseUrl),
      "The adaptation license must be available on Credits",
    )
    for (const { slug, sourceImages } of source.guides) {
      assert.ok(index[slug], `Adapted guide must be searchable: ${slug}`)
      assert.ok(assigned.includes(slug), `Adapted guide must be in navigation: ${slug}`)
      assert.ok(
        linksTo(elementsFor("modding/index.html"), slug, "modding/index"),
        `Adapted guide must be in the complete directory: ${slug}`,
      )
      const article = elementsFor(slug + ".html").find((node) => node.tagName === "article")
      const nodes = []
      visit(article, "element", (node) => {
        nodes.push(node)
      })
      assert.ok(linksTo(nodes, "credits", slug), `Adapted guide must link to its credits: ${slug}`)
      const restored = nodes.filter((node) => node.tagName === "img")
      assert.equal(restored.length, sourceImages.length, `Missing source screenshot: ${slug}`)
      const imported = imports.guides.find((guide) => guide.slug === slug)
      assert.equal(
        nodes.filter((node) => node.properties.className?.includes("image-placeholder")).length,
        (imported?.imagePlaceholders.length ?? 0) - (imported?.restoredImages?.length ?? 0),
        `Unaccounted image placeholder: ${slug}`,
      )
      for (const [position, image] of restored.entries()) {
        const record = source.media.find((entry) => entry.sourceFile === sourceImages[position])
        assert.ok(record, `Missing image provenance: ${sourceImages[position]}`)
        assert.equal(record.guide, slug, `Outdated media destination: ${record.sourceFile}`)
        assert.equal(record.position, position + 1, `Outdated media position: ${record.sourceFile}`)
        const url = new URL(image.properties.src, new URL(slug + ".html", site))
        assert.equal(url.href, new URL(record.asset, site).href, `Wrong image position: ${slug}`)
        assert.equal(image.properties.alt, record.alt, `Missing descriptive alt text: ${slug}`)
        const bytes = await readFile(await findTarget(url))
        assert.equal(createHash("sha256").update(bytes).digest("hex"), record.sha256)
        assert.equal(createHash("sha1").update(bytes).digest("hex"), record.sourceSha1)
        assert.equal(bytes.readUInt32BE(16), record.width, "Original image width must be retained")
        assert.equal(
          bytes.readUInt32BE(20),
          record.height,
          "Original image height must be retained",
        )
        assert.match(
          record.filePage,
          /^https:\/\/kenshi\.fandom\.com\/wiki\/File:/,
          `Missing original file provenance: ${record.sourceFile}`,
        )
      }
      images += restored.length
    }
  }
  assert.equal(images, 30, "All 30 original source screenshots must be restored")
  const errorRows = []
  visit(
    elementsFor("modding/fcs/complete-guide.html").find((node) => node.tagName === "article"),
    "element",
    (node) => {
      if (node.tagName === "tr") {
        const label = node.children.find((child) => child.tagName === "td")
        if (label) {
          let text = ""
          visit(label, "text", (child) => {
            text += child.value
          })
          errorRows.push(text)
        }
      }
    },
  )
  assert.deepEqual(
    errorRows,
    [
      "Undefined reference",
      "Reference to deleted item",
      "Reference to incorrect item type",
      "No closing decorator tag",
      "Word swap not terminated",
      "Empty word swap",
      "Missing word swap",
      "Multiple primary references to dialogue line",
      "No primary reference to dialogue line",
      "Orphaned dialogue object",
      "Reference list contains too many items",
      "Item has changed type",
      "Value was the wrong type and has been converted",
      "Value is the wrong type and could not be converted",
      "Modified item undefined",
      "Item with id has already been defined by mod",
      "New values have been added",
    ],
    "All 17 source error types must remain in the adapted reference",
  )
})

test("responsive navigation preserves collapsible categories, active sections, and guide membership", () => {
  const expected = [
    "FCS",
    "World Editor",
    "Dialogue",
    "AI Packages",
    "World States",
    "Races",
    "Characters",
    "Faction",
    "Town",
    "3D Assets",
    "Animations",
    "reKenshi",
  ]
  for (const [page, { elements }] of documents) {
    const body = elements.find((node) => node.tagName === "body")
    if (!body?.properties.dataSlug) continue
    const sidebar = elements.find(
      (node) => node.tagName === "nav" && node.properties.className?.includes("guide-navigation"),
    )
    assert.ok(sidebar, `Missing modding sidebar: ${page}`)
    const menu = sidebar.children.find(
      (node) => node.type === "element" && node.properties.className?.includes("guide-menu"),
    )
    assert.equal(menu?.tagName, "details", `Missing responsive navigation disclosure: ${page}`)
    assert.equal(menu.properties.open, true, `Desktop navigation must be expanded: ${page}`)
    const toggle = menu.children.find((node) => node.tagName === "summary")
    assert.ok(toggle?.properties.className?.includes("guide-menu-toggle"))
    assert.equal(toggle.children.map((node) => node.value ?? "").join(""), "Navigation")
    const sections = []
    const primary = []
    visit(sidebar, "element", (node) => {
      if (node.tagName === "details" && node.properties.className?.includes("guide-section")) {
        sections.push(node)
      }
      if (node.tagName === "ul" && node.properties.className?.includes("guide-primary")) {
        visit(node, "element", (child) => {
          if (child.tagName === "a") primary.push(child)
        })
      }
    })
    assert.deepEqual(
      primary.map((node) => node.children.map((child) => child.value ?? "").join("")),
      ["Home", "Discussions"],
      `Navigation must start with Home and Discussions: ${page}`,
    )
    assert.ok(linksTo(primary, "index", page.replace(/\.html$/, "")))
    assert.equal(primary[0].properties.ariaCurrent, page === "index.html" ? "page" : undefined)
    assert.equal(
      primary[1].properties.href,
      "https://github.com/Atlasroar/Kenshi-Modding-Wiki/discussions",
    )
    const titles = sections.map((section) => {
      const summary = section.children.find((node) => node.tagName === "summary")
      assert.ok(summary, `Each category needs a native disclosure control: ${page}`)
      assert.ok(
        !summary.children.some((node) => node.tagName === "a"),
        `Category labels must toggle rather than navigate: ${page}`,
      )
      return summary.children.map((node) => node.value ?? "").join("")
    })
    assert.deepEqual(titles, expected, `Unexpected sidebar order in ${page}`)
    for (const [index, section] of sections.entries()) {
      const category = navigation[index]
      const active =
        category.slug === body.properties.dataSlug ||
        category.guides.includes(body.properties.dataSlug)
      assert.equal(
        Boolean(section.properties.open),
        active,
        `Only the current category should start expanded: ${page}, ${category.title}`,
      )
      const links = []
      visit(section, "element", (node) => {
        if (node.tagName === "a") links.push(node)
      })
      assert.ok(
        linksTo(links, category.slug, body.properties.dataSlug),
        `Collapsible categories must retain their overview link: ${page}, ${category.title}`,
      )
      assert.equal(
        links.length,
        category.guides.length + 1,
        `Collapsible categories must retain all their guide links: ${page}, ${category.title}`,
      )
    }
  }
  const assigned = navigation.flatMap((section) => section.guides)
  assert.equal(
    new Set(assigned).size,
    assigned.length,
    "A guide must not appear in multiple sections",
  )
  for (const { slug } of activeImports)
    assert.ok(assigned.includes(slug), `Unassigned guide: ${slug}`)
  for (const section of navigation) {
    const nodes = elementsFor(section.slug + ".html")
    assert.ok(linksTo(elementsFor("modding/index.html"), section.slug, "modding/index"))
    for (const slug of section.guides) {
      assert.ok(linksTo(nodes, slug, section.slug), `Missing section guide link: ${slug}`)
      const current = elementsFor(slug + ".html").filter(
        (node) => node.tagName === "a" && node.properties.ariaCurrent === "page",
      )
      assert.equal(current.length, 1, `The sidebar must mark the current guide once: ${slug}`)
    }
  }
})

test("the combined dialogue tutorial publishes its source steps and approved original screenshots", async () => {
  const guide = imports.additionalGuides.find(
    (entry) => entry.slug === "modding/dialogue/creating-dialogue",
  )
  assert.ok(guide, "Missing combined dialogue provenance")
  const article = elementsFor(guide.slug + ".html").find((node) => node.tagName === "article")
  const nodes = []
  let text = ""
  visit(article, "element", (node) => {
    nodes.push(node)
  })
  visit(article, "text", (node) => {
    text += node.value
  })
  for (const topic of [
    /EV_PLAYER_TALK_TO_ME/,
    /T_ME/,
    /T_TARGET_IF_PLAYER/,
    /monologue\s*=\s*False/,
    /Variations are not separate choices/,
    /GUIDE_GREETING/,
    /DC_PLAYERMONEY/,
    /20,001\s+passes/,
    /Conditions on the root/,
    /Add effects/,
    /Assign the package to an NPC/,
    /Test and troubleshoot/,
  ])
    assert.match(text, topic)
  assert.ok(linksTo(nodes, "modding/fcs/complete-guide", guide.slug))
  assert.ok(linksTo(elementsFor("dialogue/index.html"), guide.slug, "dialogue/index"))
  const images = nodes.filter((node) => node.tagName === "img")
  assert.equal(images.length, 10, "Publish the ten selected source screenshots")
  assert.equal(images.length, guide.images.length)
  for (const [position, image] of images.entries()) {
    const record = guide.images[position]
    const url = new URL(image.properties.src, new URL(guide.slug + ".html", site))
    assert.equal(url.href, new URL(record.asset, site).href)
    assert.equal(image.properties.alt, record.alt)
    const bytes = await readFile(await findTarget(url))
    assert.equal(createHash("sha256").update(bytes).digest("hex"), record.sha256)
    assert.equal(bytes.readUInt32BE(16), record.width)
    assert.equal(bytes.readUInt32BE(20), record.height)
    assert.ok(guide.sources.some((source) => source.id === record.sourceId))
  }
  for (const source of guide.sources) {
    assert.match(source.publicContentSha256, /^[a-f0-9]{64}$/)
    assert.ok(guide.images.some((image) => image.sourceId === source.id))
    assert.ok(
      elementsFor("credits.html").some(
        (node) => node.tagName === "a" && node.properties.href === source.sourceUrl,
      ),
    )
  }
  assert.match(guide.imagePermission, /explicitly confirmed permission/)
  for (const slug of [
    "modding/dialogue/conditions-and-effects",
    "modding/dialogue/find-specific-dialogue",
  ])
    assert.ok(linksTo(nodes, slug, guide.slug), `Preserve related reference: ${slug}`)
  for (const requirement of [
    /cannot speak again once the speaker changes/,
    /cannot be added as an interjector/,
    /Alternate each interjector line with player input/,
    /interjectors cannot talk\s+directly to each other/,
    /\[Continue listening\]/,
    /Include an option to leave/,
    /is character/,
    /another eligible NPC may be selected/,
    /entire chain\s+breaks if a required NPC is unavailable/,
    /all effects, including\s+Join Squad Fast, apply to the host/,
    /Dialogue Structure Overlook/,
    /existing source terms are retained/,
  ])
    assert.match(text, requirement)
  assert.equal(
    nodes.filter((node) => node.tagName === "h2").at(-1).properties.id,
    "three-person-conversations-with-the-player",
    "Keep the consolidated snippet at the end of the guide",
  )
})

test("Credits uses source summaries with guide backlinks, not contributor tables", async () => {
  const index = JSON.parse(await readFile(join(output, "static", "contentIndex.json"), "utf8"))
  assert.ok(index.credits, "Credits must be searchable")
  const article = elementsFor("credits.html").find((node) => node.tagName === "article")
  assert.ok(article, "Credits must contain an article")
  const paragraphs = []
  visit(article, "element", (node) => {
    assert.notEqual(node.tagName, "table", "Credits must not contain tables")
    if (node.tagName === "p") {
      const elements = []
      let text = ""
      visit(node, "element", (child) => {
        elements.push(child)
      })
      visit(node, "text", (child) => {
        text += child.value
      })
      paragraphs.push({ elements, text })
    }
  })
  for (const slug of navigation.flatMap((section) => section.guides)) {
    assert.ok(
      paragraphs.some(
        (paragraph) =>
          linksTo(paragraph.elements, slug, "credits") && paragraph.text.trim().length > 0,
      ),
      `Missing source description and guide backlink: ${slug}`,
    )
  }
  for (const [slug, source] of [
    [
      "modding/dialogue/creating-dialogue",
      "https://steamcommunity.com/sharedfiles/filedetails/?id=1444279946",
    ],
    [
      "modding/dialogue/creating-dialogue",
      "https://steamcommunity.com/sharedfiles/filedetails/?id=804686889",
    ],
    ["modding/fcs/complete-guide", "https://kenshi.fandom.com/wiki/Using_the_FCS"],
    ["modding/world/in-game-editor", "https://lost-blog.com/in-game-editor/"],
    [
      "modding/world/vendor-lists",
      "https://steamcommunity.com/app/233860/discussions/3/1739980540120440391/",
    ],
    [
      "modding/save-editing/claim-town-ownership",
      "https://steamcommunity.com/sharedfiles/filedetails/?id=1370334383",
    ],
    [
      "modding/world/building-collision-navmesh",
      "https://www.reddit.com/r/Kenshi/comments/upmm4q/modular_fortresses_for_lita_done/",
    ],
  ]) {
    assert.ok(
      paragraphs.some(
        (paragraph) =>
          linksTo(paragraph.elements, slug, "credits") &&
          paragraph.elements.some(
            (node) => node.tagName === "a" && node.properties.href === source,
          ),
      ),
      `Source must appear alongside its guide backlink: ${slug}`,
    )
  }
  let text = ""
  visit(article, "text", (node) => {
    text += node.value
  })
  assert.match(text, /No public\s+source URL was recorded/)
  assert.match(text, /Wiki-team reuse permission/)
  assert.doesNotMatch(text, /Recorded uploader|Recorded credits and sources/)
  for (const [page, { elements }] of documents) {
    const body = elements.find((node) => node.tagName === "body")
    if (!body?.properties.dataSlug || page === "404.html") continue
    const sidebar = elements.find(
      (node) => node.tagName === "nav" && node.properties.className?.includes("guide-navigation"),
    )
    const links = []
    visit(sidebar, "element", (node, _index, parent) => {
      if (node.tagName === "a" && node.properties.className?.includes("guide-credits")) {
        assert.ok(
          parent?.properties.className?.includes("guide-menu-content"),
          "Credits must be a standalone link, not an expandable guide section",
        )
        links.push(node)
      }
    })
    assert.equal(links.length, 1, `Missing standalone Credits item: ${page}`)
    assert.ok(linksTo(links, "credits", page.replace(/\.html$/, "")))
    assert.equal(links[0].properties.ariaCurrent, page === "credits.html" ? "page" : undefined)
  }
})

test("external source links stay on Credits with only the approved community-link exceptions", () => {
  for (const [page, { elements }] of documents) {
    const body = elements.find((node) => node.tagName === "body")
    if (!body?.properties.dataSlug || page === "credits.html") continue
    const communityLinks = new Set()
    const sidebar = elements.find(
      (node) => node.tagName === "nav" && node.properties.className?.includes("guide-navigation"),
    )
    if (sidebar)
      visit(sidebar, "element", (node) => {
        if (
          node.tagName === "a" &&
          node.properties.href === "https://github.com/Atlasroar/Kenshi-Modding-Wiki/discussions"
        )
          communityLinks.add(node)
      })
    if (page === "index.html") {
      const article = elements.find((node) => node.tagName === "article")
      visit(article, "element", (node) => {
        if (
          node.tagName === "a" &&
          node.properties.href === "https://github.com/Atlasroar/Kenshi-Modding-Wiki/wiki"
        )
          communityLinks.add(node)
      })
    }
    for (const node of elements) {
      if (node.tagName !== "a" || typeof node.properties.href !== "string") continue
      if (communityLinks.has(node)) continue
      const target = new URL(node.properties.href, new URL(page, site))
      if (target.protocol !== "http:" && target.protocol !== "https:") continue
      assert.equal(target.origin, site.origin, `External link outside Credits: ${page}: ${target}`)
    }
  }
  const credits = elementsFor("credits.html")
  for (const source of [
    "https://kenshi.fandom.com/wiki/Using_the_FCS",
    "https://lost-blog.com/fcs-interface/",
    "https://lost-blog.com/in-game-editor/",
    "https://regexr.com/",
    "https://www.reddit.com/r/Kenshi/comments/upmm4q/modular_fortresses_for_lita_done/",
  ]) {
    assert.ok(
      credits.some((node) => node.tagName === "a" && node.properties.href === source),
      `Source reference must be preserved on Credits: ${source}`,
    )
  }
})

test("maintainer documents stay out of site search and old URLs redirect to the Wiki", async () => {
  const index = JSON.parse(await readFile(join(output, "static", "contentIndex.json"), "utf8"))
  for (const [slug, page] of Object.entries({
    "guides/index": "Home",
    "guides/contributing": "Writing-Guides",
    "guides/styling": "CSS-and-Theme",
    contributing: "Writing-Guides",
  })) {
    assert.equal(index[slug], undefined, `Maintainer page leaked into site search: ${slug}`)
    const nodes = elementsFor(slug + ".html")
    const canonical = nodes.find(
      (node) => node.tagName === "link" && node.properties.rel?.includes("canonical"),
    )
    assert.equal(
      canonical?.properties.href,
      `https://github.com/Atlasroar/Kenshi-Modding-Wiki/wiki/${page}`,
    )
    assert.ok(
      nodes.some(
        (node) =>
          node.tagName === "meta" &&
          node.properties.name === "robots" &&
          node.properties.content === "noindex",
      ),
    )
    assert.match(documents.get(slug + ".html").html, /window\.location\.hash/)
  }
  assert.ok(
    elementsFor("credits.html").some(
      (node) =>
        node.tagName === "a" &&
        node.properties.href === "https://github.com/Atlasroar/Kenshi-Modding-Wiki/wiki",
    ),
  )
})

test("the production pipeline excludes unpublished notes and their assets", async () => {
  const temporary = await mkdtemp(join(tmpdir(), "kenshi-publication-test-"))
  try {
    const content = join(temporary, "content")
    const built = join(temporary, "output")
    await mkdir(content)
    await writeFile(
      join(content, "index.md"),
      "---\ntitle: Reviewed fixture\npublish: true\n---\nReviewed fixture.\n",
    )
    await writeFile(
      join(content, "unreviewed.md"),
      "---\ntitle: Unreviewed fixture\n---\n![Unreviewed](unreviewed.svg)\n",
    )
    await writeFile(
      join(content, "unreviewed.svg"),
      '<svg xmlns="http://www.w3.org/2000/svg"><title>Unreviewed fixture</title></svg>',
    )
    const result = spawnSync(
      process.execPath,
      [
        join(root, "quartz", "bootstrap-cli.mjs"),
        "build",
        "--directory",
        content,
        "--output",
        built,
      ],
      { cwd: root, encoding: "utf8", timeout: 60_000 },
    )
    assert.ifError(result.error)
    assert.equal(result.status, 0, result.stdout + result.stderr)
    await access(join(built, "index.html"))
    await assert.rejects(access(join(built, "unreviewed.html")), { code: "ENOENT" })
    await assert.rejects(access(join(built, "unreviewed.svg")), { code: "ENOENT" })
    const index = JSON.parse(await readFile(join(built, "static", "contentIndex.json"), "utf8"))
    assert.equal(index.unreviewed, undefined, "Unreviewed notes must not enter search")
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
})
