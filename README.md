# DoodleGlow — Collaborative Whiteboard (Turborepo)

A real-time collaborative whiteboard app inspired by Excalidraw. Draw, sketch, brainstorm, and collaborate with your team in real-time — built inside a Turborepo monorepo.

---

## 🚀 Features

* ✍️ **Real-time drawing canvas** — freehand strokes, shapes, text, and selection.
* 👥 **Rooms & invites** — create rooms, generate 8‑char join codes, and invite collaborators with expirations.
* 🔁 **Live collaboration** — sync drawing events via WebSockets.
* 🔐 **Authentication** — Email + OAuth (Google) example wiring.
* 🗂️ **Memberships** — room member management via Prisma join table.
* 📦 **Monorepo** — frontend, backend, and shared packages managed by Turborepo.
* 🧰 **Dev tooling** — TypeScript, ESLint, Prettier, Prisma migrations.

---

## 🛠️ Tech Stack

| Layer      | Technology                            |
| ---------- | ------------------------------------- |
| Frontend   | Next.js (App Router), React, Tailwind |
| Backend    | Node.js, Express, WebSocket (ws)      |
| Database   | PostgreSQL (Neon/Managed), Prisma     |
| Monorepo   | Turborepo, pnpm                       |
| Auth       | NextAuth, default backend credentials |
| Deployment | Vercel (frontend), AWS EC2 (backend)  |

---

## 🔢 Invite / Code generation

We generate an 8-character uppercase random code using `uuid`:

```ts
import { v4 as uuidv4 } from 'uuid';

export function generateCode(): string {
  return uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase();
}
```

Set an expiration when creating invites:

```ts
const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
```

When validating, compare against `expiresAt` (not the code string).

---

## 📁 Monorepo Layout

```
repo-root/
├── apps/
│   ├── frontend    # Next.js app (UI + client)
│   ├── backend     # Express + WebSocket server (API)
│   └── db          # Prisma schema & migrations
├── packages/
│   ├── ui          # Shared React components
│   ├── backend-common # Shared server utilities
│   └── types       # Shared TypeScript types
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## ⚙️ Environment Variables

Create `.env` in relevant apps (examples below):

**apps/backend/.env**

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
PORT=3001
```

**apps/frontend/.env.local**

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
```

---

## 🧭 Getting Started (Local)

1. **Clone & install**

```bash
git clone https://github.com/Srv108/Excalidraw.git
cd Excalidraw
pnpm install
```

2. **Create env files** — place values in `apps/backend/.env` and `apps/frontend/.env.local`.

3. **Prisma: generate & migrate**

```bash
cd apps/db
npx prisma generate
npx prisma migrate dev --name init
```

4. **Run dev**

From repo root:

```bash
pnpm dev
# or
pnpm exec turbo dev
```

This runs frontend (Next.js) and backend concurrently using your Turborepo pipeline.

---

## 🔁 Example Endpoint: Join Room (checks invite expiry + creates membership)

```ts
app.post('/join-room', isAuthenticated, async (req, res) => {
  const joinCode = req.body.joinCode;
  const userId = req.user?.id;

  const invite = await prisma.roomInvite.findFirst({
    where: {
      code: joinCode,
      expiresAt: { gte: new Date() }
    }
  });

  if (!invite) return res.status(400).json({ error: 'Invalid or expired invite' });

  await prisma.roomMember.create({
    data: { roomId: invite.roomId, userId, role: 'MEMBER' }
  });

  const room = await prisma.room.findUnique({
    where: { id: invite.roomId },
    include: { memberships: { include: { user: true } }, chats: true }
  });

  res.json({ room });
});
```

---

## 🖼️ Screenshots (placeholders)

* Landing Page: [![landing page](image-2.png)] [![Features](image-3.png)] [![collaborate](image-4.png)] 
* Login: [![login](image-5.png)]
* Dashboard: [![Dashboard](image-1.png)]
* Canvas: [![white board](image.png)]

---

## ☁️ Deployment Notes

* Use **Vercel** for the frontend (build `apps/frontend`).
* Use **AWS EC2** or any Node host for the backend; enable HTTPS with **Let's Encrypt**.
* For production DB migrations, run: `npx prisma migrate deploy`.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit & push
4. Open a Pull Request

---

## 📜 License

MIT © Saurabh Kumar

---

*If you want this formatted exactly like the Full Stack AI README you showed (with badges, a short intro paragraph, or specific sections added/removed), tell me which parts to copy over and I’ll update the file.*


# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build
yarn dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)



