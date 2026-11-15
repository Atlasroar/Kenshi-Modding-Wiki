import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { External } from "./quartz/components/external"
import Flex from "./quartz/components/Flex"
import GuideNavigation from "./site/GuideNavigation"
import { DocumentationRedirects } from "./site/documentationRedirects"

const config = await loadQuartzConfig()
config.plugins.emitters.push(DocumentationRedirects())
export default config
export const layout = await loadQuartzLayout({
  defaults: {
    left: [
      External("PageTitle"),
      Flex({
        direction: "row",
        gap: "0.5rem",
        components: [
          { Component: External("Search"), grow: true },
          { Component: External("Darkmode") },
        ],
      }),
      GuideNavigation,
    ],
  },
})
