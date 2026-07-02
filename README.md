# UX / UI Design Portfolio — Hotragn Pettugani

Live site: **https://hotragn.github.io/UI-UX-Design-Portfolio/**

A hand-coded portfolio: no framework, no template, no build step. Semantic HTML, a small design-system CSS layer, and vanilla JS for the interaction work (3D tilt, custom cursor, word reveal, design-notes mode). Every animation respects `prefers-reduced-motion`.

## Structure

```
index.html              Home: case studies, live prototypes, experience, publications
work/*.html             Case studies (PayPal, Rare Rabbit, Notion, Family Foundations)
css/style.css           Design system: type scale, palette, components
css/enhancements.css    Interaction layer: cursor, tilt, marquee, embeds, findings
js/main.js              All behavior, progressive-enhancement style
assets/                 Wireframe PDFs served locally
```

## CI/CD

Two GitHub Actions workflows:

- **deploy.yml** — on every push to `main`: HTML validation (`html-validate`), offline internal link integrity (`lychee`), WCAG 2.1 AA accessibility audit (`pa11y-ci`) — all three must pass before deploy to GitHub Pages, followed by a post-deploy smoke test of every page.
- **link-health.yml** — weekly external link check across Figma, Drive, Medium, and deployed apps; opens a GitHub issue automatically if an artifact link dies.

Run the checks locally:

```
npx html-validate "index.html" "404.html" "work/*.html"
npx http-server . -p 8080   # then: npx pa11y-ci --config .pa11yci.json
```

## License

Content and design © Hotragn Pettugani. Please don't republish the case studies.
