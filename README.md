# AlphaDevelopmental.github.io

Personal professional portfolio of **Ajani Taiwo Micheal**:
Cybersecurity Researcher | Technology Entrepreneur | Educator.

🔗 Live site: https://alphadevelopmental.github.io/

This is a **personal** site. The AlphaDevelopmental Academy and AlphaDevelopmental Technologies
organisation website is separate: https://alphadevelopmental-website.netlify.app/

## Stack

- HTML5 and modern CSS3 (custom properties, Grid, Flexbox)
- Vanilla JavaScript (ES2020+), with no build step and no framework
- [Web3Forms](https://web3forms.com) for the contact form

## Structure

```
index.html    → page structure, content, SEO metadata and JSON-LD (Person)
style.css     → design tokens (AlphaDevelopmental navy and gold) and layout
script.js     → terminal, command palette, project filters, mobile menu, contact form
assets/       → logo, favicons and the social-sharing image (og-image.png)
  images/
    profile/   → portrait (currently an abstract placeholder)
    projects/  → project screenshots (WebP) and diagrams (SVG)
    research/  → research diagrams
    teaching/  → teaching diagram (+ consented photos, when supplied)
    ventures/  → official AlphaDevelopmental mark
robots.txt    → crawler rules and sitemap pointer
sitemap.xml   → single-page sitemap
```

## Sections

About · Research interests and outputs · Selected projects · Professional experience ·
Education and credentials · Teaching and curriculum development ·
Speaking, Research & Collaboration · AlphaDevelopmental ventures · Contact

## Interactive features (progressive enhancement)

All content and navigation work without JavaScript. With JavaScript enabled:

- Interactive terminal (`help`, `whoami`, `research`, `projects`, `certs`, `experience`,
  `teaching`, `speaking`, `ventures`, `socials`, `contact`, `clear`), with tap-friendly
  command chips on touch devices
- Command palette (Ctrl/⌘ + K, or the search button), an accessible combobox dialog
- Project filters with per-category counts and screen-reader announcements
- Collapsible mobile navigation
- Contact form with inline validation, a honeypot, timing-based spam checks and safe error handling

Motion effects are disabled for visitors who prefer reduced motion.

## Maintaining content

- **Projects:** each card in `#projectGrid` is an `<article class="project-card" data-cat="…">`.
  Valid categories are `appsec`, `devsecops`, `ai`, `recon`, `infra` and `software`. Filter
  counts and the hero project figure are calculated from the cards, so they update automatically.
- **Credentials:** rows in the `#credentials` log table. The terminal's `certs` command reads
  this table directly.
- **Images:** each project card starts with a `.project-visual` labelled *Screenshot* or *Diagram*. Use 16:9
  WebP for screenshots, strip metadata, set `width`/`height`, `loading="lazy"` and descriptive alt text.
  See `IMAGE-ASSET-INVENTORY.md`.
- **Portrait:** replace `portrait-placeholder.svg` in the three `.portrait` figures and remove `is-placeholder`.
  See `PHOTO-AND-SCREENSHOT-REQUESTS.md`.
- After changing content, update `<lastmod>` in `sitemap.xml`.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

GitHub Pages serves this repository from the `main` branch, so every push to `main` updates the
live site.

## Contact

- Email: micheal.techservices@gmail.com
- LinkedIn: [ajani-taiwo-493520195](https://www.linkedin.com/in/ajani-taiwo-493520195/)
- GitHub: [@AlphaDevelopmental](https://github.com/AlphaDevelopmental)
- HackerOne: [glassglow_sec](https://hackerone.com/glassglow_sec)
