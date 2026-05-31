# Screenshots

Drop real PNG/JPG screenshots here and reference them from [`../projects.js`](../projects.js).

The gallery currently renders **mock panels** (terminal output, Infracost-style
cost analysis, and UI mockups) so it looks complete without any image files. To
replace a mock with a real screenshot, change that project's shot to:

```js
{
  kind: "image",
  frame: "browser",            // "browser" or "phone"
  src: "screenshots/my-shot.png",
  caption: "What this screen shows.",
}
```

## Tips
- **Browser frame:** ~1280×800 px screenshots look best.
- **Phone frame:** use a tall mobile capture (e.g. 390×844 px).
- Keep files reasonably small (< 500 KB) so the page stays fast.
- File names are case-sensitive on GitHub Pages.
