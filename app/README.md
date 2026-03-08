This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Troubleshooting

### `EPERM: operation not permitted, unlink` (Windows)

A process has a file in `node_modules` open (e.g. Next.js SWC or `workerd.exe`). Fix it:

1. **Stop everything** using the app: close all terminals running `yarn dev` / `npm run dev`, and close Cursor/VS Code (or at least its terminal and the project).
2. **Delete `node_modules`** (File Explorer, or in a new terminal: `rmdir /s /q node_modules` from the `app` folder).
3. **Install again** in a new terminal: `yarn install` or `npm install`.

If the project is under **OneDrive**, sync can lock files. Pause OneDrive sync, move the project to a non-synced path (e.g. `C:\dev\UncookedAura`), or exclude `node_modules` from OneDrive.
