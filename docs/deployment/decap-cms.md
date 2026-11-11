# Decap CMS setup

The CMS UI and collections are served from `/admin/` on the deployed site (the source files are `public/admin/index.html` and `public/admin/config.yml`). For local Astro development, use `/admin/index.html`. The Cloudflare Pages project and Turbo site have been created; hosted login also requires the production origin in the Turbo site's Admin interface URLs.

1. The Turbo site is connected to `daovanduc/samngoclinh`; its config path is `public/admin/config.yml`.
2. Add `https://samngoclinh.pages.dev` and `http://127.0.0.1:4322` to the site's Admin interface URLs. These are origins, so omit `/admin/`.
3. The site's public ID is set in `backend.turbo_site_id`. The CMS `backend.branch` is `prototype/designed-section-editor`, matching the Cloudflare Pages production branch.

The Turbo site ID is public configuration; do not put GitHub tokens or app secrets in this repository. Repository content and uploaded images remain in Git.

