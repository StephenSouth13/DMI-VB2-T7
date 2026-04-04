import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import economicZoneImg from "@/assets/hcmc-economic-zone.jpg";
import { useLanguage } from "@/i18n";

const data = [
  { year: "2016", HighTech: 8, FDI: 15, Manufacturing: 30, Services: 28, Trade: 19 },
  { year: "2017", HighTech: 10, FDI: 16, Manufacturing: 29, Services: 27, Trade: 18 },
  { year: "2018", HighTech: 13, FDI: 18, Manufacturing: 27, Services: 25, Trade: 17 },
  { year: "2019", HighTech: 16, FDI: 20, Manufacturing: 26, Services: 23, Trade: 15 },
  { year: "2020", HighTech: 15, FDI: 17, Manufacturing: 28, Services: 25, Trade: 15 },
  { year: "2021", HighTech: 19, FDI: 21, Manufacturing: 25, Services: 22, Trade: 13 },
  { year: "2022", HighTech: 23, FDI: 23, Manufacturing: 23, Services: 20, Trade: 11 },
  { year: "2023", HighTech: 27, FDI: 25, Manufacturing: 21, Services: 18, Trade: 9 },
  { year: "2024", HighTech: 32, FDI: 27, Manufacturing: 19, Services: 14, Trade: 8 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-4">
        <p className="text-foreground font-semibold mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm" style={{ color: p.color }}>{p.name}: {p.value}%</p>
        ))}
      </div>
    );
  }
  return null;
};

const StructuralShiftChart = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section className="px-4 py-20 max-w-6xl mx-auto" ref={ref}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center text-foreground">{t("structural.title")}</h2>
        <p className="text-muted-foreground text-center mb-10">
          {t("structural.subtitle1")} <span className="gradient-text-emerald font-semibold">{t("structural.subtitleHighlight")}</span>
        </p>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.2, duration: 0.6 }} className="relative overflow-hidden rounded-2xl mb-8">
          <img src={economicZoneImg} alt="HCMC economic zone aerial view" loading="lazy" className="w-full h-48 md:h-64 object-cover" width={1920} height={800} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <p className="text-foreground font-bold text-lg">{t("structural.imageTitle")}</p>
            <p className="text-muted-foreground text-sm">{t("structural.imageSubtitle")}</p>
          </div>
        </motion.div>

        <div className="glass-card p-6 md:p-8">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 16%)" />
              <XAxis dataKey="year" tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} axisLine={{ stroke: "hsl(220 15% 16%)" }} />
              <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} axisLine={{ stroke: "hsl(220 15% 16%)" }} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: "hsl(215 20% 55%)", fontSize: 12 }} />
              <Area type="monotone" dataKey="HighTech" stackId="1" stroke="hsl(160 84% 39%)" fill="hsl(160 84% 39%)" fillOpacity={0.6} />
              <Area type="monotone" dataKey="FDI" stackId="1" stroke="hsl(210 100% 55%)" fill="hsl(210 100% 55%)" fillOpacity={0.5} />
              <Area type="monotone" dataKey="Manufacturing" stackId="1" stroke="hsl(280 70% 55%)" fill="hsl(280 70% 55%)" fillOpacity={0.4} />
              <Area type="monotone" dataKey="Services" stackId="1" stroke="hsl(45 100% 50%)" fill="hsl(45 100% 50%)" fillOpacity={0.3} />
              <Area type="monotone" dataKey="Trade" stackId="1" stroke="hsl(0 70% 55%)" fill="hsl(0 70% 55%)" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </section>
  );
};

export default StructuralShiftChart;
