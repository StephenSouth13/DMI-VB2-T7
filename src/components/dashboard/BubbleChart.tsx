import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from "recharts";
import { Building2, Factory, Wheat } from "lucide-react";
import hightechImg from "@/assets/hightech-semiconductor.jpg";
import fdiImg from "@/assets/fdi-investment.jpg";
import manufacturingImg from "@/assets/manufacturing.jpg";
import servicesImg from "@/assets/services-trade.jpg";
import { useLanguage } from "@/i18n";

const data = [
  { name: "HCM_HighTech", cagr: 11.59, r2: 0.92, score: 0.74, z: 800 },
  { name: "HCM_FDI", cagr: 6.1, r2: 0.87, score: 0.64, z: 600 },
  { name: "HCM_Manufacturing", cagr: 1.6, r2: 0.95, score: 0.64, z: 600 },
  { name: "HCM_Trade", cagr: 2.3, r2: 1.0, score: 0.60, z: 500 },
  { name: "HCM_Services", cagr: -0.1, r2: 0.77, score: 0.47, z: 400 },
  { name: "HCM_Education", cagr: -2.3, r2: 0.90, score: 0.46, z: 400 },
  { name: "HCM_Energy", cagr: 0.1, r2: 0.47, score: 0.29, z: 300 },
  { name: "HCM_Healthcare", cagr: -0.8, r2: 0.45, score: 0.15, z: 200 },
];

const sectorImages = [
  { src: hightechImg, label: "HighTech & Semiconductor", alt: "High-tech semiconductor factory in HCMC" },
  { src: fdiImg, label: "Foreign Direct Investment", alt: "FDI business meeting in HCMC" },
  { src: manufacturingImg, label: "Advanced Manufacturing", alt: "Robotic manufacturing in Vietnam" },
  { src: servicesImg, label: "Services & Trade", alt: "Bustling shopping district in HCMC" },
];

const CustomTooltip = ({ active, payload, t }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    const isHighTech = d.name === "HCM_HighTech";
    return (
      <div className="glass-card p-4 min-w-[200px]">
        <p className="font-bold text-foreground mb-1">{d.name}</p>
        {isHighTech && (
          <p className="text-emerald text-xs mb-2 font-medium">⚡ {t("bubble.spearhead")}</p>
        )}
        <p className="text-muted-foreground text-sm">CAGR: <span className="text-foreground">{d.cagr}%</span></p>
        <p className="text-muted-foreground text-sm">R²: <span className="text-foreground">{d.r2}</span></p>
        <p className="text-muted-foreground text-sm">Score: <span className="text-foreground">{d.score}</span></p>
      </div>
    );
  }
  return null;
};

const economicStructure = [
  { key: "services", pct: 65, icon: Building2, color: "text-emerald" },
  { key: "industry", pct: 25, icon: Factory, color: "text-electric" },
  { key: "agriculture", pct: 10, icon: Wheat, color: "text-yellow-400" },
];

const BubbleChart = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section className="px-4 py-20 max-w-6xl mx-auto" ref={ref}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">
          <span className="gradient-text-mixed">{t("bubble.title1")}</span>{" "}
          <span className="text-muted-foreground">{t("bubble.vs")}</span>{" "}
          <span className="text-foreground">{t("bubble.title2")}</span>
        </h2>
        <p className="text-muted-foreground text-center mb-10">{t("bubble.subtitle")}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {sectorImages.map((img, i) => (
            <motion.div key={img.label} initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.2 + i * 0.1 }} className="relative group overflow-hidden rounded-xl">
              <img src={img.src} alt={img.alt} loading="lazy" className="w-full h-32 md:h-40 object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              <p className="absolute bottom-2 left-3 right-3 text-xs font-semibold text-foreground">{img.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="glass-card p-6 md:p-8 mb-8">
          <ResponsiveContainer width="100%" height={450}>
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 16%)" />
              <XAxis type="number" dataKey="cagr" name="CAGR" unit="%" tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} axisLine={{ stroke: "hsl(220 15% 16%)" }} label={{ value: "CAGR (%)", position: "bottom", fill: "hsl(215 20% 55%)", fontSize: 12 }} />
              <YAxis type="number" dataKey="r2" name="R²" tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} axisLine={{ stroke: "hsl(220 15% 16%)" }} label={{ value: "R² Confidence", angle: -90, position: "insideLeft", fill: "hsl(215 20% 55%)", fontSize: 12 }} domain={[0, 1.1]} />
              <ZAxis type="number" dataKey="z" range={[100, 600]} />
              <Tooltip content={<CustomTooltip t={t} />} />
              <Scatter data={data} fill="hsl(160 84% 39%)" fillOpacity={0.7} stroke="hsl(160 84% 50%)" strokeWidth={1} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Economic Structure Cards */}
        <div className="grid grid-cols-3 gap-4">
          {economicStructure.map((item, i) => (
            <motion.div key={item.key} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 + i * 0.1 }} className="glass-card-hover p-5 text-center">
              <item.icon className={`w-6 h-6 ${item.color} mx-auto mb-2`} />
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">{t(`bubble.${item.key}`)}</p>
              <p className={`text-2xl font-bold ${item.color}`}>{item.pct}%</p>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-muted-foreground/60 text-xs mt-3">{t("bubble.economicStructure")} — TP.HCM 2024</p>
      </motion.div>
    </section>
  );
};

export default BubbleChart;
