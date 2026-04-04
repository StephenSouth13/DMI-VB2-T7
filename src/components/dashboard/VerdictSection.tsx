import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Download, ArrowRight, FileText, Database, BarChart3, Image, Code2, Terminal, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import riverNightImg from "@/assets/hcmc-river-night.jpg";
import { useLanguage } from "@/i18n";

type PreviewType = "pdf" | "csv" | "image" | "code" | null;

interface PreviewState {
  type: PreviewType;
  href: string;
  label: string;
}

const chartImages = [
  { label: "Correlation Matrix", href: "/data/1_correlation_matrix.png" },
  { label: "Opportunity Matrix", href: "/data/2_opportunity_matrix.png" },
  { label: "Capital Allocation", href: "/data/3_investment_donut_chart.png" },
  { label: "Structural Shift", href: "/data/4_structural_shift_area.png" },
  { label: "Radar Comparison", href: "/data/5_radar_comparison.png" },
];

const pythonFiles = [
  { label: "main.py", desc: "Orchestrator" },
  { label: "engine.py", desc: "ETL & World Bank API" },
  { label: "analytics.py", desc: "OLS & Score" },
  { label: "visuals.py", desc: "Charts Generation" },
  { label: "config.py", desc: "Indicators Config" },
  { label: "generate_final_report.py", desc: "PDF Builder" },
];

