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

  // Certificate image optimization (max 1200px width, quality 80 WebP)
  const certJpgPath = path.join(publicDir, "certificate.jpg");
  const certWebpPath = path.join(imagesDir, "certificate-programming-hero.webp");
  try {
    const certStat = await fs.stat(certJpgPath);
    totalOriginal += certStat.size;

    await sharp(certJpgPath)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(certWebpPath);

    const certOutStat = await fs.stat(certWebpPath);
    totalOptimized += certOutStat.size;
    console.log(
      `✓ certificate.jpg (${(certStat.size / 1024).toFixed(1)} KB) -> images/certificate-programming-hero.webp (${(
        certOutStat.size / 1024
      ).toFixed(1)} KB)`
    );
  } catch (e) {
    // certificate.jpg already converted or removed
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

