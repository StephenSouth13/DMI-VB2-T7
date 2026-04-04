import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Trophy, TrendingUp, TrendingDown, ArrowUpDown, ChevronUp, ChevronDown, Zap } from "lucide-react";
import { useLanguage } from "@/i18n";

const rankingData = [
  { sector: "HCM_HighTech", r2: 0.9159, pValue: 0.00408, beta: 3.8425, cagr: 0.1159, volatility: 0.1130, scoreGrowth: 1.0, scoreConfidence: 0.8477, scoreStability: 0.0, investmentScore: 0.7391 },
  { sector: "HCM_FDI", r2: 0.8704, pValue: 0.00256, beta: 0.2564, cagr: 0.0606, volatility: 0.0598, scoreGrowth: 0.6007, scoreConfidence: 0.7652, scoreStability: 0.4889, investmentScore: 0.6441 },
  { sector: "HCM_Manufacturing", r2: 0.9481, pValue: 0.00362, beta: 0.0, cagr: 0.0162, volatility: 0.0221, scoreGrowth: 0.2803, scoreConfidence: 0.9060, scoreStability: 0.8352, investmentScore: 0.6416 },
  { sector: "HCM_Trade", r2: 1.0, pValue: 0.9776, beta: 0.0, cagr: 0.0226, volatility: 0.0765, scoreGrowth: 0.3266, scoreConfidence: 1.0, scoreStability: 0.3350, investmentScore: 0.5976 },
  { sector: "HCM_Services", r2: 0.7674, pValue: 0.4355, beta: 0.0, cagr: -0.0015, volatility: 0.0141, scoreGrowth: 0.1532, scoreConfidence: 0.5786, scoreStability: 0.9089, investmentScore: 0.4745 },
  { sector: "HCM_Education", r2: 0.9026, pValue: 0.00563, beta: 0.0, cagr: -0.0227, volatility: 0.0397, scoreGrowth: 0.0, scoreConfidence: 0.8237, scoreStability: 0.6733, investmentScore: 0.4641 },
  { sector: "HCM_Energy", r2: 0.4738, pValue: 0.6857, beta: 0.0, cagr: 0.0008, volatility: 0.0042, scoreGrowth: 0.1691, scoreConfidence: 0.0469, scoreStability: 1.0, investmentScore: 0.2864 },
  { sector: "HCM_Healthcare", r2: 0.4480, pValue: 0.1691, beta: 0.0, cagr: -0.0082, volatility: 0.0525, scoreGrowth: 0.1048, scoreConfidence: 0.0, scoreStability: 0.5554, investmentScore: 0.1530 },
];

type SortKey = "investmentScore" | "cagr" | "r2" | "volatility" | "scoreGrowth" | "scoreConfidence" | "scoreStability";

const getRankBadge = (rank: number) => {
  if (rank === 1) return <span className="inline-flex items-center gap-1 text-yellow-400"><Trophy className="w-4 h-4" /> #1</span>;
  if (rank === 2) return <span className="text-muted-foreground font-semibold">#2</span>;
  if (rank === 3) return <span className="text-amber-700 font-semibold">#3</span>;
  return <span className="text-muted-foreground">#{rank}</span>;
};

