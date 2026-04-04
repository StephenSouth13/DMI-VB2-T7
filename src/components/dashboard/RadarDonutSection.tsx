import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, Legend
} from "recharts";
import { Building2, Store, TrendingUp, Boxes } from "lucide-react";
import hightechImg from "@/assets/hightech-semiconductor.jpg";
import fdiImg from "@/assets/fdi-investment.jpg";
import manufacturingImg from "@/assets/manufacturing.jpg";
import { useLanguage } from "@/i18n";

const radarData = [
  { metric: "CAGR", HighTech: 95, FDI: 55, Manufacturing: 20 },
  { metric: "R²", HighTech: 92, FDI: 87, Manufacturing: 95 },
  { metric: "Score", HighTech: 74, FDI: 64, Manufacturing: 64 },
  { metric: "Stability", HighTech: 40, FDI: 70, Manufacturing: 90 },
];

const donutData = [
  { name: "HighTech", value: 23.9 },
  { name: "FDI", value: 20.8 },
  { name: "Manufacturing", value: 20.7 },
  { name: "Trade", value: 17.8 },
  { name: "Services", value: 16.8 },
];

const COLORS = ["hsl(160, 84%, 39%)", "hsl(210, 100%, 55%)", "hsl(280, 70%, 55%)", "hsl(45, 100%, 50%)", "hsl(0, 70%, 55%)"];

const sectorShowcase = [
  { src: hightechImg, name: "HighTech", pct: "23.9%", color: "border-emerald" },
  { src: fdiImg, name: "FDI", pct: "20.8%", color: "border-electric" },
  { src: manufacturingImg, name: "Manufacturing", pct: "20.7%", color: "border-purple-500" },
];

const CustomDonutTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3">
        <p className="text-foreground font-semibold">{payload[0].name}</p>
        <p className="text-muted-foreground text-sm">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const RadarDonutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  const realEstateCards = [
    { icon: Building2, label: t("radar.officeRent"), value: t("radar.officeRentValue"), color: "text-electric" },
    { icon: Store, label: t("radar.retailRent"), value: t("radar.retailRentValue"), color: "text-emerald" },
    { icon: TrendingUp, label: t("radar.roiLongTerm"), value: t("radar.roiValue"), color: "text-yellow-400" },
    { icon: Boxes, label: t("radar.officeSupply"), value: t("radar.officeSupplyValue"), color: "text-purple-400" },
  ];

  return (
    <section className="px-4 py-20 max-w-6xl mx-auto" ref={ref}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center text-foreground">{t("radar.title")}</h2>
        <p className="text-muted-foreground text-center mb-10">{t("radar.subtitle")}</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {sectorShowcase.map((s, i) => (
            <motion.div key={s.name} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 + i * 0.1 }} className={`relative overflow-hidden rounded-xl border-2 ${s.color} border-opacity-50`}>
              <img src={s.src} alt={s.name} loading="lazy" className="w-full h-28 md:h-36 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
              <div className="absolute bottom-2 left-3">
                <p className="text-foreground font-bold text-sm">{s.name}</p>
                <p className="text-emerald text-xs font-semibold">{s.pct}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t("radar.radarTitle")} <span className="gradient-text-emerald">{t("radar.radarHighlight")}</span>
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(220 15% 16%)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} />
                <PolarRadiusAxis tick={{ fill: "hsl(215 20% 40%)", fontSize: 10 }} domain={[0, 100]} />
                <Radar name="HighTech" dataKey="HighTech" stroke="hsl(160 84% 39%)" fill="hsl(160 84% 39%)" fillOpacity={0.2} strokeWidth={2} />
                <Radar name="FDI" dataKey="FDI" stroke="hsl(210 100% 55%)" fill="hsl(210 100% 55%)" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Manufacturing" dataKey="Manufacturing" stroke="hsl(280 70% 55%)" fill="hsl(280 70% 55%)" fillOpacity={0.1} strokeWidth={2} />
                <Legend wrapperStyle={{ color: "hsl(215 20% 55%)", fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t("radar.donutTitle")} <span className="gradient-text-blue">{t("radar.donutHighlight")}</span>
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={80} outerRadius={130} paddingAngle={3} dataKey="value" stroke="none">
                  {donutData.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                </Pie>
                <Tooltip content={<CustomDonutTooltip />} />
                <Legend formatter={(value: string) => <span style={{ color: "hsl(215, 20%, 55%)", fontSize: 12 }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real Estate Market Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {realEstateCards.map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 + i * 0.1 }} className="glass-card-hover p-4 text-center">
              <card.icon className={`w-5 h-5 ${card.color} mx-auto mb-2`} />
              <p className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1">{card.label}</p>
              <p className={`text-sm font-bold ${card.color}`}>{card.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default RadarDonutSection;
