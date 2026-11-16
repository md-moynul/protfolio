import sharp from "sharp";

const svg = `
<svg width="1600" height="1200" viewBox="0 0 1600 1200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0F19"/>
      <stop offset="50%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#0A0D14"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#2D8CFF" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#2D8CFF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2D8CFF"/>
      <stop offset="100%" stop-color="#60A5FA"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1200" fill="url(#bg)"/>
  <circle cx="800" cy="480" r="600" fill="url(#glow)"/>

  <!-- Subtle grid -->
  <g stroke="#2D8CFF" stroke-opacity="0.08" stroke-width="1.5">
    <line x1="0" y1="200" x2="1600" y2="200"/>
    <line x1="0" y1="400" x2="1600" y2="400"/>
    <line x1="0" y1="600" x2="1600" y2="600"/>
    <line x1="0" y1="800" x2="1600" y2="800"/>
    <line x1="0" y1="1000" x2="1600" y2="1000"/>
    <line x1="300" y1="0" x2="300" y2="1200"/>
    <line x1="600" y1="0" x2="600" y2="1200"/>
    <line x1="900" y1="0" x2="900" y2="1200"/>
    <line x1="1200" y1="0" x2="1200" y2="1200"/>
  </g>

  <!-- Card mockup container -->
  <g transform="translate(800, 520)">
    <!-- Floating Badge -->
    <rect x="-180" y="-280" width="360" height="56" rx="28" fill="#2D8CFF" fill-opacity="0.15" stroke="#2D8CFF" stroke-opacity="0.4" stroke-width="2"/>
    <text x="0" y="-244" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#2D8CFF" text-anchor="middle" letter-spacing="3">TEAM PROJECT · BRANCH: MOYNUL</text>

    <!-- Main Title -->
    <text x="0" y="-130" font-family="system-ui, -apple-system, sans-serif" font-size="100" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="-1">ShopNest</text>
    
    <!-- Subtitle -->
    <text x="0" y="-60" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="500" fill="#94A3B8" text-anchor="middle">Collaborative Full-Stack E-Commerce Platform</text>

    <!-- App Preview Frame -->
    <rect x="-460" y="10" width="920" height="420" rx="24" fill="#151B28" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="2"/>
    
    <!-- Window dots -->
    <circle cx="-410" cy="46" r="9" fill="#EF4444" opacity="0.8"/>
    <circle cx="-382" cy="46" r="9" fill="#F59E0B" opacity="0.8"/>
    <circle cx="-354" cy="46" r="9" fill="#10B981" opacity="0.8"/>
    <rect x="-200" y="32" width="400" height="28" rx="14" fill="#0B0F19" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="1"/>
    <text x="0" y="51" font-family="monospace" font-size="14" fill="#64748B" text-anchor="middle">shopnest-frontend-vo3a.onrender.com</text>

    <!-- Mockup content items -->
    <rect x="-420" y="90" width="260" height="290" rx="16" fill="#0B0F19" stroke="#FFFFFF" stroke-opacity="0.06"/>
    <rect x="-130" y="90" width="260" height="290" rx="16" fill="#0B0F19" stroke="#FFFFFF" stroke-opacity="0.06"/>
    <rect x="160" y="90" width="260" height="290" rx="16" fill="#0B0F19" stroke="#FFFFFF" stroke-opacity="0.06"/>
    
    <!-- Highlight in middle card -->
    <circle cx="0" cy="180" r="45" fill="#2D8CFF" fill-opacity="0.15"/>
    <path d="M-18 175 L-6 195 L20 160" stroke="#2D8CFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <text x="0" y="270" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#FFFFFF" text-anchor="middle">Dynamic Cart &amp; Auth</text>
    <text x="0" y="305" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#64748B" text-anchor="middle">JWT · Nodemailer · Mongo</text>
  </g>

  <!-- Tech tags at bottom -->
  <g transform="translate(800, 1080)" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="600">
    <text x="0" y="0" fill="#64748B" text-anchor="middle">React · TypeScript · Tailwind CSS · Node.js · Express · MongoDB</text>
  </g>
</svg>`;

async function run() {
  await sharp(Buffer.from(svg))
    .webp({ quality: 85 })
    .toFile("public/images/shopnest.webp");
  console.log("Successfully created public/images/shopnest.webp");
}

run().catch(console.error);

