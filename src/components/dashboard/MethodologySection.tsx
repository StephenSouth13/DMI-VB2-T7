import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Database, BarChart3, ShieldCheck, Activity } from "lucide-react";
import { useLanguage } from "@/i18n";

const MethodologySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  const metrics = [
    {
      icon: BarChart3,
      title: t("methodology.cagr"),
      formula: "CAGR = (Vₑ / V₀)^(1/n) − 1",
      description: t("methodology.cagrDesc"),
      color: "text-emerald",
      borderColor: "border-emerald/30",
    },
    {
      icon: ShieldCheck,
      title: t("methodology.r2"),
      formula: "R² = 1 − (SSᵣₑₛ / SSₜₒₜ)",
      description: t("methodology.r2Desc"),
      color: "text-electric",
      borderColor: "border-electric/30",
    },
    {
      icon: Activity,
      title: t("methodology.vol"),
      formula: "σ = √[ Σ(xᵢ − x̄)² / (n−1) ]",
      description: t("methodology.volDesc"),
      color: "text-yellow-400",
      borderColor: "border-yellow-400/30",
    },
  ];

  return (
    <section id="methodology" className="px-4 py-20 max-w-6xl mx-auto" ref={ref}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center text-foreground">
          {t("methodology.title1")} <span className="gradient-text-blue">{t("methodology.title2")}</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12">{t("methodology.subtitle")}</p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="glass-card p-6 md:p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald/10 flex-shrink-0">
              <Database className="w-6 h-6 text-emerald" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">{t("methodology.dataFoundation")}</h3>
              <p className="text-muted-foreground leading-relaxed">{t("methodology.dataDesc")}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metrics.map((m, i) => (
            <motion.div key={m.title} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + i * 0.1 }} className={`glass-card p-6 border-l-2 ${m.borderColor}`}>
              <m.icon className={`w-5 h-5 ${m.color} mb-3`} />
              <h4 className="font-bold text-foreground mb-2">{m.title}</h4>
              <div className="font-mono text-sm bg-muted/50 rounded-lg px-3 py-2 mb-3 text-foreground">{m.formula}</div>
              <p className="text-muted-foreground text-sm leading-relaxed">{m.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 }} className="glass-card p-6 md:p-8 text-center">
          <h3 className="text-lg font-bold text-foreground mb-4">{t("methodology.scoreTitle")}</h3>
          <div className="font-mono text-lg md:text-xl bg-muted/50 rounded-xl px-6 py-4 inline-block">
            <span className="text-emerald">Score</span>{" "}
            <span className="text-muted-foreground">=</span>{" "}
            <span className="text-emerald">40%</span>{" "}
            <span className="text-foreground">Growth</span>{" "}
            <span className="text-muted-foreground">+</span>{" "}
            <span className="text-electric">40%</span>{" "}
            <span className="text-foreground">Confidence</span>{" "}
            <span className="text-muted-foreground">+</span>{" "}
            <span className="text-yellow-400">20%</span>{" "}
            <span className="text-foreground">Stability</span>
          </div>
          <p className="text-muted-foreground text-sm mt-4">{t("methodology.scoreDesc")}</p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default MethodologySection;
