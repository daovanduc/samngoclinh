# Site and content management spec

## Problem Statement

Visitors can currently browse a branded homepage, but the remaining pages are raw template pages and the site has no connected content management system. The owner needs a consistent, responsive product catalog and article experience, plus a practical way to maintain the content without paying for a hosted backend.

## Solution

Build a static, content-driven site that follows the approved Thảo Nguyên homepage and product-detail designs. Add product category listings, individual product pages, news listings and article pages, and complete all navigation links. Provide a single-owner CMS that edits named content fields and ordered page sections, with changes committed to the existing public GitHub repository and published through an automatic static build to a free `pages.dev` address.

## User Stories

1. As a visitor, I want every page to share the homepage’s branding and navigation so that the site feels coherent.
2. As a visitor, I want to browse all products from a product list so that I can discover the catalog.
3. As a visitor, I want to filter the catalog by product category so that I can find relevant products.
4. As a visitor, I want each product card to open that product’s detail URL so that I can learn more about it.
5. As a visitor, I want product details to show the product image, category, name, package size, description, and contact action so that I can understand the offering and ask about it.
6. As a visitor, I want related products on a detail page so that I can explore similar catalog items.
7. As a visitor, I want each package size to have its own product record and URL so that its description and image can be presented directly.
8. As a visitor, I want a category page to show products assigned to that category so that its catalog stays current as products change.
9. As a visitor, I want to browse news cards and open separate article pages so that I can read the full story.
10. As a visitor, I want articles to show a title, publication date, summary, and body so that I can understand the story.
11. As a visitor, I want all navigation, cards, breadcrumbs, and calls to action to lead to real destinations so that I do not encounter dead links.
12. As a mobile visitor, I want an accessible navigation toggle below the desktop breakpoint so that I can reach every page on a small screen.
13. As a visitor on desktop, tablet, or phone, I want content and images to remain readable and visible so that the site works across screen sizes.
14. As the site owner, I want to create, edit, and archive products, categories, and news articles so that I can maintain the catalog without changing application code.
15. As the site owner, I want each product to belong to one primary category so that category listings are derived consistently.
16. As the site owner, I want named product fields matching the approved detail design so that I can update product information without editing freeform page markup.
17. As the site owner, I want product fields for category, title, package size, image, description, product information, benefits, recommended users, directions, usage notes, and editor-managed order so that the detail page can render the approved content structure.
18. As the site owner, I want to manage category name, slug, image, description, and order so that category cards and listings stay accurate.
19. As the site owner, I want to manage article title, slug, date, summary, body, image, and order so that news pages remain current.
20. As the site owner, I want to order page-specific designed sections so that homepage content follows the approved composition.
21. As the site owner, I want the homepage to support hero, category cards, all products, certificates, and contact sections so that it matches the supplied design.
22. As the site owner, I want a section editor with add, remove, and reorder controls and fields appropriate to each section type so that I can maintain page composition safely.
23. As the site owner, I want a draft preview and published preview so that I can review edits before and after publishing.
24. As the site owner, I want product and section images stored in the repository’s site assets so that the launch does not require a separate image-hosting service.
25. As the site owner, I want CMS changes committed to the public GitHub repository so that content has version history and the static site can rebuild automatically.
26. As a visitor, I want the public site delivered as generated static HTML so that pages are fast, crawlable, and do not require a per-visitor CMS API request.
27. As the site owner, I want successful repository updates to trigger a Cloudflare Pages build and deployment so that published changes reach the public site automatically.
28. As the site owner, I want the site hosted at a free `pages.dev` address so that the launch has no domain or hosting charge.
29. As the site owner, I want the solution to stay within free plans and avoid paid overages so that recurring launch cost remains $0.
30. As the site owner, I want the CMS account limited to one trusted editor and the GitHub App installed only for this repository with narrow write permissions so that publishing access is constrained.
31. As a visitor, I want the site to preserve all sections and their authored order at every viewport so that responsive layouts do not hide content.
32. As a phone visitor, I want product imagery contained and decorative backgrounds cropped so that products remain identifiable and text remains legible.

## Implementation Decisions