const CsvPreview = ({ href }: { href: string }) => {
  const [data, setData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(href).then((r) => r.text()).then((text) => {
      const rows = text.split("\n").filter(Boolean).map((row) => row.split(","));
      setData(rows.slice(0, 50));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [href]);

  if (loading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;

  return (
    <div className="overflow-auto max-h-[70vh] rounded-xl">
      <table className="w-full text-xs font-mono">
        <thead className="sticky top-0 z-10">
          <tr className="bg-muted/80 backdrop-blur-sm">
            {data[0]?.map((h, i) => (<th key={i} className="px-3 py-2.5 text-left font-bold text-foreground whitespace-nowrap border-b border-border/50">{h}</th>))}
          </tr>
        </thead>
        <tbody>
          {data.slice(1).map((row, ri) => (
            <tr key={ri} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
              {row.map((cell, ci) => (<td key={ci} className="px-3 py-2 text-muted-foreground whitespace-nowrap">{cell}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CodePreview = ({ href }: { href: string }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(href).then((r) => r.text()).then((text) => { setCode(text); setLoading(false); }).catch(() => setLoading(false));
  }, [href]);

  if (loading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;

  return (
    <div className="overflow-auto max-h-[70vh] rounded-xl bg-[hsl(var(--background))] p-4">
      <pre className="text-xs font-mono text-muted-foreground leading-relaxed whitespace-pre-wrap">{code}</pre>
    </div>
  );
};

const ImageGalleryPreview = ({ images, startIndex }: { images: typeof chartImages; startIndex: number }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full flex items-center justify-center">
        <button onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)} className="absolute left-0 z-10 p-2 rounded-full bg-muted/80 backdrop-blur-sm text-foreground hover:bg-muted transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <img src={images[currentIndex].href} alt={images[currentIndex].label} className="max-h-[65vh] max-w-full rounded-xl object-contain" />
        <button onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)} className="absolute right-0 z-10 p-2 rounded-full bg-muted/80 backdrop-blur-sm text-foreground hover:bg-muted transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold text-foreground">{images[currentIndex].label}</p>
        <span className="text-xs text-muted-foreground">({currentIndex + 1}/{images.length})</span>
      </div>
      <div className="flex gap-1.5">
        {images.map((_, i) => (<button key={i} onClick={() => setCurrentIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? "bg-emerald w-4" : "bg-muted-foreground/30"}`} />))}
      </div>
      <a href={images[currentIndex].href} download className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 text-foreground text-xs font-medium hover:bg-muted transition-colors">
        <Download className="w-3.5 h-3.5" />
        Download {images[currentIndex].label}
      </a>
    </div>
  );
};

const VerdictSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [imageGalleryIndex, setImageGalleryIndex] = useState(0);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const { t } = useLanguage();

  const downloadFiles = [
    { icon: Database, label: "Master Dataset", description: "8 sectors × 10 years (2015–2024)", href: "/data/master_dataset.csv", size: "CSV", color: "text-emerald", borderColor: "border-emerald/30", bgColor: "bg-emerald/10", previewType: "csv" as PreviewType },
    { icon: BarChart3, label: "Strategic Ranking", description: "R², CAGR, Score", href: "/data/strategic_ranking.csv", size: "CSV", color: "text-electric", borderColor: "border-electric/30", bgColor: "bg-electric/10", previewType: "csv" as PreviewType },
    { icon: Database, label: "Raw Data Cache", description: "World Bank & HCMC Proxies", href: "/data/raw_data_cache.csv", size: "CSV", color: "text-yellow-400", borderColor: "border-yellow-400/30", bgColor: "bg-yellow-400/10", previewType: "csv" as PreviewType },
  ];

  const openPreview = (type: PreviewType, href: string, label: string) => {
    setPreview({ type, href, label });
  };

  return (
    <section className="px-4 py-20 max-w-5xl mx-auto text-center" ref={ref}>
      <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 gap-0 bg-background border-border/50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/30 bg-muted/30">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-emerald" />
              <span className="font-semibold text-sm text-foreground">{preview?.label}</span>
            </div>
            <a href={preview?.href} download className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald/10 text-emerald text-xs font-bold hover:bg-emerald/20 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Download
            </a>
          </div>
          <div className="p-4 overflow-auto">
            {preview?.type === "pdf" && (
              <object data={preview.href} type="application/pdf" className="w-full h-[75vh] rounded-xl border border-border/20">
                <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
                  <p className="text-sm">PDF preview not supported in this browser.</p>
                  <a href={preview.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald/10 text-emerald text-sm font-bold hover:bg-emerald/20 transition-colors">
                    <Eye className="w-4 h-4" />
                    Open in new tab
                  </a>
                </div>
              </object>
            )}
            {preview?.type === "csv" && <CsvPreview href={preview.href} />}
            {preview?.type === "code" && <CodePreview href={preview.href} />}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showImageGallery} onOpenChange={setShowImageGallery}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 gap-0 bg-background border-border/50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/30 bg-muted/30">
            <div className="flex items-center gap-3">
              <Image className="w-4 h-4 text-electric" />
              <span className="font-semibold text-sm text-foreground">{t("verdict.chartImages")}</span>
            </div>
          </div>
          <div className="p-6">
            <ImageGalleryPreview images={chartImages} startIndex={imageGalleryIndex} />
          </div>
        </DialogContent>
      </Dialog>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
        <div className="glass-card glow-emerald relative overflow-hidden mb-12">
          <div className="absolute inset-0">
            <img src={riverNightImg} alt="Ho Chi Minh City Saigon River at night" loading="lazy" className="w-full h-full object-cover" width={1920} height={800} />
            <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald/10 to-electric/10" />
          </div>
          <div className="relative z-10 p-10 md:p-16">
            <p className="text-muted-foreground tracking-[0.2em] uppercase text-sm mb-6">{t("verdict.label")}</p>
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
              <span className="text-foreground">{t("verdict.title1")}</span>{" "}
              <span className="gradient-text-emerald">{t("verdict.titleHighlight")}</span>{" "}
              <span className="text-foreground">{t("verdict.title2")}</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("verdict.description")}</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            <span className="gradient-text-mixed">{t("verdict.downloadTitle")}</span> {t("verdict.downloadHighlight")}
          </h3>
          <p className="text-muted-foreground mb-8 text-sm">{t("verdict.downloadSubtitle")}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <button onClick={() => openPreview("pdf", "/HCMC_Investment_Strategic_Report_2026.pdf", "Full PDF Report")} className="btn-download inline-flex glow-emerald">
              <Eye className="w-5 h-5" />
              {t("verdict.previewPdf")}
              <ArrowRight className="w-5 h-5" />
            </button>
            <a href="/HCMC_Investment_Strategic_Report_2026.pdf" download className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-muted/50 text-foreground text-sm font-bold hover:bg-muted transition-colors border border-border/30">
              <Download className="w-4 h-4" />
              {t("verdict.downloadPdf")}
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {downloadFiles.map((file, i) => (
              <motion.div key={file.label} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 + i * 0.08 }} className={`glass-card-hover p-5 text-left flex items-start gap-4 group border-l-2 ${file.borderColor} cursor-pointer`} onClick={() => openPreview(file.previewType, file.href, file.label)}>
                <div className={`p-2.5 rounded-xl ${file.bgColor} flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                  <file.icon className={`w-5 h-5 ${file.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-foreground text-sm">{file.label}</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${file.bgColor} ${file.color}`}>{file.size}</span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{file.description}</p>
                </div>
                <Eye className="w-4 h-4 text-muted-foreground group-hover:text-emerald transition-colors flex-shrink-0 mt-1" />
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.65 }} className="glass-card p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Image className="w-4 h-4 text-electric" />
              <span className="text-sm font-semibold text-foreground">{t("verdict.chartImages")}</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {chartImages.map((img, i) => (
                <button key={img.label} onClick={() => { setImageGalleryIndex(i); setShowImageGallery(true); }} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted/50 text-muted-foreground text-xs font-medium hover:bg-muted hover:text-foreground transition-colors">
                  <Eye className="w-3 h-3" />
                  {img.label}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8 }} className="glass-card p-5 border-l-2 border-purple-500/30">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Terminal className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-left">
                <span className="text-sm font-semibold text-foreground block">{t("verdict.pythonSource")}</span>
                <span className="text-[10px] text-muted-foreground">HCMC Intelligence System V3.0 PRO — <code className="font-mono text-purple-400">python main.py</code></span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {pythonFiles.map((f) => (
                <button key={f.label} onClick={() => openPreview("code", `/source/${f.label}`, f.label)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors group text-left">
                  <Code2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-mono font-semibold text-foreground truncate">{f.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{f.desc}</p>
                  </div>
                  <Eye className="w-3 h-3 text-muted-foreground group-hover:text-purple-400 transition-colors ml-auto flex-shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <p className="text-muted-foreground/50 text-xs mt-10">{t("verdict.footer")}</p>
      </motion.div>
    </section>
  );
};

export default VerdictSection;
