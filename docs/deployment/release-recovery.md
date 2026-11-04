# Publishing and recovery runbook

## Before publishing

Content is validated as part of `npm run build`: required category, product, and article fields, unique URL slugs within each collection, valid product-to-category references, and supported homepage sections must pass before Astro diagnostics and static generation. GitHub Actions reports both **Content validation and production build** and **Generated-site browser smoke** on pull requests and pushes to `main`. Configure repository branch protection to require these two status checks for ordinary code changes. Cloudflare Pages must use `npm run build` and `dist`; its own build then rejects invalid CMS commits before publishing.

## Failed deployment email (owner setup)

In the Cloudflare account that owns the Pages project:

1. Open the Cloudflare dashboard and select **Notifications** from the account navigation.
2. Choose **Create notification** and select the **Pages** / **Project updates** notification type.
3. Set **Pages projects** to this site, **Environments** to **Production**, and **Different events** to **Deployment failed**.
4. Set the notification destination to the owner’s monitored email address and save the rule.
5. Confirm the rule appears in Notifications. Cloudflare sends Pages project updates, including deployment failures, on all plans; account access is required to set and verify the recipient.

## If a deployment fails

1. Open GitHub Actions for the repository and read the failing status and log. For a Cloudflare build failure, open **Workers & Pages → this Pages project → Deployments**, select the failed production deployment, and inspect its build log.
2. For invalid content or a code/build issue, fix forward: correct the CMS record or make a new repository commit, then wait for validation, build, browser smoke, and Cloudflare deployment to complete. Do not pay to bypass a free-plan quota.
3. For an accidentally published bad deployment, in **Deployments → All deployments**, open the three-dot menu on the last known-good successful production deployment, choose **Rollback to this deployment**, and confirm. Then correct the repository using a revert or forward fix so future deployments match the recovered content. Only successful production deployments are rollback targets; previews are not.
4. If the monthly free build quota is exhausted, leave the last source intact and wait for the quota reset before retrying the same or a corrected commit. Do not enable paid overages. Cloudflare does not document a guarantee about serving the previous deployment during quota exhaustion, so verify the public site after recovery.

## Content backup and account recovery

- At least monthly, make an offline copy of the entire repository, including `src/data` and uploaded images under `public/assets/images/uploads`, on storage the owner already has. Keep dated copies so a known-good snapshot can be restored if Git history or the account is unavailable.
- Secure the GitHub, Decap Turbo, and Cloudflare accounts with passkeys or strong two-factor authentication. Save each account’s recovery codes offline in a secure place separate from the device used to sign in. Never commit passwords, tokens, or recovery codes.
- Restore content from Git history by reverting the offending content commit, or restore a known-good full-repository backup, then rebuild and publish through the normal checked path.

## Hosted publishing smoke check

After the owner creates the Decap Turbo site and connects Cloudflare Pages, publish a harmless representative content edit through `/admin/`. Record the changed content and commit in GitHub, wait for the production deployment to succeed in Cloudflare, and confirm the updated text appears at the public `pages.dev` URL. The repository currently contains the `REPLACE_WITH_DECAP_TURBO_SITE_ID` placeholder, so this owner-account setup and hosted verification remain outstanding.
