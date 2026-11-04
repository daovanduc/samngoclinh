# Decap CMS setup

The CMS UI and collections are served from `/admin/` (the source files are `public/admin/index.html` and `public/admin/config.yml`). Before login can work, the owner must:

1. Create a Decap Turbo organization and connect its GitHub App to `daovanduc/samngoclinh`.
2. Create a Turbo site for this repository, branch `prototype/designed-section-editor` (the repository default branch; keep this value synchronized with the GitHub default branch), set its config path to `public/admin/config.yml`, and add `/admin/` on the deployed `pages.dev` hostname as its admin URL.
3. Copy the site's ID into `backend.turbo_site_id` in `config.yml` and commit that value.

The Turbo site ID is public configuration; do not put GitHub tokens or app secrets in this repository. Repository content and uploaded images remain in Git.

