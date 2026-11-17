# Visual audit — personal portfolio

Audit date: 2026-11-17 · Branch: `portfolio-modernisation` (clean working tree at start, HEAD `271ea01`,
identical in content to `origin/main` merge `c95ccf5`).

## 1. Starting point

| Area | Observation |
|---|---|
| Stack | Static HTML5, one CSS file using custom properties, vanilla JS, no build step. |
| Design tokens | Navy `#142b4a` / deep `#0e1f37` / soft `#1d3a61`, gold `#c99700` / bright `#e0b53a`, ice `#e5edf7`; dark background `#0b1626`. All text tokens at least 4.5:1. |
| Typography | Manrope (display), Inter (body), JetBrains Mono (technical labels). |
| Breakpoints | 1180, 1080 (nav becomes a menu), 900 (single-column hero), 700 (gutter 16 px), 380. |
| Motion | Card tilt and spotlight (fine pointer only), scroll reveal, counters; all disabled under `prefers-reduced-motion`. |
| Accessibility patterns | Skip link, `inert` command palette dialog, `aria-pressed` filters, live regions, visible gold focus ring, 24 px minimum targets. |
| Existing images | Only the α logo, favicons, touch icon and `og-image.png`. **No content imagery anywhere on the page.** |

## 2. Section-by-section observations

| Section | Before | Visual opportunity |
|---|---|---|
| Hero | Text left, terminal right. Strong, but the only visual is a terminal. | Portrait slot (none supplied) or abstract identity artwork, with the terminal kept. |
| About | Bio and a specialisations list. No photo slot, and research, entrepreneurship and teaching are only described in prose. | Profile card with a photo slot, plus three "pillars" connecting to the relevant sections. |
| Research | Eight text cards and four output-type columns. Hard to see how the areas relate. | A system diagram placing each area (R1–R8), and a method diagram showing how output types arise, including the absence of peer-reviewed publications. |
| Projects | Fifteen text-only cards of identical appearance; no way to see the work. | **Highest priority.** Real screenshots where the repositories contain safe ones; accurate diagrams where they don't; a neutral banner otherwise. |
| Experience | Timeline. | Organisation logos would need permission, and none were sourced. Left unchanged. |
| Teaching | Four text cards. | Diagram of the attack → explain → fix loop; a consent-gated photo gallery ready for later. |
| Speaking | Bio card. | Speaker profile header with a portrait slot; optional event-photo gallery for real events only. |
| Ventures | Two identical gold cards. | Official AlphaDevelopmental mark, a parent-organisation strip, and distinct accents for the two divisions. |

## 3. Evidence found in the linked repositories

Each linked repository's file tree was scanned for images (GitHub API):

| Repository | Images | Decision |
|---|---|---|
| devsecops-sast-sca-pipeline | 7 Actions/Trivy screenshots | **Used** run #11 (all gates green after CVE remediation), cropped to remove browser chrome, bookmarks and taskbar. |
| mini-bank | 9 UI screenshots | **Used** the user dashboard (test data only: zero balance, test account). |
| azure-vm-arm-template | 2 screenshots | **Rejected:** the Azure portal capture shows a personal email address in the account menu. |
| azure-vs-aws-cost-comparison | 10 calculator screenshots | Not used. They are pricing-calculator screens and add little; they can be added later if wanted. |
| portswigger-security-labs | lab screenshots | Not used: PortSwigger's lab UI is third-party. |
| password-cracking-lab | 4 GitHub screenshots | Not used (not a featured card). |
| All other featured repos | none | Diagrams drawn from the README architecture sections. |

## 4. Design decisions

1. **No fabricated imagery.** Visuals are labelled `Screenshot` or `Diagram` on the image itself. Cards without a visual get a plain banner showing the repository path, which is clearly not a screenshot and is hidden from assistive technology.
2. **One diagram language.** All ten SVGs share one generator: navy grid, gold for gates and boundaries, green for safe or passing, coral for broken or failing, blue for flow. Every label comes from the README or the published card text.
3. **Portrait component, placeholder state.** Abstract α artwork in a 4:5 frame, `alt=""` while it is a placeholder. It is used in three places (hero, about, speaker). Swapping the photo means changing one `src`/`alt` pair per placement (see `PHOTO-AND-SCREENSHOT-REQUESTS.md`).
4. **Hero composition.** Portrait right, terminal overlapping its lower edge with an opaque background so it stays readable. Below 900 px the placeholder is hidden so the introduction and terminal come first. A real photo would instead show as a compact banner above the terminal.
5. **Illustrated projects first.** The nine cards with visuals now come first, so rows stay visually even. Filters, counts and anchors are unaffected. No card content was changed.
6. **Ventures.** The official mark is copied from the organisation site's own favicon. Academy keeps the gold accent; Technologies uses the ice-blue link colour. One parent strip links to the organisation website. No organisation content is duplicated.
7. **Weight.** About 136 KB of new images in total: SVG diagrams of about 5 KB each, two WebP screenshots of 18 KB and 27 KB. No new libraries, fonts or scripts.
8. **Not done, deliberately:** organisation logos in the experience timeline (no permitted source), stock photography, generated likenesses, and fake classroom photographs.
