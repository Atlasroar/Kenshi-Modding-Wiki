import { QuartzComponent } from "../quartz/components/types"
import { resolveRelative } from "../quartz/util/path"

const SiteFooter: QuartzComponent = ({ allFiles, fileData }) => {
  const credits = allFiles.find((file) => file.slug === "credits")
  return (
    <footer>
      <p>Created with Quartz.</p>
      {credits?.slug && fileData.slug && (
        <p>
          <a class="internal" href={resolveRelative(fileData.slug, credits.slug)}>
            Credits, sources, and website information
          </a>
        </p>
      )}
    </footer>
  )
}

export default SiteFooter
