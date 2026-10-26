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

## Commands that im gonna use when creating the documentation

# Prisma

When making changes on the schemas.
``` bash
npx prisma contract emit
npx prisma db update
```

For creating random keys
```
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```