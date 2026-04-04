import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";
import { TrendingUp, Shield, Target, BarChart3, Globe2, Zap } from "lucide-react";
import heroImg from "@/assets/hcmc-skyline.jpg";
import { useLanguage } from "@/i18n";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-20 overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Ho Chi Minh City skyline at twilight" className="w-full h-full object-cover" width={1920} height={800} />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-electric/5 blur-3xl" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent" />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground tracking-[0.3em] uppercase text-sm mb-6">
          {t("hero.subtitle")}
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4">
          <span className="gradient-text-emerald">{t("hero.title1")}</span>{" "}
          <span className="text-foreground">{t("hero.title2")}</span>
        </motion.h1>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8">
          <span className="text-foreground">{t("hero.title3")}</span>{" "}
          <span className="gradient-text-blue">{t("hero.title4")}</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="gradient-text-mixed text-xl md:text-2xl font-light mb-10">
          {t("hero.year")}
        </motion.p>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 200 }} className="mb-16">
          <div className="badge-buy glow-emerald">
            <TrendingUp className="w-6 h-6" />
            {t("hero.badge")}
          </div>
        </motion.div>

        {/* KPI Cards - 2 rows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-6">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card-hover p-6 text-center">
            <Target className="w-5 h-5 text-emerald mx-auto mb-3" />
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">{t("hero.topSector")}</p>
            <p className="text-2xl font-bold gradient-text-emerald">{t("hero.topSectorValue")}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card-hover p-6 text-center">
            <TrendingUp className="w-5 h-5 text-electric mx-auto mb-3" />
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">{t("hero.targetCagr")}</p>
            <div className="text-2xl font-bold gradient-text-blue">
              <AnimatedCounter end={11.59} suffix="%" decimals={2} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="glass-card-hover p-6 text-center">
            <Shield className="w-5 h-5 text-emerald mx-auto mb-3" />
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">{t("hero.confidence")}</p>
            <div className="text-2xl font-bold gradient-text-emerald">
              <AnimatedCounter end={0.92} decimals={2} />
            </div>
          </motion.div>
        </div>

        {/* New macro KPI row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="glass-card-hover p-6 text-center">
            <BarChart3 className="w-5 h-5 text-electric mx-auto mb-3" />
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">{t("hero.grdp")}</p>
            <p className="text-2xl font-bold gradient-text-blue">{t("hero.grdpValue")}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="glass-card-hover p-6 text-center">
            <Globe2 className="w-5 h-5 text-emerald mx-auto mb-3" />
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">{t("hero.gdpContribution")}</p>
            <p className="text-2xl font-bold gradient-text-emerald">{t("hero.gdpContributionValue")}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="glass-card-hover p-6 text-center">
            <Zap className="w-5 h-5 text-electric mx-auto mb-3" />
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">{t("hero.growthTarget")}</p>
            <p className="text-2xl font-bold gradient-text-blue">{t("hero.growthTargetValue")}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
