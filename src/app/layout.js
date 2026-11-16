import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollToTop from "@/components/ScrollToTop";
import SmoothScroll from "@/components/SmoothScroll";
import profile from "@/data/profile";

export const metadata = {
  metadataBase: new URL("https://md-moynul.vercel.app"),
  title: {
    default: "Md. Moynul Islam | Full-Stack Developer",
    template: "%s | Md. Moynul Islam",
  },
  description:
    "Full-Stack Developer from Rangpur, Bangladesh. Building modern web apps with clean code and thoughtful design.",
  keywords: [
    "Md. Moynul Islam",
    "Moynul",
    "Full-Stack Developer",
    "Full Stack Developer",
    "MERN",
    "MERN Stack",
    "Next.js Developer",
    "React Developer",
    "Next.js",
    "React",
    "Node.js",
    "MongoDB",
    "JavaScript",
    "TypeScript",
    "Portfolio",
    "Rangpur",
    "Bangladesh",
  ],
  authors: [{ name: profile.name, url: "https://md-moynul.vercel.app" }],
  creator: profile.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://md-moynul.vercel.app",
    siteName: `${profile.name} - Portfolio`,
    title: `${profile.name} | Full-Stack Developer`,
    description:
      "Full-Stack Developer building modern web apps with clean code and thoughtful design.",
    images: [
      {
        url: "/moynul.webp",
        width: 800,
        height: 800,
        alt: profile.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} | Full-Stack Developer`,
    description:
      "Full-Stack Developer building modern web apps with clean code and thoughtful design.",
    images: ["/moynul.webp"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: "Full-Stack Developer (MERN)",
    url: "https://md-moynul.vercel.app",
    image: "https://md-moynul.vercel.app/moynul.webp",
    sameAs: [profile.github, profile.linkedin, profile.facebook].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rangpur",
      addressCountry: "BD",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: profile.institute,
    },
  };

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SmoothScroll />
          <ScrollProgress />
          <ScrollToTop />
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
