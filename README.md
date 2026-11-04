# Thảo Nguyên site

This repository builds a static product catalog and news site with Astro. The site pages are generated from JSON files in `src/data`; visitors do not need a database or a CMS API at runtime. Decap CMS is the editor for changing those files through a browser.

## Run the site on your computer

Use Node.js 22.23.4 and npm. That exact build version is recorded in `.node-version`; some installed dependencies require a newer Node version than the package's minimum engine declaration.

On Windows with fnm, select the pinned version before installing packages:

```powershell
fnm install 22.23.4
fnm use 22.23.4
node --version
```

The last command should print `v22.23.4`. If fnm is not installed, install Node.js 22.23.4 with the official Windows installer and open a new PowerShell window.

In PowerShell, open the repository folder and run:

```powershell
npm ci
npm run dev
```

Open <http://localhost:4321> in your browser. Stop the local server with `Ctrl+C` in the PowerShell window.

If you do not have the project folder yet:

```powershell
git clone --branch codex/implement-13 --single-branch https://github.com/daovanduc/samngoclinh.git
cd samngoclinh
npm ci
npm run dev
```

`npm ci` requires the `package-lock.json` in the implementation branch. If npm reports that the lockfile is missing, check that you are in the `samngoclinh` folder on `codex/implement-13` before running it:

```powershell
git branch --show-current
Test-Path package-lock.json
```

If `npm ci` fails on Windows with `EPERM` while unlinking a Rollup `.node` file, stop any `npm run dev` or `npm run preview` server with `Ctrl+C` and close other terminal sessions running this project. Then reopen PowerShell, select Node.js 22.23.4 as above, and run `npm ci` again. The file is a native dependency that Windows cannot replace while another process has it open.

The implementation branch is `codex/implement-13`; its changes are in [PR #17](https://github.com/daovanduc/samngoclinh/pull/17). The repository's default branch does not include this work until the PR is merged.

## How the site is built

Astro reads the content files and generates plain HTML pages:

- `src/data/products/*.json` contains one record per product and package size. The filename supplies its URL slug. A product's `category` must match a category filename.
- `src/data/categories/*.json` contains category names, images, descriptions, and display order. Its filename supplies the category URL slug.
- `src/data/news/*.json` contains article content. Each article's `slug` field supplies its URL.
- `src/data/pages/products.json` contains the ordered homepage sections. The order in the `sections` array is the order visitors see.
- `public/assets/images/` contains site images. Images uploaded through the CMS go under `public/assets/images/uploads/`.

Product detail pages show optional product fields only when they have content. Related products are selected from the same category. The homepage section editor supports the designed section types (hero, categories, products, certificates, and contact); it does not offer freeform page layout controls.

## Change content

Once Decap Turbo is configured, open `/admin/` on the deployed site, sign in, edit products/categories/news or the homepage sections, and save. Decap commits the changes to GitHub. A commit to the configured production branch runs the checks and, after Cloudflare Pages is connected, triggers a static deployment.

The CMS configuration is in `public/admin/config.yml`. Its `turbo_site_id` is currently a placeholder, so CMS login and publishing are not ready yet. For setup, see:

- [Decap CMS setup](docs/deployment/decap-cms.md)
- [Cloudflare Pages setup](docs/deployment/cloudflare-pages.md)
- [Release and recovery guide](docs/deployment/release-recovery.md)

Until the CMS is configured, content can be edited directly in the JSON files above. Keep required fields, unique slugs, category references, and image paths valid; the build checks these before generating pages.

## Build and preview

```powershell
npm run validate
npm run build
npm run preview
```

`npm run build` validates content, checks Astro files, and generates the static site into `dist/`. `npm run preview` serves the generated build locally; run the build first. The GitHub Actions workflow also runs the build and browser smoke suite on pull requests.

To run the browser suite locally, install Chromium once and run:

```powershell
npx playwright install chromium
npm test
```

## Publishing status

The intended flow is Decap CMS → GitHub commit → GitHub checks → Cloudflare Pages build (`npm run build`, output directory `dist`) → public `pages.dev` site. At present, the Cloudflare Pages project and Decap Turbo site still need owner account setup. The configured `samngoclinh.pages.dev` hostname is not live yet, and `public/admin/config.yml` still has `REPLACE_WITH_DECAP_TURBO_SITE_ID`. The live CMS and publish flow will work after those setup steps; do not treat a local preview as a production deployment.