const ScoreBar = ({ value, max = 1, color }: { value: number; max?: number; color: string }) => (
  <div className="flex items-center gap-2">
    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / max) * 100}%` }} />
    </div>
    <span className="text-xs font-mono w-10 text-right">{(value * 100).toFixed(1)}</span>
  </div>
);

const RankingTable = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [sortKey, setSortKey] = useState<SortKey>("investmentScore");
  const [sortAsc, setSortAsc] = useState(false);
  const { t } = useLanguage();

  const sorted = [...rankingData].sort((a, b) => sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const SortHeader = ({ label, field, className = "" }: { label: string; field: SortKey; className?: string }) => (
    <th className={`px-3 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none ${className}`} onClick={() => handleSort(field)}>
      <div className="flex items-center gap-1 justify-end">
        {label}
        {sortKey === field ? (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
      </div>
    </th>
  );

  return (
    <section className="px-4 py-20 max-w-6xl mx-auto" ref={ref} id="ranking">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center text-foreground">
          {t("ranking.title1")} <span className="gradient-text-mixed">{t("ranking.title2")}</span>
        </h2>
        <p className="text-muted-foreground text-center mb-4">{t("ranking.subtitle")}</p>

        {/* FDI context banner */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald/10 border border-emerald/20">
            <Zap className="w-4 h-4 text-emerald" />
            <span className="text-xs font-semibold text-emerald">{t("ranking.fdiContext")}</span>
          </div>
        </motion.div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider w-8">#</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">{t("ranking.sector")}</th>
                  <SortHeader label="CAGR" field="cagr" />
                  <SortHeader label="R²" field="r2" />
                  <SortHeader label="Vol." field="volatility" />
                  <SortHeader label={t("ranking.growth")} field="scoreGrowth" className="hidden md:table-cell" />
                  <SortHeader label={t("ranking.conf")} field="scoreConfidence" className="hidden md:table-cell" />
                  <SortHeader label={t("ranking.stab")} field="scoreStability" className="hidden md:table-cell" />
                  <SortHeader label={t("ranking.score")} field="investmentScore" />
                </tr>
              </thead>
              <tbody>
                {sorted.map((row, i) => {
                  const rank = rankingData.findIndex(r => r.sector === row.sector) + 1;
                  const isTop3 = rank <= 3;
                  return (
                    <motion.tr key={row.sector} initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.1 + i * 0.05 }} className={`border-b border-border/30 transition-colors hover:bg-muted/30 ${isTop3 ? "bg-emerald/5" : ""}`}>
                      <td className="px-4 py-3 text-sm">{getRankBadge(rank)}</td>
                      <td className="px-3 py-3"><span className={`text-sm font-semibold ${isTop3 ? "text-foreground" : "text-muted-foreground"}`}>{row.sector.replace("HCM_", "")}</span></td>
                      <td className="px-3 py-3 text-right">
                        <span className={`inline-flex items-center gap-1 text-sm font-mono ${row.cagr >= 0 ? "text-emerald" : "text-destructive"}`}>
                          {row.cagr >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {(row.cagr * 100).toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right"><span className={`text-sm font-mono ${row.r2 >= 0.9 ? "text-electric" : row.r2 >= 0.7 ? "text-muted-foreground" : "text-muted-foreground/60"}`}>{row.r2.toFixed(3)}</span></td>
                      <td className="px-3 py-3 text-right"><span className="text-sm font-mono text-muted-foreground">{(row.volatility * 100).toFixed(2)}%</span></td>
                      <td className="px-3 py-3 hidden md:table-cell"><ScoreBar value={row.scoreGrowth} color="bg-emerald" /></td>
                      <td className="px-3 py-3 hidden md:table-cell"><ScoreBar value={row.scoreConfidence} color="bg-electric" /></td>
                      <td className="px-3 py-3 hidden md:table-cell"><ScoreBar value={row.scoreStability} color="bg-yellow-400" /></td>
                      <td className="px-3 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-12 h-2 bg-muted rounded-full overflow-hidden hidden sm:block">
                            <div className="h-full rounded-full" style={{ width: `${row.investmentScore * 100}%`, background: `linear-gradient(90deg, hsl(160 84% 39%), hsl(210 100% 55%))` }} />
                          </div>
                          <span className={`text-sm font-bold font-mono ${isTop3 ? "gradient-text-emerald" : "text-muted-foreground"}`}>{row.investmentScore.toFixed(3)}</span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border/30 flex flex-wrap gap-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald" /> {t("ranking.growth")} (40%)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-electric" /> {t("ranking.conf")} (40%)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" /> {t("ranking.stab")} (20%)</span>
            <span className="ml-auto font-mono">{t("ranking.legend")}</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default RankingTable;
