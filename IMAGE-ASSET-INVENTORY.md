# Image asset inventory

Type key: **Genuine** = real capture of the project; **Diagram** = original explanatory drawing based on
documented facts; **Decorative** = no information content; **Placeholder** = stands in for a photo still to come;
**Brand** = official identity asset.

## New in this enhancement (`assets/images/`)

| File | Size | Used in | Type | Source / provenance | Optimisation |
|---|---|---|---|---|---|
| `profile/portrait-placeholder.svg` | 1.7 KB | Hero, About, Speaking | Placeholder (decorative, `alt=""`) | Original artwork made for this site; not a likeness | SVG, scalable |
| `projects/devsecops-pipeline-run-success.webp` | 27 KB · 960×540 | DevSecOps Security Gate Pipeline card | Genuine screenshot | Owner's repo `devsecops-sast-sca-pipeline/screenshot/trivy-patched.png` (GitHub Actions run #11). Cropped to remove browser bookmarks, OS bar and account avatar menu. | Cropped, resized from 1920×1080, WebP q82, metadata stripped |
| `projects/mini-bank-user-dashboard.webp` | 18 KB · 960×540 | Mini Bank card | Genuine screenshot | Owner's repo `mini-bank/screenshots/User Dashboard/1dashboardUser.png`. Test data only. | Cropped, resized, WebP q82, metadata stripped |
| `projects/ci-guardrails-gates.svg` | 5 KB | AppSec CI Guardrails card | Diagram | `appsec-ci-guardrails` README: job dependency graph and detection table (CWE-22 gap) | Hand-built SVG |
| `projects/ai-triage-context-boundary.svg` | 5.5 KB | AI-Agent AppSec Triage card | Diagram | `appsec-triage-capstone` repo and card text; marked "in progress" | SVG |
| `projects/osiris-recon-pipeline.svg` | 5 KB | OSIRIS Intelligence Recon card | Diagram | `osiris-intelligence-recon` README: Architecture section and gated active-mode flags | SVG |
| `projects/cors-misconfig-vs-fixed.svg` | 5.6 KB | CORS & SOP Lab card | Diagram | `CORS-SOP-lab` README: origin reflection with credentials vs the correct allowlist pattern | SVG |
| `projects/jwt-broken-vs-safe.svg` | 5.3 KB | JWT Security Lab card | Diagram | Card text (safe vs broken servers; `alg:none`, weak secret) | SVG |
| `projects/bac-three-checks.svg` | 5.3 KB | Broken Access Control Lab card | Diagram | `Broken-access-control_lab` README: "authentication, authorization, and ownership"; IDOR, privilege escalation, JWT forgery | SVG |
| `projects/security-lab-topology.svg` | 5.3 KB | Dockerised Security Lab card | Diagram | `security-lab` README: included applications and Portainer bound to localhost | SVG |
| `research/research-areas-system-map.svg` | 6.2 KB | Research section | Diagram | Maps the eight published research areas (R1–R8) onto system layers | SVG |
| `research/research-method-outputs.svg` | 5.5 KB | Research section | Diagram | Published output types; states that no peer-reviewed publication is listed | SVG |
| `teaching/teaching-loop.svg` | 4.1 KB | Teaching section | Diagram | Section text: "attack a system, explain the root cause, then fix it" | SVG |
| `ventures/alphadevelopmental-mark.svg` | 0.4 KB | Ventures (parent strip, both cards) | Brand | Exact copy of the official organisation site's favicon (`alphadevelopmental-website.netlify.app/favicon.svg`), owned by the portfolio owner | SVG |

The diagram generator is not committed to the site. It lives in the session scratchpad, and the SVGs are plain
editable text, so they can be changed by hand.

## Existing assets (unchanged)

| File | Used in | Type | Provenance |
|---|---|---|---|
| `assets/logo.svg`, `favicon.svg`, `favicon-16/32.png`, `apple-touch-icon.png`, `logo-512.png` | Header, browser icons, JSON-LD image | Brand (personal α mark) | Created for the portfolio in the previous modernisation |
| `assets/og-image.png` (1200×630) | Social previews | Brand | Rendered from an HTML template in the previous modernisation |

## Loading behaviour

- Hero portrait: `fetchpriority="high"`, eager. Every other content image uses `loading="lazy"` and `decoding="async"`.
- Every `<img>` has explicit `width` and `height`. Project visuals also reserve a 16:9 `aspect-ratio`. Measured CLS over a full scroll was below 0.1 (test passed).
- No external hotlinked images; all assets are served from the repository.

## Rights notes

- Screenshots come from the owner's own public repositories and show the owner's own software.
- The Mini Bank capture shows the application's name ("Aquinex Bank"), a test account number and a $0.00 balance. No real customer data.
- No third-party logos (SQI, OAU, Cisco, CompTIA, HackerOne, PortSwigger) are used. Add them only with permission.
