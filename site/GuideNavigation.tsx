import { JSX } from "preact"
import { QuartzComponent } from "../quartz/components/types"
import { QuartzPluginData } from "../quartz/plugins/vfile"
import { resolveRelative } from "../quartz/util/path"
import navigation from "./navigation.json"
import script from "./navigation.inline"

interface GuideSection {
  title: string
  slug: string
  guides: string[]
  children?: GuideSection[]
}

const sections: GuideSection[] = navigation

const GuideNavigation: QuartzComponent = ({ allFiles, fileData }) => {
  const pages = new Map<string, QuartzPluginData>()
  for (const file of allFiles) {
    if (file.slug) pages.set(file.slug, file)
  }
  const current = fileData.slug
  if (!current) throw new Error("Guide navigation requires a page slug")
  const credits = pages.get("credits")
  const home = pages.get("index")
  const isActive = (section: GuideSection): boolean =>
    section.slug === current ||
    section.guides.includes(current) ||
    (section.children?.some(isActive) ?? false)
  const renderSection = (section: GuideSection): JSX.Element | null => {
    const landing = pages.get(section.slug)
    if (!landing?.slug) return null
    return (
      <li>
        <details class="guide-section" open={isActive(section)}>
          <summary>{section.title}</summary>
          <ul>
            <li>
              <a
                class="internal guide-section-link"
                href={resolveRelative(current, landing.slug)}
                aria-current={section.slug === current ? "page" : undefined}
              >
                Overview
              </a>
            </li>
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
            {section.children?.map(renderSection)}
          </ul>
        </details>
      </li>
    )
  }

  return (
    <nav aria-label="Site navigation" class="guide-navigation">
      <details class="guide-menu" open>
        <summary class="guide-menu-toggle">Navigation</summary>
        <div class="guide-menu-content">
          <ul class="guide-primary">
            {home?.slug && (
              <li>
                <a
                  class="internal"
                  href={resolveRelative(current, home.slug)}
                  aria-current={current === home.slug ? "page" : undefined}
                >
                  Home
                </a>
              </li>
            )}
            <li>
              <a href="https://github.com/Atlasroar/Kenshi-Modding-Wiki/discussions">Discussions</a>
            </li>
          </ul>
          <ul class="guide-sections">{sections.map(renderSection)}</ul>
          {credits?.slug && (
            <a
              class="internal guide-credits"
              href={resolveRelative(current, credits.slug)}
              aria-current={current === credits.slug ? "page" : undefined}
            >
              Credits
            </a>
          )}
        </div>
      </details>
    </nav>
  )
}

GuideNavigation.afterDOMLoaded = script

export default GuideNavigation
