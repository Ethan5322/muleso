# Brand fonts

Used by `scripts/make-brand-kit.cjs`, which renders the business card and banner
in headless Chrome. These files are committed on purpose: without them the
renderer falls back to a system font and the printed output stops being on-brand.

| Family  | Weights            | Role                    |
|---------|--------------------|-------------------------|
| Sora    | 400, 600, 700, 800 | Headlines, wordmark     |
| DM Sans | 400, 500, 700      | Body, contact details   |

Both are licensed under the **SIL Open Font License 1.1**, which permits
redistribution — including bundling in a repository — provided the fonts are not
sold on their own.

- Sora — https://fonts.google.com/specimen/Sora
- DM Sans — https://fonts.google.com/specimen/DM+Sans

Subsets are the `latin` woff2 builds from `@fontsource`. To refresh:

```
curl -o sora-latin-700-normal.woff2 \
  https://cdn.jsdelivr.net/npm/@fontsource/sora@5/files/sora-latin-700-normal.woff2
```
