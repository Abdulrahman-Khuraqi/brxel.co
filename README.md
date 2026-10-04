# BRXEL — Website and dashboard

Marketing site for **BRXEL** (brxel.co), a graphic-design studio, plus the dashboard the team
uses to manage the portfolio, the blog, the site's numbers and its own accounts.

Arabic only and right-to-left. One Next.js 16 app running on Node.js, with MySQL / MariaDB.

## Stack

| Layer | Choice | Why |
|---|---|---|
| App | Next.js 16 (App Router, Server Actions), React 19 | Public site and dashboard in one deployable Node app |
| Database | MySQL 8 or MariaDB 10.6+ (Hostinger's MySQL) | Relational, transactional, what the host provides |
| Data access | Drizzle ORM + `mysql2` connection pool | Typed schema in one file, SQL migrations in `drizzle/`, no codegen step |
| Validation | Zod | The same rules for every form and Server Action |
| Images | `sharp` | Every upload is decoded, re-encoded to WebP and resized on the server |
| Passwords | scrypt (Node's own crypto) | Memory-hard, nothing native to compile on the host |

## Run locally

Needs Node.js 20.9+ and a MySQL or MariaDB database.

```bash
npm install
cp .env.example .env          # set DATABASE_URL (and ADMIN_* for the first owner)
npm run db:migrate            # create the tables
npm run db:seed               # roles, settings, the current portfolio, blog categories
npm run admin:create -- --email you@brxel.co --name "Your name"   # prints a password
npm run dev                   # http://localhost:3000, dashboard at /admin/
```

`npm test` runs the unit tests (passwords, permissions); `npm run lint` runs ESLint.

Canonical URLs, Open Graph tags and `sitemap.xml` default to `https://brxel.co`; set
`NEXT_PUBLIC_SITE_URL` to override (for a staging domain, say).

## Routes

| Route | Contents |
|---|---|
| `/` | Hero (numbers from the dashboard), services, featured work, process, clients, enquiry form |
| `/services/` | Every service in full (scope, exclusions, timeline), packages, process |
| `/services/<id>/` | One page per service — including Salla and Zid store design — with scope, who it suits, process, related work, FAQ and an enquiry form opened on that service |
| `/work/` | Every published project, filterable by discipline |
| `/work/social/<slug>/` | A social project's full gallery |
| `/blog/`, `/blog/<slug>/` | Published posts, filterable by category, nine per page |
| `/thank-you/` | Shown after the enquiry form, with the request id (`?id=BRX-…`) |
| `/references/` | Curated agency websites, templates, and inspiration feeds |
| `/about/`, `/contact/` | Studio principles; enquiry form and direct channels |
| `/terms/`, `/privacy/`, `/refunds/` | Policies |
| `/admin/` | The dashboard (signed-in team only, never indexed) |
| `/uploads/…` | Images uploaded from the dashboard |
| `/api/health/` | `200 {"ok":true}` when the app and the database answer; for uptime monitors |

Pages that read the database render on the server and read through a cache (`unstable_cache`,
tagged `portfolio`, `posts`, `settings`). Every change made in the dashboard expires its tag, so
the public site shows it on the next request; untouched content is served from the cache.
Everything else is prerendered at build time. **The build never needs the database.**

## Where things live

| Concern | Where |
|---|---|
| Brand and contact facts | `src/lib/site.js` |
| Services and packages | `src/data/services.json` (read via `src/lib/services.js`); adding a service there adds its page, sitemap entry and footer link (add its id to a `SERVICE_GROUPS` entry in `src/lib/contact.js` too, or the build stops) |
| Projects, posts, hero numbers, users | The database — edited from `/admin/` |
| Database schema | `src/server/db/schema.js`; migrations in `drizzle/` |
| Public reads (cached) | `src/server/content/` |
| Dashboard logic and rules | `src/server/admin/`; pages and Server Actions in `src/app/admin/` |
| Sessions, sign-in, permissions | `src/server/auth/`; the permission catalogue is `permissions.js` |
| Uploads | `src/server/media.js`, served by `src/app/uploads/[...path]/route.js` |
| Policy text | `src/data/policies.json` (read via `src/lib/legal.js`) |
| Enquiry schema (Zod), steps, request id, submission | `src/lib/contact.js` |
| Design tokens, light/dark bands, animation | `src/app/globals.css` |

`src/data/projects.json` is no longer read by the site: it is the one-time import that
`npm run db:seed` loads into an empty database.

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

Projects live in the database and are managed at `/admin/work/`. `src/lib/projects.js` orders
the published ones, so adding a project never needs a manual re-shuffle:

- Disciplines are shown in the order identity, social, web, print.
- Inside a discipline: projects marked **featured** first, then the ones with the most to show
  (a full social gallery or a live site), then the manual order set in the dashboard.
- The "All" view on `/work/` and the home page take one project from each discipline in turn,
  so the grid never shows a run of the same kind of work. `/work/` loads twelve at a time.
- `/work/#work-social` (or `-identity`, `-web`, `-print`) opens the page already filtered.

A web project with an empty link renders as a plain tile instead of a dead link; social
projects open their gallery at `/work/social/<slug>/`.

## Dashboard

`/admin/` — sign in with an email and password. The menu shows only what the user's role allows.

| Section | What it does |
|---|---|
| Overview | Counts, posts waiting for review, recent activity, shortcuts |
| Work | Add, edit, publish/hide, delete projects; cover image, gallery (upload or pick from the library, reorder), live link, featured, order |
| Posts | Markdown editor with toolbar, image upload into the text and live preview; draft → review → published; scheduling; SEO title and description |
| Blog categories | Add, rename, delete |
| Media library | Upload (up to 20 at once, 10 MB each), copy URL, delete — refused while an image is still used by a project or post |
| Site numbers | The hero numbers on the home page |
| Users | Create (a strong temporary password is shown once), change role, disable, reset password, delete |
| Roles | Create and edit roles as a checklist of permissions |
| Activity | Every sign-in and every change: who, what, when, from which IP |
| My account | Name, password, sign out of other devices |

### Roles and permissions

A role is a set of permissions; each user has one role. The defaults (all editable except Owner):

| Role | Work | Blog | Media | Site numbers | Team |
|---|---|---|---|---|---|
| المالك Owner | all | all | all | ✓ | all — locked, can't be edited or deleted |
| مدير Admin | all | all | all | ✓ | users, roles, activity |
| محرر Editor | all | all | all | ✓ | — |
| كاتب Author | — | write own, send for review | upload | — | — |
| مصمم Designer | view, add, edit drafts | — | upload | — | — |
| مشاهد Viewer | view | view | — | — | — |

The rules behind them, enforced on the server in every action (hiding a button is only a convenience):

- Without the **publish** permission, new work and posts are drafts, and anything already live is
  read-only — published content never changes without someone who may publish.
- Authors see and edit their own posts; **edit others' posts** opens everyone's.
- Nobody can grant a permission or assign a role they don't hold themselves.
- Only an owner can create, edit or remove an owner. Nobody can change their own role or disable
  themselves, and the last active owner can't be removed.
- Disabling a user, changing their role or resetting their password signs them out everywhere.

### Security

- Sessions: a random 256-bit token in an `httpOnly`, `SameSite=Lax`, `Secure` (in production)
  cookie; only its SHA-256 is stored. Sessions slide for 30 days of activity.
- Passwords: scrypt (N=2¹⁵), at least 10 characters, not containing the user's name or email.
- Sign-in: 5 failures per email or 20 per IP within 15 minutes lock further attempts; the error
  never says whether the email exists, and unknown emails take as long as wrong passwords.
- Server Actions check the origin (CSRF) and re-check the session and permission every time.
- Uploads are decoded by sharp and re-encoded, so only real images are stored, under random names,
  outside the app folder. SVG is not accepted.
- Post bodies are Markdown rendered without raw HTML: nothing typed in the editor can run script.
- `/admin/` sends `noindex` and `no-store`; the site sends `nosniff`, `SAMEORIGIN` framing and a
  strict referrer policy.

## Deploy on Hostinger

Needs a plan with **Node.js web apps** (Business, Cloud or VPS) and a MySQL database.

1. **Database.** hPanel → *Databases* → *MySQL Databases*: create a database and a user, and note
   the host, name, user and password.
2. **App.** hPanel → *Websites* → *Add website* → *Node.js Apps*, connect this GitHub repository
   (or upload it), Node.js **22** (20.9+ works). Framework: Next.js. Build command
   `npm run build`, start command `npm start`.
3. **Environment variables** (in the app's settings), from `.env.example`:
   - `DATABASE_URL` = `mysql://USER:PASSWORD@HOST:3306/DATABASE` (URL-encode special characters
     in the password).
   - `NEXT_PUBLIC_SITE_URL` = `https://brxel.co`.
   - `UPLOAD_DIR` = an absolute path **outside** the app folder, e.g. `/home/u123456789/brxel-uploads`,
     so redeploys never touch uploaded images.
   - For the first start only: `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD`.
4. **Deploy.** `npm start` first runs `db:migrate` and `db:seed` (both safe to repeat), so the
   first start creates the tables, imports the current portfolio and creates the owner from the
   `ADMIN_*` variables. Sign in at `https://brxel.co/admin/`, then **delete `ADMIN_PASSWORD`**
   from the environment and change the password from "حسابي".
5. **Check.** `https://brxel.co/api/health/` should return `{"ok":true,"database":"up"}`.

Every later deploy: push to the branch Hostinger builds from. New migrations apply on start.

### Operations

- **Locked out:** with SSH, `npm run admin:create -- --email you@brxel.co --reset` prints a new
  password and signs that account out everywhere.
- **Backups:** Hostinger backs up databases daily; for your own copy,
  `mysqldump --single-transaction DBNAME > brxel-$(date +%F).sql`, and copy `UPLOAD_DIR`.
- **Schema changes:** edit `src/server/db/schema.js`, run `npm run db:generate` to write a new
  migration into `drizzle/`, commit it. It applies on the next start.
- **Scaling:** the app is stateless apart from `UPLOAD_DIR`, so more instances (or a VPS behind a
  load balancer) only need a shared upload folder or object storage, and `DATABASE_POOL_SIZE`
  sized to the database's connection limit. Listing queries are indexed and paginated.

## Brand assets

The logo is built in `../brand-logo/` (`build_logo.py` holds the geometry). Its exports are copied here:

- `src/components/ui/Logo.js` — the wordmark as inline SVG; letters take the text colour, the X's
  stroke stays Ember (`mono` makes it one colour). Its path data is generated — change the logo in
  `brand-logo/` and copy the paths across rather than editing them by hand.
- `public/brand/logo/` — downloadable SVG/PNG versions and the construction grid used on `/brand/`.
- `src/app/icon.svg`, `src/app/favicon.ico`, `src/app/apple-icon.png` — the icon tile.
