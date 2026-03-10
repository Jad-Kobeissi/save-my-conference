# Save My Conference Next Same V9

This rebuild keeps the **same Flask V10 / Same V9 visual design and flow** but runs on:

- Next.js
- TypeScript
- Prisma
- SQLite locally

## Run

```bash
npm install
cp .env.example .env
npx prisma db push
npm run dev
```

Open `http://localhost:3000`

## Default admin
- Email: `ns.saridar@gmail.com`
- Password: `admin12345`

## Notes
- Same beige paper design
- Same sidebar layout
- Same pages: dashboard, speech lab, quiz arena, crisis simulator, debate arena, plans, admin
- Same research file upload behavior
- Real local file saving in `uploads/`
- Works without OpenAI key using strong fallback generation
