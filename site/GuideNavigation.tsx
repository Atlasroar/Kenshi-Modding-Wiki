import { QuartzComponent } from "../quartz/components/types"
import { QuartzPluginData } from "../quartz/plugins/vfile"
import { resolveRelative } from "../quartz/util/path"
import navigation from "./navigation.json"
import script from "./navigation.inline"

const GuideNavigation: QuartzComponent = ({ allFiles, fileData }) => {
  const pages = new Map<string, QuartzPluginData>()
  for (const file of allFiles) {
    if (file.slug) pages.set(file.slug, file)
  }
  const current = fileData.slug
  if (!current) throw new Error("Guide navigation requires a page slug")
  const credits = pages.get("credits")

  return (
    <nav aria-label="Modding guide sections" class="guide-navigation">
      <details class="guide-menu" open>
        <summary>Modding guides</summary>
        <ul class="guide-sections">
          {navigation.map((section) => {
            const landing = pages.get(section.slug)
            if (!landing?.slug) return null
            const active = section.slug === current || section.guides.includes(current)
            return (
              <li>
                <details open={active} class="guide-section">
                  <summary>
                    <a
                      class="internal"
                      href={resolveRelative(current, landing.slug)}
                      aria-current={section.slug === current ? "page" : undefined}
                    >
                      {section.title}
                    </a>
                  </summary>
                  {section.guides.length ? (
                    <ul>
                      {section.guides.map((slug) => {
                        const guide = pages.get(slug)
                        if (!guide?.slug) return null
                        return (
                          <li>
                            <a
                              class="internal"
                              href={resolveRelative(current, guide.slug)}
                              aria-current={slug === current ? "page" : undefined}
                            >
                              {guide.frontmatter?.title ?? guide.slug}
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <p class="guide-coverage">Guide coverage is being prepared.</p>
                  )}
                </details>
              </li>
            )
          })}
        </ul>
        {credits?.slug && (
          <a
            class="internal guide-credits"
            href={resolveRelative(current, credits.slug)}
            aria-current={current === credits.slug ? "page" : undefined}
          >
            Credits
          </a>
        )}
      </details>
    </nav>
  )
}

GuideNavigation.afterDOMLoaded = script
export default GuideNavigation
