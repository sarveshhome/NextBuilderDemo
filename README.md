# NextBuilderDemo

Next.js App Router project integrated with [Builder.io](https://www.builder.io/).

## Setup

1. Create a Builder.io account and get your **Public API Key**.
2. Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_BUILDER_API_KEY=your_builder_public_api_key
```

3. In Builder, create a **Page** model entry whose URL matches a route in this app (for example `/`).
4. Publish the page.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Builder integration

- `lib/builder.ts` — Builder API key configuration.
- `components/RenderBuilderContent.tsx` — client component that renders Builder content and supports preview mode.
- `app/[[...page]]/page.tsx` — App Router catch-all route that fetches Builder `page` content by URL path.

The catch-all route renders any path that has matching Builder content. If no content exists and preview mode is not active, it returns a 404.
