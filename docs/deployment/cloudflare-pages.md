# Cloudflare Pages deployment

The site is configured for Astro static output. The repository build command is `npm run build`; Cloudflare Pages should use `dist` as its build output directory. The Astro `site` setting uses the expected `samngoclinh.pages.dev` address. The repository pins Node.js 22.23.4 for the Pages build image and declares Node.js 20.19 or newer for local development.

## Connect the repository

The Cloudflare account owner must complete these one-time dashboard steps:

1. In Cloudflare, open **Workers & Pages** and create a Pages project connected to `daovanduc/samngoclinh`.
2. Select `prototype/designed-section-editor`, the repository default branch configured in Decap. If the GitHub default branch is renamed, update `backend.branch` in `public/admin/config.yml` and the Pages production branch together.
3. Set build command to `npm run build` and output directory to `dist`. Cloudflare Pages reads the Node version from `.node-version`.
4. Save the project and wait for its first successful deployment. Cloudflare will assign the `pages.dev` hostname.
5. Confirm that a later repository commit creates a Pages deployment and that the public site shows that commit's content.
6. Enable Cloudflare email notifications for failed production deployments.

This repository change supplies the build and output configuration only. It cannot create the Cloudflare project, authorize GitHub, or confirm the live hostname without the owner's Cloudflare account access.

## Local verification

Run `npm install`, `npx playwright install chromium`, `npm run build`, and `npm test`. The Playwright smoke suite serves Astro's generated `dist` output and checks the listing at desktop, tablet, and phone widths, including keyboard navigation for the mobile menu. Cloudflare Pages documents `dist` as the Astro output directory and supports selecting Node via `.node-version` ([build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/), [build image](https://developers.cloudflare.com/pages/configuration/build-image/)).

