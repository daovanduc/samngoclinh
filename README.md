# Thảo Nguyên site

This repository builds a static product catalog and news site with Astro. The site pages are generated from JSON files in `src/data`; visitors do not need a database or a CMS API at runtime. Decap CMS is the editor for changing those files through a browser.

## Run the site on your computer

Use Node.js 22.23.4 and npm. That exact build version is recorded in `.node-version`; some installed dependencies require a newer Node version than the package's minimum engine declaration.

On this Windows machine, the pinned Node installation is already available. Call its executables directly so another system Node on `PATH` cannot take precedence:

```powershell
$nodeInstallationPath = 'C:\Users\Admin\AppData\Roaming\fnm\node-versions\v22.23.4\installation'
& (Join-Path $nodeInstallationPath 'node.exe') --version
```

The command should print `v22.23.4`. Use the matching `npm.cmd` for installs and scripts:

In PowerShell, open the repository folder and run:

```powershell
& (Join-Path $nodeInstallationPath 'npm.cmd') ci
& (Join-Path $nodeInstallationPath 'npm.cmd') run dev
```

Open <http://localhost:4321> in your browser. Stop the local server with `Ctrl+C` in the PowerShell window.

If you do not have the project folder yet:

```powershell
git clone https://github.com/daovanduc/samngoclinh.git
cd samngoclinh
$nodeInstallationPath = 'C:\Users\Admin\AppData\Roaming\fnm\node-versions\v22.23.4\installation'
& (Join-Path $nodeInstallationPath 'npm.cmd') ci
& (Join-Path $nodeInstallationPath 'npm.cmd') run dev
```

`npm ci` requires the `package-lock.json` on the default branch. If npm reports that the lockfile is missing, check that you are in the `samngoclinh` folder on `prototype/designed-section-editor` before running it:

```powershell
git branch --show-current
Test-Path package-lock.json
```

If `npm ci` fails on Windows with `EPERM` while unlinking a Rollup `.node` file, stop any `npm run dev` or `npm run preview` server with `Ctrl+C` and close other terminal sessions running this project. Then reopen PowerShell, select Node.js 22.23.4 as above, and run `npm ci` again. The file is a native dependency that Windows cannot replace while another process has it open.

All work lives on the default branch `prototype/designed-section-editor` (the implementation was merged in [PR #17](https://github.com/daovanduc/samngoclinh/pull/17)).

## How the site is built

Astro reads the content files and generates plain HTML pages:

- `src/data/products/*.json` contains one record per product and package size. The filename supplies its URL slug. A product's `category` must match a category filename.
- `src/data/categories/*.json` contains category names, images, descriptions, and display order. Its filename supplies the category URL slug.
- `src/data/news/*.json` contains article content. Each article's `slug` field supplies its URL.
- `src/data/pages/products.json` contains the ordered homepage sections. The order in the `sections` array is the order visitors see.
- `public/assets/images/` contains site images. Images uploaded through the CMS go under `public/assets/images/uploads/`.

Product detail pages show optional product fields only when they have content. Related products are selected from the same category. The homepage section editor supports the designed section types (hero, categories, products, recipes, brand values, certificates, and contact); it does not offer freeform page layout controls. All pages use the original branded homepage design: markup classes from the old `index.html` and its stylesheet, copied to `public/assets/css/product-storytelling.css`. Category descriptions feed the alternating story blocks on the homepage.

## Change content

Open <https://samngoclinh.pages.dev/admin/> on the deployed site, sign in, edit products/categories/news or the homepage sections, and save. Decap commits changes to GitHub on `prototype/designed-section-editor`; Cloudflare Pages automatically builds that production branch.

The CMS configuration is in `public/admin/config.yml`. Its Turbo Site ID is set. In the Decap Turbo dashboard, allow the deployed admin origin `https://samngoclinh.pages.dev` for hosted login. For setup details, see:

- [Decap CMS setup](docs/deployment/decap-cms.md)
- [Cloudflare Pages setup](docs/deployment/cloudflare-pages.md)
- [Release and recovery guide](docs/deployment/release-recovery.md)

Until the CMS is configured, content can be edited directly in the JSON files above. Keep required fields, unique slugs, category references, and image paths valid; the build checks these before generating pages.

## Build and preview

```powershell
& (Join-Path $nodeInstallationPath 'npm.cmd') run validate
& (Join-Path $nodeInstallationPath 'npm.cmd') run build
& (Join-Path $nodeInstallationPath 'npm.cmd') run preview
```

`npm run build` validates content, checks Astro files, and generates the static site into `dist/`. `npm run preview` serves the generated build locally; run the build first. The GitHub Actions workflow also runs the build and browser smoke suite on pull requests.

To run the browser suite locally, install Chromium once and run:

```powershell
& (Join-Path $nodeInstallationPath 'npx.cmd') playwright install chromium
& (Join-Path $nodeInstallationPath 'npm.cmd') test
```

## Publishing status

The live site is <https://samngoclinh.pages.dev>. Cloudflare Pages builds `prototype/designed-section-editor` with `npm run build` and publishes the `dist` directory. Decap CMS writes content to the same branch. Local admin access also needs `http://127.0.0.1:4322` in the Turbo site's Admin interface URL list.
