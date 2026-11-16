import { Comments, type CommentsOptions } from "@quartz-community/comments"
import { QuartzComponent } from "../quartz/components/types"
import navigation from "./navigation.json"

interface Section {
  slug: string
  guides: string[]
  children?: Section[]
}

function sectionSlugs(section: Section): string[] {
  return [section.slug, ...section.guides, ...(section.children?.flatMap(sectionSlugs) ?? [])]
}

const options: Omit<CommentsOptions["options"], "category" | "categoryId"> = {
  repo: "Atlasroar/Kenshi-Modding-Wiki",
  repoId: "R_kgDOVvcLwA",
  mapping: "pathname",
  strict: true,
  reactionsEnabled: true,
  inputPosition: "top",
  themeUrl: "https://giscus.app/themes",
  lightTheme: "light",
  darkTheme: "dark_dimmed",
  lang: "en",
}

const categories = navigation.map((section) => ({
  slugs: sectionSlugs(section),
  component: Comments({
    provider: "giscus",
    options: {
      ...options,
      category: section.discussion.name,
      categoryId: section.discussion.id,
    },
  }),
}))
const commentsBySlug = new Map(
  categories.flatMap(({ slugs, component }) => slugs.map((slug) => [slug, component] as const)),
)

const GuideComments: QuartzComponent = (props) => {
  const component = props.fileData.slug && commentsBySlug.get(props.fileData.slug)
  return component ? component(props) : null
}

GuideComments.afterDOMLoaded = categories[0].component.afterDOMLoaded

export default GuideComments
