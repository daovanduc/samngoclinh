# Cloudflare Pages deployment

The site is configured for Astro static output. The repository build command is `npm run build`; Cloudflare Pages should use `dist` as its build output directory. The Astro `site` setting uses the expected `samngoclinh.pages.dev` address. The repository pins Node.js 22.23.4 for the Pages build image and declares Node.js 20.19 or newer for local development.

## Current deployment

The Cloudflare Pages project `samngoclinh` is connected to `daovanduc/samngoclinh`. Its production branch is `prototype/designed-section-editor` (the repository default branch), with the Astro preset, build command `npm run build`, and output directory `dist`. The public site is <https://samngoclinh.pages.dev>.

Cloudflare Pages reads the Node version from `.node-version`. If this production branch changes after the implementation PR is merged, update the Pages production branch and `backend.branch` in `public/admin/config.yml` together.

## Local verification

Run `npm install`, `npx playwright install chromium`, `npm run build`, and `npm test`. The Playwright smoke suite serves Astro's generated `dist` output and checks the listing at desktop, tablet, and phone widths, including keyboard navigation for the mobile menu. Cloudflare Pages documents `dist` as the Astro output directory and supports selecting Node via `.node-version` ([build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/), [build image](https://developers.cloudflare.com/pages/configuration/build-image/)).