- Migrate the current static pages to Astro static generation. Keep the existing branded homepage as the visual source of truth and replace the unbranded/raw template pages.
- Use Decap CMS with GitHub as its content backend. Use Decap Turbo Free for single-owner authentication; its GitHub App is installed only on this repository with narrow write permissions. Do not use the standard OAuth app flow because its repository scope is broader.
- Store structured content and authored images in the public repository. Do not add a separately hosted content database, runtime CMS API, or Sanity webhook.
- Deploy through Cloudflare Pages Git integration. A GitHub content commit triggers a build, and the public static site updates after deployment finishes.
- Use the Cloudflare-provided `pages.dev` hostname for launch. Do not use GitHub Pages for this project.
- Use one content record and URL per product size. Products have one primary category; category product lists are derived from that assignment.
- Product fields are named and design-specific. Do not include prices in the first release; use a contact call to action.
- Product, category, and article order is editor-managed. Categories and products are created, edited, and archived; articles are created, edited, and archived.
- News articles have title, slug, date, summary, body, and an associated image where supplied.
- Page sections are ordered and page-specific. Launch homepage section types are hero, category cards, all products, certificates, and contact. The approved section-editor prototype defines add/remove/reorder behavior, section-specific fields, and preview concepts.
- Responsive behavior: desktop above 992px; tablet from 768px through 992px; mobile below 768px, including the existing small-phone adjustment at 480px. Show desktop navigation at desktop widths and an accessible menu toggle below 992px. Product grids use three columns on desktop, two on tablet, and one on phones. Product detail is side by side on desktop and stacks with image first on mobile. Scale type and spacing fluidly, keep controls touch-friendly, preserve section order and visibility, contain product imagery, and crop decorative backgrounds.
- The accepted operating model has no uptime guarantee and no paid overages. If free-tier quotas or provider outages interrupt deployment, site updates may be delayed until recovery or quota reset.
- Secure the owner’s GitHub, Decap Turbo, and Cloudflare accounts with passkeys or strong two-factor authentication. Keep the recovery email accessible and store recovery codes offline in a secure place.
- Use Git history as the primary content version history and make monthly offline copies of the full repository, including content and images, on storage the owner already has. Recover content by reverting a commit or restoring a known-good snapshot, then redeploy through the normal build path.
- Before a production deployment becomes live, validate required content fields, slug uniqueness, and category references; run Astro diagnostics and a production build; and run browser smoke checks against generated routes, links, and desktop/tablet/mobile layouts. Any failed check blocks the new production deployment.
- Surface deployment state through GitHub checks and configure Cloudflare email notifications for failed production deployments. Fix failed builds forward with a new commit; use Cloudflare rollback for an accidentally published bad deployment, then correct the repository history with a revert or forward fix.
- Keep the launch on the $0 plan. If the monthly build quota is exhausted, wait for its reset rather than pay. The last successful production deployment is expected to remain live during a failed build or quota interruption, but Cloudflare does not explicitly guarantee this behavior or specify quota-exhaustion behavior.
- Do not build commerce, cart, payment, inventory, multi-tenant editing, collaboration, or freeform drag/resize styling. Do not invent destinations for placeholder phone, social, footer, or raw template links.

## Testing Decisions

- Use one end-to-end seam at the generated site: build from representative structured content fixtures, then use browser-level checks against the built site. The user approved this seam.
- Check public behavior rather than implementation details: homepage and category/product/article routes render; navigation, breadcrumbs, cards, related products, and contact links reach the intended destinations; authored ordering is preserved; images render; and the layouts remain usable at desktop, tablet, and phone widths.
- Include a hosted smoke check for the real Decap-to-GitHub-to-Cloudflare publishing path, verifying that a content commit produces a successful deployment and that the updated content appears at the public URL.
- The current repository has no test runner or existing automated test prior art. Introduce the smallest browser-level test setup needed for the generated site rather than testing internal components or CMS implementation details.

## Out of Scope

- Prices, shopping cart, checkout, payment processing, inventory, or order management.
- Multi-user editing, collaboration, or multiple CMS seats.
- Freeform section styling, arbitrary frame resizing, or drag-to-position layout editing.
- Separate hosted content database, Sanity, or per-visitor content API calls.
- Guaranteed uptime, paid overages, or a paid custom domain.
- Fabricating canonical product/news copy or inferring the complete image-to-content mapping from filenames alone.
- Assigning behavior to placeholder contact, social, footer, or template links without approved destinations.

## Further Notes

- Content validation and deployment failure behavior are resolved in [Wayfinder issue #9](https://github.com/daovanduc/samngoclinh/issues/9).
- Canonical product and article copy, plus a verified image inventory and mapping, are still needed for production content. The site implementation can use clearly identified representative fixtures until the owner supplies those assets and copy.
- Repository inspection found a branded homepage, raw template pages, product and background image assets, and an approved section-editor prototype. There is currently no Astro project setup or test framework.
- Published as [GitHub issue #10](https://github.com/daovanduc/samngoclinh/issues/10) and linked from the [Wayfinder map](https://github.com/daovanduc/samngoclinh/issues/1). It is ready for implementation using representative content fixtures; canonical production copy and verified image mapping can be entered after the CMS exists.
