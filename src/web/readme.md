# web
This folder is root for our `react` single page application (SPA).
```
src/web
├── app.tsx
├── assets
│   ├── styles.css
│   └── tailwind.css
├── clients
│   ├── api.client.tsx
│   ├── auth.client.tsx
│   └── reducer.tsx
├── components
│   ├── admin.tsx
│   ├── error.tsx
│   ├── gateway.tsx
│   ├── login.tsx
│   ├── notfound.tsx
│   └── register.tsx
├── context
│   ├── auth.context.tsx
│   ├── context.ts
│   └── theme.context.tsx
├── index.tsx
└── web.config.ts
```

- [Components](components/readme.md)
- [How to access web API](clients/readme.md)
- [Assets & Styles](assets/readme.md)
- [Context](context/readme.md)

Build & compilation:
- `webpack` will compile all `tsx` file.
- On `development` mode, webpack will use `HMR`. On `production` mode, webpack will optimize all assets.
- Run `npm run dev` to get `development` mode. Run `npm run build` to get `production` mode.
