export function normalizeProjectImg(img) {
  if (!img || typeof img !== "string") return "/images/smart-health.webp";
  const trimmed = img.trim();
  if (!trimmed) return "/images/smart-health.webp";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  let normalized = trimmed;
  // Ensure leading slash
  if (!normalized.startsWith("/")) {
    normalized = "/" + normalized;
  }

  // Handle root level legacy names like /dragon-news.png
  if (normalized === "/dragon-news.png" || normalized === "/dragon-news.webp") {
    return "/images/dragon-news.webp";
  }

  // If path doesn't start with /images/, prepend it
  if (!normalized.startsWith("/images/")) {
    normalized = `/images${normalized}`;
  }

  // Replace legacy .png, .jpg, .jpeg with .webp
  normalized = normalized.replace(/\.(png|jpe?g)$/i, ".webp");

  return normalized;
}

