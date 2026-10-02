# BRXEL — Website

Marketing and enquiry site for **BRXEL**, a Saudi graphic-design studio.
a Saudi establishment offering custom web, software and AI development services.

Arabic only and right-to-left.

## Run

```bash
npm install
npm run dev
```

`npm run build` produces a fully static site in `out/` (`output: "export"`), so it can be
hosted on any static host — no Node server required.

Set `NEXT_PUBLIC_SITE_URL` before building so canonical URLs, Open Graph tags and
`sitemap.xml` point at the real domain.

## Routes

| Route | Contents |
|---|---|
| `/` | Hero, services, web packages, process, work, why BRXEL, enquiry form |
| `/services/` | Every service in full: scope, exclusions and timeline |
| `/work/` | Every delivered project, with a link to each live site |
| `/references/` | Curated agency websites, templates, and inspiration feeds |
| `/about/` | Company story, commercial register, licensed activities |
| `/contact/` | Enquiry form and direct contact channels |
| `/terms/`, `/privacy/`, `/refunds/` | Policies |

All routes are prerendered at build time.

## Where things live

| Concern | Where |
|---|---|
| Brand and contact facts | `src/lib/site.js` |
| Services and packages | `src/data/services.json` (read via `src/lib/services.js`) |
| Delivered projects | `src/data/projects.json` (read via `src/lib/projects.js`) |
| Policy text | `src/data/policies.json` (read via `src/lib/legal.js`) |
| Enquiry validation and message building | `src/lib/contact.js` |
| Design tokens, light/dark bands, animation | `src/app/globals.css` |

Every piece of company data has exactly one source. Change the JSON or `site.js` and the UI,
the structured data in `layout.js` and the WhatsApp message all follow.

## Design system

The palette follows the BRXEL brand ratio: roughly 60% black/navy ground, 30% ice-white
type, 10% blue accent.

- Tokens are declared once in `@theme` and consumed through Tailwind utilities
  (`text-ice`, `bg-surface`, `border-hairline`, …).
- `.on-light` re-points those same tokens at an ice-white ground. Wrapping a band in it —
  or passing `tone="light"` to `<Section>` — flips it to the light treatment with no
  changes to the components inside. Bands alternate dark and light down each page.
- `IBM Plex Sans Arabic` is the only typeface; it covers Arabic and Latin alike.

## Motion

Hero motion is decorative and compositor-only (transform, opacity, background-position).
`HeroNetwork.js` draws the node constellation on a canvas and stops its animation frame
loop whenever the tab is hidden or the hero scrolls out of view. Everything is disabled
under `prefers-reduced-motion`, and `Reveal` falls back to fully visible content.

## Enquiries

There is no payment gateway and no server. The enquiry form validates in the browser,
formats the answers as plain text, and hands the message to WhatsApp (`wa.me`) or the
visitor's mail client. Nothing is charged on the site.

## Work

`src/data/projects.json` is the one list of delivered projects, held in the order they are
shown. `featured: true` puts a project in the home-page band (the first six); every project
appears on `/work/`. A project with an empty `link` renders as a plain tile instead of a
dead link.

Each project names the BRXEL services it demonstrates by their `services.json` id, and
`src/lib/projects.js` resolves those to the service's `short` label — so the catalogue stays
the one source for what a service is called, and an unknown id fails the build rather than
dropping a tag silently.

The list started as a snapshot of the itsak.tech portfolio API, not a live feed. Order,
categories and cover art come from there; the summaries were rewritten to describe the work
in the same terms as the service catalogue. Covers are square 1000x1000 WebP shots in
`public/images/work/`, named after the project id.

## Brand assets

The logo is built in `../brand-logo/` (`build_logo.py` holds the geometry). Its exports are copied here:

- `src/components/ui/Logo.js` — the wordmark as inline SVG; letters take the text colour, the X's
  stroke stays Ember (`mono` makes it one colour). Its path data is generated — change the logo in
  `brand-logo/` and copy the paths across rather than editing them by hand.
- `public/brand/logo/` — downloadable SVG/PNG versions and the construction grid used on `/brand/`.
- `src/app/icon.svg`, `src/app/favicon.ico`, `src/app/apple-icon.png` — the icon tile.
