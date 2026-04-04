import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, AlertTriangle, Rocket, Flame } from "lucide-react";
import startupImg from "@/assets/startup-ecosystem.jpg";
import logisticsImg from "@/assets/logistics-bottleneck.jpg";
import digitalImg from "@/assets/digital-transformation.jpg";
import climateImg from "@/assets/climate-risks.jpg";
import { useLanguage } from "@/i18n";

const SwotGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  const swotItems = [
    {
      titleKey: "swot.strengths",
      icon: Shield,
      className: "swot-strength",
      itemsKey: "swot.strengthItems",
      color: "text-emerald",
      image: startupImg,
      imageAlt: "HCMC startup co-working space",
    },
    {
      titleKey: "swot.weaknesses",
      icon: AlertTriangle,
      className: "swot-weakness",
      itemsKey: "swot.weaknessItems",
      color: "text-destructive",
      image: logisticsImg,
      imageAlt: "HCMC port logistics congestion",
    },
    {
      titleKey: "swot.opportunities",
      icon: Rocket,
      className: "swot-opportunity",
      itemsKey: "swot.opportunityItems",
      color: "text-electric",
      image: digitalImg,
      imageAlt: "Digital transformation smart city HCMC",
    },
    {
      titleKey: "swot.threats",
      icon: Flame,
      className: "swot-threat",
      itemsKey: "swot.threatItems",
      color: "text-yellow-400",
      image: climateImg,
      imageAlt: "Urban flooding in Ho Chi Minh City",
    },
  ];

  return (
    <section className="px-4 py-20 max-w-6xl mx-auto" ref={ref}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center text-foreground">{t("swot.title")}</h2>
        <p className="text-muted-foreground text-center mb-10">{t("swot.subtitle")}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {swotItems.map((item, i) => {
            const items: string[] = t(item.itemsKey);
            return (
              <motion.div key={item.titleKey} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1, duration: 0.5 }} className={`glass-card overflow-hidden ${item.className}`}>
                <div className="relative h-36 md:h-44 overflow-hidden">
                  <img src={item.image} alt={item.imageAlt} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                    <h3 className="text-xl font-bold text-foreground">{t(item.titleKey)}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <ul className="space-y-3">
                    {items.map((text: string, j: number) => (
                      <li key={j} className="flex items-start gap-2 text-muted-foreground text-sm">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${item.color} bg-current flex-shrink-0`} />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default SwotGrid;
