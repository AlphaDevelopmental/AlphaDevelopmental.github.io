# Visual implementation report

Date: 2026-11-17 · Branch `portfolio-modernisation` · **Uncommitted. Nothing pushed or deployed.**

## Files

| File | Change |
|---|---|
| `index.html` | Portrait component (hero, about, speaker); About profile card and pillars; two research figures; project visuals on all 15 cards (illustrated cards moved first); teaching diagram; commented, consent-gated photo galleries; ventures parent strip, official marks and distinct divisions |
| `style.css` | New "visual system" block: portrait, hero overlap, pillars, figures, project visuals, speaker header, gallery, venture variants; responsive and reduced-motion rules; print hides the hero portrait |
| `assets/images/**` | 14 new assets (see `IMAGE-ASSET-INVENTORY.md`), about 136 KB in total |
| `README.md` | Image-folder structure and the portrait swap note |
| `VISUAL-AUDIT.md`, `IMAGE-ASSET-INVENTORY.md`, `VISUAL-IMPLEMENTATION-REPORT.md`, `PHOTO-AND-SCREENSHOT-REQUESTS.md` | New reports |

`script.js` is **unchanged**. No content was deleted, and no factual claim was changed.

## Visuals added

| Where | Visual | Kind |
|---|---|---|
| Hero | Portrait frame with terminal overlap | Placeholder (abstract) |
| About | Profile card with photo slot; three pillars linking to Research, Ventures and Teaching | Placeholder + layout |
| Research | System map of R1–R8; method → output-type diagram (shows that no peer-reviewed publication is listed) | Diagrams |
| DevSecOps Security Gate Pipeline | GitHub Actions run #11, all gates green | **Genuine screenshot** |
| Mini Bank | User dashboard | **Genuine screenshot** |
| AppSec CI Guardrails | Gate graph and the CWE-22 SAST gap | Diagram |
| AI-Agent AppSec Triage | Context-manifest boundary and human review | Diagram |
| OSIRIS Intelligence Recon | Module pipeline and gated active mode | Diagram |
| CORS & SOP Lab | Misconfigured vs fixed policy | Diagram |
| JWT Security Lab | Broken vs safe validation | Diagram |
| Broken Access Control Lab | Authentication, authorisation and ownership checks | Diagram |
| Dockerised Security Lab | Compose topology | Diagram |
| Cookie, PortSwigger, CyberFloor, Azure, Dorking, Resolvers | Plain banner with repository path | Neutral placeholder (`aria-hidden`) |
| Teaching | Attack → explain → fix loop | Diagram |
| Speaking | Speaker header with avatar slot | Placeholder |
| Ventures | Official AlphaDevelopmental mark; Academy (gold) and Technologies (ice blue) | Brand |

## Performance

- New image weight is about 136 KB. Diagrams are about 5 KB SVGs; screenshots are 960×540 WebP (18 KB and 27 KB).
- Below-the-fold images are lazy and asynchronously decoded. The hero image is eager with high fetch priority.
- Every image has `width`/`height`, and project frames also reserve `aspect-ratio`. Measured CLS over a full scroll stayed under 0.1.
- No new JavaScript, fonts or libraries. The hover zoom on images is a CSS transform, disabled under reduced motion.

## SEO and canonical domain

Both `https://alphadevt.netlify.app/` and `https://alphadevelopmental.github.io/` serve this site:

- Netlify returned HTTP 200 with the same HTML plus Netlify's injected script.
- The GitHub API reports Pages as "built" from `main`. The github.io host wasn't reachable from this machine, so it couldn't be fetched directly.

**Every canonical-related URL currently points to `alphadevelopmental.github.io`:** canonical, `og:url`, `og:image`,
`twitter:image`, JSON-LD `@id`/`url`/`image`, `sitemap.xml` and the `robots.txt` sitemap line. So the metadata is
**internally consistent**, and the Netlify copy tells search engines that github.io is the original.

**Not changed (reversible default).** The choice is yours:

| Option | Implications |
|---|---|
| **Keep github.io canonical** (current) | No metadata change. Netlify can permanently redirect to github.io by adding a `_redirects` file (`/* https://alphadevelopmental.github.io/:splat 301!`), leaving one public address. Links already shared as alphadevt.netlify.app keep working. |
| **Switch to alphadevt.netlify.app** | Update the 9 references above (one find-and-replace). GitHub Pages can't send server redirects, so the github.io copy stays live and relies on the canonical tag. Search engines take weeks to re-consolidate, and social platforms cache old previews (refresh with LinkedIn Post Inspector). |
| **Custom domain later** | The best long-term option. Point both hosts at it and update the same 9 references once. |

Title, description, Open Graph and Twitter tags, JSON-LD, favicon, `robots.txt`, `sitemap.xml` and the social image are all unchanged and still valid.

## Tests performed (Playwright 1.65.1 + axe-core 4, local server, Chromium 1255)

Result: **80 / 80 automated checks passed** on the final run. The contact form endpoint was blocked in every test, so no messages were sent.

| Check | Result |
|---|---|
| No horizontal overflow at 320, 360, 375, 390, 414, 430, 600, 768, 820, 1024, 1280, 1440, 1920 px | Pass (13/13) |
| All visible images load (each scrolled into view and decoded) | Pass at all 13 widths |
| Terminal never overlaps the hero title | Pass at all 13 widths |
| No console errors | Pass at all 13 widths and during interactions |
| All `<img>` have width and height; content images have descriptive alt (40+ characters); decorative ones have `alt=""` | Pass |
| Hero eager, all other images lazy | Pass |
| CLS under 0.1 over a full scroll | Pass |
| Heading hierarchy (one h1, no skipped levels, among visible headings) | Pass |
| Filters (Application security → 5 cards, All → 15, `aria-pressed`) | Pass |
| Terminal `whoami` and `projects`; terminal input is the topmost element over the portrait | Pass |
| Command palette (Ctrl+K → "ventures" → focus lands on the section heading) | Pass |
| Visible focus ring on project links | Pass |
| About pillar link navigation | Pass |
| Mobile menu open and navigate (390 px, touch) | Pass |
| Mobile: introduction visible in the first viewport | Pass |
| Reduced motion disables image transitions | Pass |
| JavaScript off: all 15 project visuals present, counters show 15 | Pass |
| axe (WCAG 2.0/2.1/2.2 A and AA + best practice) at 320, 390, 768, 1024, 1440 px | **0 violations** |
| html-validate (recommended preset) | 42 findings, **identical to the committed baseline**: ARIA-table "prefer native" style rules, `aria-label` on lists, the honeypot's `autocomplete`, and title length. The new markup adds none. |

The diagrams were also reviewed visually on a contact sheet, and three label overflows were corrected. Screenshots
were reviewed at 1440 px and 390 px.

Not tested: real Safari or Firefox engines, a physical screen reader (axe covers the automated rules only),
and a Lighthouse score (no Lighthouse install available offline).

## Known limitations

- **Diagrams are small on phones.** The text is roughly 9–10 px at 340 px width. Every diagram has full alt text, and the card text carries the same information.
- The placeholder portrait appears in three places until a photo is supplied. It is deliberately abstract.
- Six project cards still have plain banners because no safe, authentic image exists yet.
- There are no organisation logos in the timeline (no permitted source).
- The CyberFloor banner says "cyber range · self-hosted" rather than a repository path, because no public repository exists.

## Waiting on authentic material

See `PHOTO-AND-SCREENSHOT-REQUESTS.md`: the portrait (highest value), 6–8 sanitised project screenshots, optional
consented teaching photos, and optional event photos for real engagements.
