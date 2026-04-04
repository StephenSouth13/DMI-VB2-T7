import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/i18n";

const navKeys = [
  { key: "summary", href: "#summary" },
  { key: "opportunityMatrix", href: "#opportunity-matrix" },
  { key: "ranking", href: "#ranking" },
  { key: "sectorAnalytics", href: "#sector-analytics" },
  { key: "structuralShift", href: "#structural-shift" },
  { key: "swot", href: "#swot" },
  { key: "methodology", href: "#methodology" },
];

const NavigationBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);

      const sections = navKeys.map((l) => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        {/* --- PHẦN LOGO TỪ FILE PUBLIC/LOGO.PNG --- */}
<a 
  href="https://quachthanhlong.com" 
  target="_blank" 
  rel="noopener noreferrer" 
  className="flex items-center gap-3 group transition-all"
>
  {/* Hiển thị file logo.png của ông */}
  <img 
    src="/logo.png" 
    alt="Brand Logo" 
    className="h-12 w-auto object-contain opacity-100 group-hover:scale-105 transition-transform duration-200"  
  />
  
  {/* Text thương hiệu đi kèm (tùy chọn, có thể xóa nếu logo đã có chữ) */}
</a>
        
        <div className="hidden md:flex items-center gap-1">
          {navKeys.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-200 ${
                activeSection === link.href.slice(1)
                  ? "text-emerald bg-emerald/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {t(`nav.${link.key}`)}
            </a>
          ))}
        </div>
        <button
          onClick={() => setLanguage(language === "en" ? "vi" : "en")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border/30"
        >
          <Globe className="w-3.5 h-3.5" />
          {language === "en" ? "VI" : "EN"}
        </button>
      </div>
      <div className="h-0.5 bg-border/30">
        <div
          className="h-full transition-[width] duration-100 ease-out"
          style={{
            width: `${scrollProgress}%`,
            background: "linear-gradient(90deg, hsl(160 84% 39%), hsl(210 100% 55%))",
          }}
        />
      </div>
    </nav>
  );
};

export default NavigationBar;
