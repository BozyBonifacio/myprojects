# My Projects — Portfolio

A static portfolio site showcasing my test projects and experiments, deployed with **GitHub Pages**.

🔗 **Live site:** https://bozybonifacio.github.io/myprojects/

## Stack

- Plain HTML / CSS / vanilla JS — no build step, no dependencies.
- Modern dark theme with animated, filterable project cards.
- Live repo stats (stars, last-updated) pulled from the GitHub API as progressive enhancement (the site works fully without JS).

## Files

| File          | Purpose                                              |
| ------------- | ---------------------------------------------------- |
| `index.html`  | Page structure (hero, projects, about, footer).      |
| `styles.css`  | Theme and layout.                                    |
| `script.js`   | Card rendering, filtering, animations, GitHub stats. |
| `projects.js` | **Edit this** to add / remove / reorder projects.    |
| `.nojekyll`   | Tells GitHub Pages to skip Jekyll processing.        |

## Adding a project

Open [`projects.js`](projects.js) and add an entry to the `PROJECTS` array:

```js
{
  title: "my-new-project",
  repo: "my-new-project",          // must match the GitHub repo name
  blurb: "Short description.",
  tags: ["TypeScript", "App"],
  icon: "🚀",
  demo: null,                       // or a live URL
}
```

Commit and push — GitHub Pages redeploys automatically.

## Enabling GitHub Pages (one-time)

Repo **Settings → Pages → Build and deployment**:
- **Source:** Deploy from a branch
- **Branch:** `main` / `/ (root)` → **Save**

The site goes live at the URL above within a minute or two.
