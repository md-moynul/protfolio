export default function robots() {
  const baseUrl = "https://md-moynul.vercel.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/login"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

