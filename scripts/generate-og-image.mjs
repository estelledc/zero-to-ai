import sharp from 'sharp';

const width = 1200;
const height = 630;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0e1014"/>
      <stop offset="1" stop-color="#111c22"/>
    </linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientTransform="translate(840 250) rotate(140) scale(520 420)">
      <stop offset="0" stop-color="#46c7cf" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#46c7cf" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#9ee9ed" stroke-opacity="0.055" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="url(#background)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect x="48" y="48" width="1104" height="534" rx="24" fill="none" stroke="#9ee9ed" stroke-opacity="0.16"/>

  <g font-family="Helvetica Neue, PingFang SC, Arial Unicode MS, sans-serif">
    <text x="84" y="112" fill="#87dfe4" font-size="18" font-weight="600" letter-spacing="4">JASON / WORKS  ·  LEARNING SYSTEM</text>
    <text x="84" y="272" fill="#f4f7f7" font-size="92" font-weight="600" letter-spacing="-4">Zero to AI</text>
    <text x="88" y="330" fill="#c9d5d7" font-size="28" font-weight="400">从第一条命令，到公开交付</text>
    <text x="88" y="374" fill="#7f9196" font-size="19" font-weight="400">Evidence-led Chinese learning paths for Claude Code and Codex.</text>

    <g transform="translate(84 476)" font-size="16" font-weight="600" letter-spacing="1.4">
      <rect width="122" height="46" rx="23" fill="#15353a" stroke="#55c9d0" stroke-opacity="0.45"/>
      <text x="61" y="29" fill="#9ee9ed" text-anchor="middle">4 PATHS</text>
      <rect x="138" width="198" height="46" rx="23" fill="#182a31" stroke="#55c9d0" stroke-opacity="0.28"/>
      <text x="237" y="29" fill="#b9c8ca" text-anchor="middle">45 CONTENT PAGES</text>
      <rect x="352" width="220" height="46" rx="23" fill="#182a31" stroke="#55c9d0" stroke-opacity="0.28"/>
      <text x="462" y="29" fill="#b9c8ca" text-anchor="middle">ASTRO + STARLIGHT</text>
    </g>

    <g transform="translate(832 142)">
      <path d="M36 28 V292" fill="none" stroke="#55c9d0" stroke-opacity="0.42" stroke-width="2"/>
      <g font-size="16" font-weight="600">
        <circle cx="36" cy="28" r="18" fill="#17383d" stroke="#7bdce1"/>
        <text x="36" y="34" fill="#baf3f5" text-anchor="middle">01</text>
        <text x="78" y="34" fill="#e6eeee">Choose a path</text>
        <circle cx="36" cy="116" r="18" fill="#17383d" stroke="#7bdce1"/>
        <text x="36" y="122" fill="#baf3f5" text-anchor="middle">02</text>
        <text x="78" y="122" fill="#e6eeee">Build the loop</text>
        <circle cx="36" cy="204" r="18" fill="#17383d" stroke="#7bdce1"/>
        <text x="36" y="210" fill="#baf3f5" text-anchor="middle">03</text>
        <text x="78" y="210" fill="#e6eeee">Verify evidence</text>
        <circle cx="36" cy="292" r="18" fill="#2f6972" stroke="#9ee9ed"/>
        <text x="36" y="298" fill="#ffffff" text-anchor="middle">04</text>
        <text x="78" y="298" fill="#ffffff">Ship in public</text>
      </g>
    </g>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('public/og-default.png');

console.log(`Generated public/og-default.png (${width}×${height})`);
