# ARCHON — immersive architecture website

A four-page animated architecture-studio website concept built with React, Vite, React Three Fiber, Three.js, GSAP ScrollTrigger and React Router.

## Pages
- `/` — cinematic home page and scroll-driven 3D walkthrough
- `/residences` — animated project listing
- `/about` — studio story, animated image gallery, philosophy/value list
- `/contact` — contact details and demo enquiry form

## Run locally
Requires Node.js 18+.
```bash
npm install
npm run dev
```
Production build:
```bash
npm run build
npm run preview
```
The `dist/` folder is the production website output.

## Deploy to Vercel
1. Upload this project to a GitHub repository.
2. Import that repository in Vercel.
3. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
4. Deploy. `vercel.json` includes a rewrite for client-side routes.

## Important about the 3D walkthrough
The home page opens directly into a single pinned 3D scene. Scroll progress continuously moves the camera from the mansion's front approach through the entrance, living room, kitchen, master bedroom and rear pool terrace. Titles and explanatory text overlay the same scene; the tour does not swap room photographs. The included house is still a stylized procedural 3D prototype, not a photorealistic architectural asset. To meet a premium photorealistic brief, replace `HouseModel` in `src/App.jsx` with a licensed/custom `.glb` mansion that has connected exterior/interior geometry, and tune the camera path to its real doorways and room layout. A true continuous walk-through cannot be convincingly achieved with an exterior-only model or a sequence of still images.

The visual image sections use remote Unsplash image URLs for demo content. Replace them with owned/licensed project images before commercial resale. Add image credits/licenses as required.

The contact form currently demonstrates front-end interaction only and does not send email. Connect Formspree, Resend, WordPress, or another backend before production.

## WordPress compatibility
The `wordpress-theme/archon` folder is a separate starter theme you can upload in WordPress. It provides a native WordPress theme with Home, Residences, About and Contact page templates and animated styling. WordPress theme packaging cannot run the React/Three.js app directly; the theme is a compatibility starter, and the full scroll-driven 3D scene is currently in the Vite app. For the React build to be embedded in WordPress, host the Vercel build and embed it, or commission a React-to-WordPress integration.

## Before selling this template
- Replace placeholder studio contact/social details and demo content.
- Confirm licenses for every image and 3D asset.
- Connect the contact form and analytics.
- Test keyboard navigation, reduced-motion preferences, mobile performance and browser support.
- The 3D scene is GPU-heavy; use a real low-poly/optimized GLB and provide a static fallback on low-power mobile devices.


## Scroll-controlled video hero

The homepage hero uses the supplied residence-tour footage at `public/archon-tour.mp4`. Its playback position is synchronized to scroll progress. The opening headline fades away as the tour advances; labels are aligned to the actual visible sequence: entrance, living room, then garden and pool. Dining/kitchen labels were removed because those rooms are not clearly shown in the supplied clip. The fixed glass navigation stays visible throughout the scroll tour.

The provided source clip was only 736×414 pixels. The bundled version has been upscaled to 1280×720 with gentle sharpening and re-encoded at a high quality setting, which can reduce the softness of the previous encode but cannot restore details that were absent in the original. For genuinely crisp desktop playback, replace `public/archon-tour.mp4` with a native 1920×1080 or 4K export from Google Flow, keeping the same filename. Copy the replacement to `wordpress-theme/archon/assets/archon-tour.mp4` as well. Use H.264 MP4, 16:9, muted/no audio, with the exterior first and a smooth continuous camera path through the entrance, living room, and pool. Labels are timed to the supplied clip's current sequence.


### Video quality note
The hero video is upscaled to 2560 × 1440 and lightly denoised/sharpened. The original Pinterest clip is 736 × 414, so this improves display smoothness and compression but cannot recreate source details that were not present in the original. For genuinely native-detail clarity, replace the footage with a higher-resolution original.
