# Publishing and rollback

The configured project URL is
<https://atlasroar.github.io/Kenshi-Modding-Wiki/>.

## Release path

1. Make reviewed changes in a branch and open a pull request.
2. The **Site checks and Pages / Build and verify** job installs the locked
   dependencies, checks types and formatting, builds the production site, and
   checks generated links, search, publication filtering, and image markers.
3. Review the content and merge the pull request only after checks pass.
4. A push to `main` repeats the same checks, uploads only `public/`, and deploys
   that artifact through the `github-pages` environment.
5. Verify the public homepage, a direct article URL, search, and navigation.
   The production path is `/Kenshi-Modding-Wiki/`, not the domain root.

Pull requests never upload a Pages artifact or run the deployment job. Build
jobs have read-only repository access. Only the deployment job receives Pages
write and OIDC permissions. Official actions are pinned to commit SHAs.

## Repository settings

In **Settings > Pages**, choose **GitHub Actions** as the build source. The
`github-pages` environment must allow deployments from `main`; keep any required
reviewer protection in place.

The site URL must agree with `configuration.baseUrl` in `quartz.config.yaml`.
Changing the repository name or adding a custom domain requires reviewing that
setting and rerunning the production-subpath checks.

The workflow also supports **Run workflow** from the Actions tab. Only a run on
`main` can deploy; a manual run on another branch performs checks only.

## If a release fails

Failed checks prevent the deployment job from running. Inspect the failed job's
log before retrying. Do not upload unverified files manually or commit generated
output to work around a failed build.

To roll back published content, revert the offending change through a reviewed
pull request and merge it into `main`. The same pipeline builds and publishes
the reverted source. If no source correction is needed, rerun the successful
`main` workflow to redeploy its verified build.

The local source vault is not a deployment dependency. A clean checkout plus
Node.js 24 and `npm ci` must be sufficient.
