import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollToTop from "@/components/ScrollToTop";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: "Portfolio | MD Moynul Islam",
  description:
    "Architecting the Future of Web Apps. MERN Stack Developer specialized in building fast, responsive web applications.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
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
