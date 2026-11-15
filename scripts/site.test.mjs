import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { access, glob, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { extname, join, resolve, sep } from "node:path"
import test from "node:test"
import { fromHtml } from "hast-util-from-html"
import { visit } from "unist-util-visit"
import yaml from "js-yaml"

const root = resolve(import.meta.dirname, "..")
const output = join(root, "public")
const config = yaml.load(await readFile(join(root, "quartz.config.yaml"), "utf8"))
const imports = JSON.parse(await readFile(join(root, "docs", "modding-imports.json"), "utf8"))
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
  for (const { slug } of imports.guides) {
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
  assert.match(documents.get("modding/fcs/tech-overhaul-notes.html").html, /Development notes/)
})

test("source image locations and unimported references remain explicit without broken media", () => {
  let images = 0
  let references = 0
  for (const { slug, imagePlaceholders, pendingReferences } of imports.guides) {
    const article = elementsFor(slug + ".html").find((node) => node.tagName === "article")
    assert.ok(article, `Missing article body: ${slug}`)
    const nodes = []
    visit(article, "element", (node) => {
      nodes.push(node)
    })
    const placeholders = nodes.filter((node) =>
      node.properties.className?.includes("image-placeholder"),
    )
    const pending = nodes.filter((node) => node.properties.className?.includes("pending-reference"))
    assert.equal(placeholders.length, imagePlaceholders.length, `Image locations changed: ${slug}`)
    assert.equal(pending.length, pendingReferences.length, `Reference notices changed: ${slug}`)
    for (const [number, node] of placeholders.entries()) {
      assert.equal(String(node.properties.dataImageIndex), String(number + 1))
      assert.equal(node.properties.role, "note")
      assert.ok(
        node.children.some((child) => child.value?.startsWith("Place relevant image here:")),
      )
    }
    for (const node of pending) {
      assert.ok(node.children.some((child) => child.value?.includes("reference page not imported")))
    }
    assert.ok(!nodes.some((node) => node.tagName === "img"), `Unreviewed image in ${slug}`)
    assert.doesNotMatch(
      documents.get(slug + ".html").html,
      /(?:gilcdn|guildedcdn)\.com|[?&](?:amp;)?(?:Expires|Policy|Signature|Key-Pair-Id)=/i,
      `Expired signed media URL in ${slug}`,
    )
    images += placeholders.length
    references += pending.length
  }
  assert.equal(images, 46, "Every audited source image must retain its visible location")
  assert.equal(references, 8, "Every out-of-batch article reference must remain explicit")
})

test("the FCS adaptation preserves its full source coverage, attribution, and pending image positions", async () => {
  const index = JSON.parse(await readFile(join(output, "static", "contentIndex.json"), "utf8"))
  const assigned = navigation.flatMap((section) => section.guides)
  const credits = elementsFor("credits.html")
  let images = 0
  for (const source of imports.adaptations) {
    assert.ok(
      credits.some((node) => node.tagName === "a" && node.properties.href === source.licenseUrl),
      "The adaptation license must be available on Credits",
    )
    for (const { slug, imagePlaceholders } of source.guides) {
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
      assert.deepEqual(
        nodes
          .filter((node) => node.properties.className?.includes("image-placeholder"))
          .map((node) => node.properties.dataImageSource),
        imagePlaceholders,
        `Source screenshot positions or identities changed: ${slug}`,
      )
      assert.ok(!nodes.some((node) => node.tagName === "img"), `Unreviewed screenshot in ${slug}`)
      images += imagePlaceholders.length
    }
  }
  assert.equal(images, 30, "All 30 source screenshots need explicit pending positions")
  const errorRows = []
  visit(
    elementsFor("modding/fcs/checking-mod-errors.html").find((node) => node.tagName === "article"),
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

test("the sidebar presents the twelve requested sections and preserves guide membership", async () => {
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
    if (!body?.properties.dataSlug || page === "404.html") continue
    const sidebar = elements.find(
      (node) => node.tagName === "nav" && node.properties.className?.includes("guide-navigation"),
    )
    assert.ok(sidebar, `Missing modding sidebar: ${page}`)
    const sections = []
    visit(sidebar, "element", (node) => {
      if (node.tagName === "details" && node.properties.className?.includes("guide-section")) {
        sections.push(node)
      }
    })
    const titles = sections.map((section) => {
      const summary = section.children.find((node) => node.tagName === "summary")
      const link = summary.children.find((node) => node.tagName === "a")
      return link.children.map((node) => node.value ?? "").join("")
    })
    assert.deepEqual(titles, expected, `Unexpected sidebar order in ${page}`)
  }
  const assigned = navigation.flatMap((section) => section.guides)
  assert.equal(
    new Set(assigned).size,
    assigned.length,
    "A guide must not appear in multiple sections",
  )
  for (const { slug } of imports.guides)
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
  const scripts = await Promise.all(
    elementsFor("index.html")
      .filter((node) => node.tagName === "script" && typeof node.properties.src === "string")
      .map(async (node) => {
        const url = new URL(node.properties.src, site)
        const source = await readFile(await findTarget(url), "utf8")
        const modules = await Promise.all(
          [...source.matchAll(/\bimport\(["'](\.{1,2}\/[^"']+)["']\)/g)].map(async ([, path]) =>
            readFile(await findTarget(new URL(path, url)), "utf8"),
          ),
        )
        return [source, ...modules].join("\n")
      }),
  )
  assert.ok(
    scripts.some((script) => script.includes("guide-menu")),
    "The mobile navigation script must be included in the generated page resources",
  )
})

test("Credits is a standalone navigation item and credits every published guide", async () => {
  const index = JSON.parse(await readFile(join(output, "static", "contentIndex.json"), "utf8"))
  assert.ok(index.credits, "Credits must be searchable")
  const article = elementsFor("credits.html").find((node) => node.tagName === "article")
  assert.ok(article, "Credits must contain an article")
  const rows = []
  visit(article, "element", (node) => {
    if (node.tagName === "tr") {
      const elements = []
      let text = ""
      visit(node, "element", (child) => {
        elements.push(child)
      })
      visit(node, "text", (child) => {
        text += child.value
      })
      rows.push({ elements, text })
    }
  })
  for (const slug of navigation.flatMap((section) => section.guides)) {
    assert.ok(
      rows.some((row) => linksTo(row.elements, slug, "credits")),
      `Missing guide credit entry: ${slug}`,
    )
  }
  for (const [slug, names] of [
    ["modding/dialogue/find-specific-dialogue", ["Tablesalt", "Cattrina", "Shidan"]],
    ["modding/world/vendor-lists", ["timor1234", "Cattrina", "Frankiewuzhere"]],
    ["modding/world/building-collision-navmesh", ["Boron"]],
    ["modding/world/kill-npcs-at-game-start", ["Cattrina"]],
    ["modding/characters/name-databases", ["Shidan"]],
  ]) {
    const row = rows.find((entry) => linksTo(entry.elements, slug, "credits"))
    for (const name of names)
      assert.ok(row?.text.includes(name), `Missing credit: ${slug}: ${name}`)
  }
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
          parent?.properties.className?.includes("guide-menu"),
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

test("external website links appear only on Credits, never on guide pages or their footer", () => {
  for (const [page, { elements }] of documents) {
    const body = elements.find((node) => node.tagName === "body")
    if (!body?.properties.dataSlug || page === "credits.html") continue
    for (const node of elements) {
      if (node.tagName !== "a" || typeof node.properties.href !== "string") continue
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
