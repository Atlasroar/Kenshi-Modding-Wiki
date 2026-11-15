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

test("representative pages retain custom callouts, aliases, tables, and page classes", () => {
  const home = elementsFor("index.html")
  const guide = elementsFor("guides/contributing.html")
  assert.ok(home.some((node) => node.properties.dataCallout === "multi-column"))
  assert.equal(home.filter((node) => node.properties.dataCallout === "paper_gradient_1").length, 2)
  assert.ok(guide.some((node) => node.properties.dataCallout === "infobox"))
  assert.ok(
    guide.some(
      (node) =>
        node.properties.dataCallout === "warning" &&
        node.children.some(
          (child) =>
            child.type === "element" &&
            child.children.some(
              (nested) => nested.type === "element" && nested.properties.dataCallout === "note",
            ),
        ),
    ),
    "The warning must contain its nested note",
  )
  assert.ok(guide.some((node) => node.tagName === "table"))
  assert.ok(
    guide.some(
      (node) => node.tagName === "article" && node.properties.className?.includes("page-kenshi"),
    ),
  )
  assert.ok(documents.has("contributing.html"), "The approved alias must produce a redirect")
  assert.ok(
    home.some(
      (node) =>
        node.tagName === "a" &&
        node.properties.href?.endsWith("contributing#publication-checklist"),
    ),
  )
})

test("published pages enter search without remote font or analytics resources", async () => {
  const index = JSON.parse(await readFile(join(output, "static", "contentIndex.json"), "utf8"))
  assert.ok(index.index, "The homepage must enter search")
  assert.ok(index["guides/contributing"], "The guide must enter search")
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
  const normalize = (url) =>
    url.pathname
      .replace(/\.html$/, "")
      .replace(/\/index$/, "")
      .replace(/\/$/, "")
  const linksTo = (nodes, slug, from) =>
    nodes.some(
      (node) =>
        node.tagName === "a" &&
        typeof node.properties.href === "string" &&
        normalize(new URL(node.properties.href, new URL(from + ".html", site))) ===
          normalize(new URL(slug, site)),
    )
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
