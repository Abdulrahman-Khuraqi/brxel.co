# BRXEL — Website

Marketing and enquiry site for **BRXEL** (brxel.co), a graphic-design studio: brand identity,
social media, print and web.

Arabic only and right-to-left.

## Run

```bash
npm install
npm run dev
```

`npm run build` produces a fully static site in `out/` (`output: "export"`), so it can be
hosted on any static host — no Node server required.

Canonical URLs, Open Graph tags and `sitemap.xml` default to `https://brxel.co`; set
`NEXT_PUBLIC_SITE_URL` to override (for a staging domain, say).

## Routes

| Route | Contents |
|---|---|
| `/` | Hero, services, featured work, process, clients, enquiry form |
| `/services/` | Every service in full (scope, exclusions, timeline), packages, process |
| `/services/<id>/` | One page per service — including Salla and Zid store design — with scope, who it suits, process, related work, FAQ and an enquiry form opened on that service |
| `/work/` | Every delivered project, filterable by discipline |
| `/thank-you/` | Shown after the enquiry form, with the request id (`?id=BRX-…`) |
| `/references/` | Curated agency websites, templates, and inspiration feeds |
| `/about/` | Studio principles and services |
| `/contact/` | Enquiry form and direct contact channels |
| `/terms/`, `/privacy/`, `/refunds/` | Policies |

All routes are prerendered at build time.

## Where things live

| Concern | Where |
|---|---|
| Brand and contact facts | `src/lib/site.js` |
| Services and packages | `src/data/services.json` (read via `src/lib/services.js`); adding a service there adds its page, sitemap entry and footer link (add its id to a `SERVICE_GROUPS` entry in `src/lib/contact.js` too, or the build stops) |
| Delivered projects | `src/data/projects.json` (read via `src/lib/projects.js`) |
| Policy text | `src/data/policies.json` (read via `src/lib/legal.js`) |
| Enquiry schema (Zod), steps, request id, submission | `src/lib/contact.js` |
| Data-layer helper | `src/lib/analytics.js` |
| Design tokens, light/dark bands, animation | `src/app/globals.css` |

Every piece of company data has exactly one source. Change the JSON or `site.js` and the UI,
the structured data in `layout.js` and the WhatsApp message all follow.

## Design system

Ink ground, cream type and one Sun-gold accent. One container width (`max-w-6xl`), one
section rhythm (`<Section>`), and a short type scale: page titles at 2–2.75rem, section titles
at 1.75–2.25rem, body at 16–18px.

- Tokens are declared once in `@theme` and consumed through Tailwind utilities
  (`text-ice`, `bg-surface`, `border-hairline`, …).
- `.on-light` re-points those same tokens at an ice-white ground. Wrapping a band in it —
  or passing `tone="light"` to `<Section>` — flips it to the light treatment with no
  changes to the components inside. Bands alternate dark and light down each page.
- `IBM Plex Sans Arabic` is the only typeface; it covers Arabic and Latin alike.

## Motion

Motion is kept to entrance reveals (`Reveal`), hover lifts and the hero's status dot. All of
it is disabled under `prefers-reduced-motion`, and `Reveal` falls back to fully visible content.

## Enquiries

There is no payment gateway and nothing is charged on the site. Prices are not published:
every project is quoted in a written scope.

The enquiry form (`src/components/contact/EnquiryForm.js`) closes every main page. It is built
on React Hook Form + Zod + shadcn/ui (`src/components/ui/form.js`, `sonner.js`) and runs in
three steps — service, project, contact details — with a progress bar, validation as you type,
and "next"/"submit" buttons that stay disabled until their step is valid.
Step one offers five broad kinds of work (`SERVICE_GROUPS`) rather than every service; on a
service page the form opens on that service's group.

On submit it creates a request id (`BRX-YYMMDD-XXXX`) and redirects to `/thank-you/?id=…`.

- **With `NEXT_PUBLIC_FORM_ENDPOINT` set**, the enquiry is POSTed there as JSON
  (`requestId`, `service`, `timeline`, `details`, `name`, `email`, `phone`, `message`, `source`, and
  `topic` — the service page it was sent from, when there is one)
  and the thank-you page confirms it was received.
- **Without it** (the current state, until the brxel.co mailbox is set up), the thank-you page
  asks the visitor to send the prepared message through WhatsApp or email, so no enquiry is lost.

### Data layer

Every stage is pushed to `window.dataLayer` (ready for Google Tag Manager), without personal data:
`form_start`, `form_step_complete` (`step_number`, `step_name`), `form_submit`,
`form_submit_success` (`delivery`: `endpoint` | `handoff`), `form_submit_error`,
`thank_you_view` and `contact_click`. Each carries `form_id`, `form_location` and, once it
exists, `request_id`.

## Work

`src/data/projects.json` is the one list of delivered projects. `src/lib/projects.js` orders it,
so adding a project never needs a manual re-shuffle:

- Disciplines are shown in the order identity, social, web, print.
- Inside a discipline: `featured: true` first, then the projects with the most to show (a full
  social gallery or a live site), then file order.
- The "All" view on `/work/` and the home page take one project from each discipline in turn,
  so the grid never shows a run of the same kind of work. `/work/` loads twelve at a time.
- `/work/#work-social` (or `-identity`, `-web`, `-print`) opens the page already filtered.

A web project with an empty `link` renders as a plain tile instead of a dead link; social
projects open their gallery at `/work/social/<id>/`.

## Brand assets

The logo is built in `../brand-logo/` (`build_logo.py` holds the geometry). Its exports are copied here:

- `src/components/ui/Logo.js` — the wordmark as inline SVG; letters take the text colour, the X's
  stroke stays Ember (`mono` makes it one colour). Its path data is generated — change the logo in
  `brand-logo/` and copy the paths across rather than editing them by hand.
- `public/brand/logo/` — downloadable SVG/PNG versions and the construction grid used on `/brand/`.
- `src/app/icon.svg`, `src/app/favicon.ico`, `src/app/apple-icon.png` — the icon tile.
