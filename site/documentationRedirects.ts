import { QuartzEmitterPlugin } from "../quartz/plugins/types"
import { write } from "../quartz/plugins/emitters/helpers"
import { FullSlug } from "../quartz/util/path"

export const documentationRedirects = {
  "guides/index": "Home",
  "guides/contributing": "Writing-Guides",
  "guides/styling": "CSS-and-Theme",
  contributing: "Writing-Guides",
}

export const DocumentationRedirects: QuartzEmitterPlugin = () => ({
  name: "DocumentationRedirects",
  async emit(ctx) {
    const files = []
    for (const [slug, page] of Object.entries(documentationRedirects)) {
      const target = `https://github.com/Atlasroar/Kenshi-Modding-Wiki/wiki/${page}`
      const content = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Documentation moved</title><link rel="canonical" href="${target}"><script>window.location.replace(${JSON.stringify(target)} + window.location.hash)</script></head><body><p>Website documentation has moved to the <a href="${target}">GitHub Wiki</a>.</p></body></html>`
      files.push(await write({ ctx, slug: slug as FullSlug, ext: ".html", content }))
    }
    return files
  },
})
