# CONTEXTE.md — Mushroom Clone (Next.js + MDX)

## Goal
Clone **mushroom.cat** as closely as possible (UI structure + behaviors), in a separate project folder.

- Source reference (static mirror): `/mnt/nas_ext/mushroom.cat/`
- New project: `/mnt/nas_ext/My website/mushroom-clone/`
- Must not depend on WordPress theme runtime.

## Tech stack
- Next.js App Router (v16)
- TypeScript
- Tailwind
- MDX content (`content/**/*.mdx`)

## Run
```bash
cd "/mnt/nas_ext/My website/mushroom-clone"
npm install
npm run dev -- --port 3005 --hostname 0.0.0.0
```

Test URLs:
- Home: `http://192.168.1.49:3005/`
- Post test: `http://192.168.1.49:3005/ctf/cyctf25-pwn`

## Important files
- Global layout: `src/app/layout.tsx`
- Home page: `src/app/page.tsx` (client component with search/filter)
- Post page: `src/app/[...slug]/page.tsx`
- Shell/nav/menu: `src/components/MushroomShell.tsx`
- Loader: `src/components/LoaderOverlay.tsx`
- Pin code UI: `src/components/CodeBlock.tsx`, `src/components/PinnedCodeProvider.tsx`
- Share block: `src/components/ShareArticle.tsx`
- Scroll-top: `src/components/ScrollTopButton.tsx`
- Floating widget: `src/components/FloatingWidget.tsx`
- MDX renderer: `src/components/MDXContent.tsx`
- Content parser: `src/lib/posts.ts`

## Assets imported
- CSS:
  - `public/mc/mushroom.css` (from Argon copied mirror CSS)
  - `public/mc/mushroom-post.css` (from mirror `_next/static/css/f3b8208e8dab82f4.css`)
- Images: `public/images/*`, `public/mc/images/*`
- Fonts/media: `public/media/*`

## Current status

## Handoff snapshot (2026-02-18 20:50)
- **Estimated clone completion:** ~68%
- **Decision:** Pause active implementation here; continue in Codex 5.3 desktop.
- **Why not 100% yet:** core shell/features are in place, but pixel-perfect single-post parity and some interaction details still differ.

### Done
- Separate Next.js project created on NAS.
- Base mushroom shell (dot overlay, nav, fullscreen menu) exists.
- Loader overlay added and functional.
- Home page renders cards from MDX posts.
- Post route works via catch-all slug + MDX.
- Pin code feature exists (Pin + floating panel + copy).
- Missing static assets issue fixed (`/images` and `/media` paths).
- Duplicate "Mushroom" brand on post page removed.
- **Home page search functionality**: Real-time filtering by title, description, and tags.
- **Tag filter dropdown**: Multi-select tag filtering with visual indicators, tag count badge, and clear all functionality.
- **Post page structure**: Improved spacing, typography, and DOM organization matching mirror layout.
- **Share panel**: Enhanced animations, chevron indicator, copy feedback, and smooth transitions.
- **Floating widget**: Scroll-triggered partycat widget with proper show/hide behavior (appears after 400px scroll).
- **Scroll-to-top button**: Improved threshold (shows after 500px) and timing.
- **Tags section**: Cleaner layout with separators and improved hover effects.
- **Related posts**: Better spacing and consistent formatting.

### Not fully parity yet
- Some Next warnings remain (themeColor metadata format / allowedDevOrigins warning in dev).
- Typography/spacing/opacity/transitions may need further pixel-perfect adjustments.

## Known caveats
- Mirror HTML includes Next runtime internals (`self.__next_f` etc.); do NOT copy those literally.
- Goal is behavioral and visual parity, not binary-identical generated runtime bundles.

## Next tasks (priority)
1. Tighten typography/spacing/opacity/transitions to near pixel parity with mirror.
2. Add more sample MDX posts to validate grid and related-post logic.
3. Fine-tune animations and micro-interactions to match mirror exactly.
4. Address Next.js warnings (themeColor metadata format / allowedDevOrigins).

## User preference
- User wants direct, no-fluff progress.
- User explicitly requested: "Clone every detail."
- Keep working and only report meaningful milestones.
