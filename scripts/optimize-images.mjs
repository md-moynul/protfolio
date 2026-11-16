import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeImages() {
  const imagesDir = path.resolve(__dirname, "..", "public", "images");
  const publicDir = path.resolve(__dirname, "..", "public");

  const files = await fs.readdir(imagesDir);
  const pngFiles = files.filter(
    (f) => f.endsWith(".png") && f !== "logo.png"
  );

  console.log(`Found ${pngFiles.length} PNG images in public/images to convert to WebP...`);

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of pngFiles) {
    const inputPath = path.join(imagesDir, file);
    const baseName = path.basename(file, ".png");
    const outputPath = path.join(imagesDir, `${baseName}.webp`);

    const maxWidth =
      baseName === "education" || baseName === "education-bg" ? 1920 : 1600;

    const inputStat = await fs.stat(inputPath);
    totalOriginal += inputStat.size;

    await sharp(inputPath)
      .resize({
        width: maxWidth,
        withoutEnlargement: true,
      })
      .webp({ quality: 80, effort: 6 })
      .toFile(outputPath);

    const outputStat = await fs.stat(outputPath);
    totalOptimized += outputStat.size;

    console.log(
      `✓ ${file} (${(inputStat.size / 1024).toFixed(1)} KB) -> ${baseName}.webp (${(
        outputStat.size / 1024
      ).toFixed(1)} KB) [${(((inputStat.size - outputStat.size) / inputStat.size) * 100).toFixed(1)}% smaller]`
    );
  }

  // Also convert public/dragon-news.png to public/images/dragon-news.webp if it exists
  const dragonNewsPath = path.join(publicDir, "dragon-news.png");
  try {
    const dragonStat = await fs.stat(dragonNewsPath);
    const dragonWebpPath = path.join(imagesDir, "dragon-news.webp");
    totalOriginal += dragonStat.size;

    await sharp(dragonNewsPath)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(dragonWebpPath);

    const dragonOutStat = await fs.stat(dragonWebpPath);
    totalOptimized += dragonOutStat.size;
    console.log(
      `✓ dragon-news.png (${(dragonStat.size / 1024).toFixed(1)} KB) -> images/dragon-news.webp (${(
        dragonOutStat.size / 1024
      ).toFixed(1)} KB)`
    );
  } catch (e) {
    // dragon-news.png not found or already handled
  }

  // Certificate image optimization (max 1200px width, quality 80 WebP, under 150KB)
  const rawAssetsDir = path.resolve(__dirname, "..", "raw-assets");

  // 1. Programming Hero certificate
  const phSources = [
    path.join(rawAssetsDir, "programming-hero-certificate.jpg"),
    path.join(publicDir, "certificate.jpg"),
  ];
  const phWebpPath = path.join(imagesDir, "certificate-programming-hero.webp");
  let phFound = false;
  for (const src of phSources) {
    try {
      const stat = await fs.stat(src);
      await sharp(src)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80, effort: 6 })
        .toFile(phWebpPath);
      const outStat = await fs.stat(phWebpPath);
      console.log(
        `✓ Programming Hero Certificate (${(stat.size / 1024).toFixed(1)} KB) -> images/certificate-programming-hero.webp (${(
          outStat.size / 1024
        ).toFixed(1)} KB)`
      );
      phFound = true;
      break;
    } catch (e) {
      // try next
    }
  }
  if (!phFound) {
    try {
      const existing = await fs.stat(phWebpPath);
      console.log(
        `ℹ️ certificate-programming-hero.webp already exists (${(existing.size / 1024).toFixed(1)} KB)`
      );
    } catch {
      console.warn("⚠️ raw-assets/programming-hero-certificate.jpg is missing");
    }
  }

  // 2. S&S Digital certificate
  const ssSources = [
    path.join(rawAssetsDir, "s-and-s-digital-certificate.png"),
    path.join(publicDir, "SS digital certificate.png"),
  ];
  const ssWebpPath = path.join(imagesDir, "certificate-s-and-s-digital.webp");
  let ssFound = false;
  for (const src of ssSources) {
    try {
      const stat = await fs.stat(src);
      await sharp(src)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80, effort: 6 })
        .toFile(ssWebpPath);
      const outStat = await fs.stat(ssWebpPath);
      console.log(
        `✓ S&S Digital Certificate (${(stat.size / 1024).toFixed(1)} KB) -> images/certificate-s-and-s-digital.webp (${(
          outStat.size / 1024
        ).toFixed(1)} KB)`
      );
      ssFound = true;
      break;
    } catch (e) {
      // try next
    }
  }
  if (!ssFound) {
    try {
      const existing = await fs.stat(ssWebpPath);
      console.log(
        `ℹ️ certificate-s-and-s-digital.webp already exists (${(existing.size / 1024).toFixed(1)} KB)`
      );
    } catch {
      console.warn("⚠️ raw-assets/s-and-s-digital-certificate.png is missing");
    }
  }

  // 3. Programming Hero Recommendation Letter (max 1400px width, quality ~80, under 200KB)
  const letterSources = [
    path.join(rawAssetsDir, "programming-hero-recommendation-letter.png"),
    path.join(rawAssetsDir, "programming-hero-recommendation-letter.jpg"),
    path.join(publicDir, "recommendation-letter.png"),
  ];
  const letterWebpPath = path.join(imagesDir, "letter-programming-hero-recommendation.webp");
  let letterFound = false;
  for (const src of letterSources) {
    try {
      const stat = await fs.stat(src);
      await sharp(src)
        .resize({ width: 1400, withoutEnlargement: true })
        .webp({ quality: 80, effort: 6 })
        .toFile(letterWebpPath);
      const outStat = await fs.stat(letterWebpPath);
      console.log(
        `✓ Recommendation Letter (${(stat.size / 1024).toFixed(1)} KB) -> images/letter-programming-hero-recommendation.webp (${(
          outStat.size / 1024
        ).toFixed(1)} KB)`
      );
      letterFound = true;
      break;
    } catch (e) {
      // try next
    }
  }
  if (!letterFound) {
    try {
      const existing = await fs.stat(letterWebpPath);
      console.log(
        `ℹ️ letter-programming-hero-recommendation.webp already exists (${(existing.size / 1024).toFixed(1)} KB)`
      );
    } catch {
      console.warn("⚠️ raw-assets/programming-hero-recommendation-letter.png is missing");
    }
  }

  // 4. ShopNest project image (max 1600px width, quality ~80, under 200KB)
  const shopnestSources = [
    path.join(rawAssetsDir, "shopnest.png"),
    path.join(rawAssetsDir, "shopnest.jpg"),
    path.join(publicDir, "shopnest.png"),
  ];
  const shopnestWebpPath = path.join(imagesDir, "shopnest.webp");
  let shopnestFound = false;
  for (const src of shopnestSources) {
    try {
      const stat = await fs.stat(src);
      await sharp(src)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 80, effort: 6 })
        .toFile(shopnestWebpPath);
      const outStat = await fs.stat(shopnestWebpPath);
      console.log(
        `✓ ShopNest image (${(stat.size / 1024).toFixed(1)} KB) -> images/shopnest.webp (${(
          outStat.size / 1024
        ).toFixed(1)} KB)`
      );
      shopnestFound = true;
      break;
    } catch (e) {
      // try next
    }
  }
  if (!shopnestFound) {
    try {
      const existing = await fs.stat(shopnestWebpPath);
      console.log(
        `ℹ️ shopnest.webp already exists (${(existing.size / 1024).toFixed(1)} KB)`
      );
    } catch {
      console.warn("⚠️ raw-assets/shopnest.png is missing");
    }
  }

  console.log("--------------------------------------------------");
  console.log(
    `Total original size: ${(totalOriginal / (1024 * 1024)).toFixed(2)} MB`
  );
  console.log(
    `Total optimized size: ${(totalOptimized / (1024 * 1024)).toFixed(2)} MB`
  );
  console.log(
    `Saved: ${(
      ((totalOriginal - totalOptimized) / totalOriginal) *
      100
    ).toFixed(1)}% bandwidth!`
  );
}

optimizeImages().catch((err) => {
  console.error("Optimization failed:", err);
  process.exit(1);
});

