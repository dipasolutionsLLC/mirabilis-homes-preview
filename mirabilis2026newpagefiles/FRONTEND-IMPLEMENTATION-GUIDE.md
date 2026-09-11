# Mirabilis Homes — Public frontend implementation guide

This document tells a developer how to replace the **existing public website** with the new layout.

The new UI follows the same visual language as [mirabilispartners.com](https://mirabilispartners.com/) (charcoal, orange `#FF8509`, Source Sans, full-bleed photography/video, quiet type). It is **not** a restyle of the current Bootstrap / `new-design` theme. Port this layout as the new public marketing site, then wire the existing CodeIgniter auth and application flows behind it.

**Do not** try to “tweak” `assets/new-design/css/style.css` until it looks like this. Replace the public pages.

---

## 1. Source of truth

| What | Where |
| --- | --- |
| Approved visual + copy | Live preview: https://dipasolutionsllc.github.io/mirabilis-homes-preview/ |
| HTML / CSS / JS to port | `/prototype/` in this repo |
| Brand reference | https://mirabilispartners.com/ |

Open the preview and match it page by page. If HTML and CSS disagree with this doc, **follow the preview**.

Prototype is visual only. Forms, payments, and the INTRO journey must keep talking to the current backend.

---

## 2. What to replace vs what to leave alone

### Replace (public marketing shell)

The pages users see before they are logged in. Today they live under `app/Views/new-design/` and are rendered by `App\Controllers\Website`.

| Current production | New source in `/prototype/` | Public URL |
| --- | --- | --- |
| `app/Views/new-design/index.php` | `prototype/index.html` | `/` |
| `app/Views/new-design/how-it-works.php` | `prototype/how-it-works.html` | `/how-it-works` |
| `app/Views/new-design/about-us.php` | `prototype/about.html` | `/about-us` |
| `app/Views/new-design/sign-in.php` | `prototype/sign-in.html` | `/sign-in` |
| `app/Views/new-design/sign-up.php` | `prototype/get-pre-qualified.html` + `prototype/application.html` | `/sign-up` (Get pre-qualified) |
| `app/Views/new-design/templates/header.php` | head from prototype pages | layout |
| `app/Views/new-design/templates/top-nav.php` | header in `index.html` / inner pages | layout |
| `app/Views/new-design/templates/footer.php` | footer in prototype | layout |

Also **remove the homepage 301** in `app/Config/Routes.php` that currently sends `/` to `https://mirabilispartners.com/`. The Homes site must serve this new layout at `/`.

Suggested CSS/JS home (new files, do not overwrite the old theme until cutover is done):

- `assets/public/css/site.css` ← copy `prototype/styles.css`
- `assets/public/js/site.js` ← copy `prototype/site.js`

### Remove from the public site (client decision)

Do **not** keep these in the new nav, footer, or homepage:

- Search Homes / MLS search (`/search`, listing search box)
- FAQ (`/faq`)
- Blog (not in the approved nav)
- Contact page as a primary nav item (use `mailto:help@mirabilishomes.com` / phone)
- Newsletter block in the footer
- “Find Homes” city links that implied a listings search
- YouTube INTRO explainer (`scMfr2qyh0c`) — replaced by the local teaser MP4

`prototype/search.html` and `prototype/faq.html` only exist as redirects. Do not rebuild those pages.

### Do not rewrite (product / logged-in app)

Leave controllers, models, payments, DocuSign, dashboard, tenant portal, and agent portal as they are. After sign-in / pre-qualification, send users into the existing flows:

- Sign-in POST → current `Website` / auth
- Get pre-qualified / sign-up → current registration
- INTRO journey → existing `app/Views/users/intro-program-journey/` (the HTML under `prototype/journey/` is a **visual click-through only**; restyle later if asked, do not replace production journey logic with it)

---

## 3. Files to copy from the prototype

### Layout and pages

```
prototype/styles.css
prototype/site.js
prototype/index.html
prototype/how-it-works.html
prototype/about.html
prototype/sign-in.html
prototype/get-pre-qualified.html
prototype/application.html
```

Convert `.html` to CodeIgniter views. Keep the DOM structure and class names. Swap static `href="how-it-works.html"` for `site_url('how-it-works')`, etc.

### Media (required)

```
prototype/media/hero.mp4              # homepage hero, ~1080p, already compressed
prototype/media/hero-poster.jpg
prototype/media/teaser.mp4            # “Want more information?” (Mirabilis 1 Teaser)
prototype/media/teaser-poster.jpg
prototype/media/sign-in-banner.png
```

Suggested destination: `assets/public/media/` (or S3 if that is how other public video is served). **Do not** swap in a 4K original for the hero; it will fail to play on first paint.

### Brand / photos already in the repo

```
assets/img/logo-mirabilis.svg
assets/img/favicon.png
assets/img/about-us-min.jpg                 # “Who it’s for” photo
assets/img/product-3/1.jpg …                # Sold homes carousel (static, not MLS)
assets/testimonials/1-new.mp4
assets/testimonials/2-new.mp4
assets/testimonials/3-new.mp4
assets/testimonials/4.mp4
assets/new-design/images/krystyn.mp4
```

Logo: charcoal wordmark. On the transparent home nav over video, invert it in CSS (prototype already does `.logo-light { filter: brightness(0) invert(1); }`).

---

## 4. Shared chrome (every public page)

### Navigation

Home: transparent over the video, solid white after scroll (`site.js`).

Inner pages: always solid (`nav-solid is-scrolled` in the prototype).

Links (this is the full public nav):

- How it works
- About
- Stories → `/#stories` (or `/` + hash from inner pages)
- Sign in
- **Get pre-qualified** (primary orange button)

No Search. No FAQ. No Blog. “For Investors” is optional; the approved prototype does not show it. If product still wants it, put it in the footer, not in the main nav.

Signed-in state: keep “Hi, {first_name}” / Logout / account URL from the current `top-nav.php` logic.

### Footer (all public pages)

```
500 W 2nd St, Suite 1900
Austin, Texas 78701
+1 912 493 78 30
help@mirabilishomes.com
```

Columns: Program (How it works, Get pre-qualified) · Company (About, Stories) · Follow (Instagram, Facebook, LinkedIn).

Do **not** use 78745 for the office. 78745 only appears as a **listing** zip on a sold home card (North Bluff 72). Do not use Pato’s 512 number. Do not keep `801 Barton Springs Rd`.

### Type and color

- Font: [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3) (prototype). Production currently loads Source Sans Pro — switch.
- Orange: `#FF8509`
- Ink: `#1a1d21`
- Dark bands: `#111418`
- Max content width: `1440px`, **centered** (`margin-inline: auto`). Homepage section titles are centered; hero copy stays **bottom-left** on the video.

---

## 5. Page-by-page

### Home `/` ← `prototype/index.html`

Sections, in order:

1. **Hero** — full-viewport looping muted video (`hero.mp4` + poster). Copy:
   - Eyebrow: `INTRO Program · Texas`
   - H1: `Own your dream home.`
   - Lede: `We partner with you to secure your dream house`
   - CTAs: Get pre-qualified · See how it works  
   **Do not** add “Start with 2%.”
2. **Positioning line** (orange left rule, left-aligned text, block centered in the column):  
   `Mirabilis is a vertically-integrated real estate investment manager focused on the largest US asset class: single-family housing`
3. **INTRO — 4 steps**
   - Intro: `We partner with you to find your dream home and let you build ownership at your own pace. Apply in minutes.`
   - 01 Get pre-qualified — `It only takes a few minutes and does not impact your credit score`
   - 02 Choose your home — agent or ours, including new construction
   - 03 We buy it together — `At closing you choose how much to contribute and your co-ownership journey begins`
   - 04 Move in. Then buy.
4. **Why Mirabilis** (dark band) — no “Prices keep rising…” subhead. Card 01 must **not** say “not in five years of saving.”
5. **Who it’s for**
   - Fact boxes: **Small** / Initial contribution required · **+5 years** / Long-term program… · **+650** / Credit score required · **Texas**
   - Body: detached homes and townhomes, including new construction. **No** `$250k–$700k`, **no** “last ~20 years.”
6. **Sold homes carousel** — static cards, badge **Sold**, not clickable, not MLS.
7. **Videos** — local `teaser.mp4` with controls (not a YouTube embed). Caption: Mirabilis Homes teaser.
8. **Stories** — the five testimonial MP4s above, carousel.
9. **CTA** — `Get pre-qualified in minutes.` (not “3 minutes”).

Homepage section headings are centered. Hero overlay stays left.

### How it works `/how-it-works` ← `prototype/how-it-works.html`

- Keep the 4-step structure.
- Step 03: `When Mirabilis closes, you make a small contribution to the purchase price, buying you equity in the home.` **No 2%.**
- Step 04: `You sign a long-term lease at pre-agreed rental rates, with set strike prices.` **No “six years.”**
- Payments: “Your **initial contribution** is deposited…” **No 2%.** No “1–3 days” on apply.

### About `/about-us` ← `prototype/about.html`

Tone is a mix of Partners Home / About / Strategy (hyperfocused on Texas single-family).

Required wording:

- INTRO card: `A pathway-to-ownership program that lets residents start with a low initial payment and build equity on their own terms.`
- Strategy intro: `…as well as our unique pathway-to-ownership program (INTRO).`  
  **Never** “rent-to-own” on this page.
- “How we do it” paragraph **ends at** `asset management.` Do not add “and the rent-to-own program.”

Market stats (4.2% home-price CAGR, etc.) are industry facts, not program terms — those can stay.

### Sign in / Get pre-qualified

Match `sign-in.html` and `get-pre-qualified.html` (split panel + photo). Point the forms at the **existing** POST endpoints. Email + password only — **do not add Google or Outlook SSO**. Production login does not have it.

---

## 6. Copy rules (client-approved)

Use these everywhere on the public site:

| Do not publish | Use instead |
| --- | --- |
| Start with 2% / contribute 2% / 2% Tenant Fund | small / initial contribution |
| up to six years | long-term lease |
| rent-to-own | pathway-to-ownership |
| Search Homes / MLS | sold-homes carousel only |
| FAQ | remove |
| Office zip 78745 or 78704 | **78701** |
| Any 512 office number | **+1 912 493 78 30** |

Keep: credit **+650**, **+5 years** (certainty), **Small** initial contribution — those were requested.

---

## 7. Implementation order (so it can ship)

1. Add `assets/public/` (CSS, JS, media). Do not delete `assets/new-design/` until the cutover works on staging.
2. New view folder, e.g. `app/Views/public/` (`layout.php`, `home.php`, `how-it-works.php`, `about.php`, `sign-in.php`, `get-pre-qualified.php`) ported from the prototype HTML.
3. Point `Website::index` and `Website::page` at the new views. Restore `/` so it renders home (remove the Partners redirect).
4. Wire sign-in and sign-up to current controllers. Confirm a real account can still log in.
5. Staging pass against the preview URL (section order, copy, video autoplay, sold carousel, footer).
6. Only then switch production DNS / the live vhost. Logged-in app URLs (`/tenant/*`, `/mpanel/*`, `/user/*`) must keep working.

Staging to use: **https://stg.mirabilishomes.com/** (or the current stage host). Compare with **https://dipasolutionsllc.github.io/mirabilis-homes-preview/**.

---

## 8. QA checklist

- [ ] `/` is the new home, not a redirect to Partners.
- [ ] Hero video plays (not stuck on the poster). File is the compressed `hero.mp4`, not a 4K original.
- [ ] Teaser is the local MP4, not YouTube `scMfr2qyh0c`.
- [ ] No Search, FAQ, or MLS UI in nav or footer.
- [ ] No “2%”, “six years”, or “rent-to-own” on public pages.
- [ ] Footer: 500 W 2nd St, Suite 1900, Austin, Texas **78701**, phone **+1 912 493 78 30**.
- [ ] Nav: How it works, About, Stories, Sign in, Get pre-qualified.
- [ ] Sold homes: Sold badge, not clickable.
- [ ] Existing user can sign in and reach tenant / applicant dashboard.
- [ ] Desktop and mobile: home titles centered; hero copy left on the video.
- [ ] Inner pages use the solid nav.

---

## 9. Out of scope unless product asks later

- Restyling the logged-in INTRO journey (`prototype/journey/` is mock only).
- Rebuilding FAQ or MLS search.
- Changing dashboard, payments, DocuSign, or agent tools.
- Committing this prototype into `master` as-is; production should be the CI4 views above, using the prototype as the design spec.
