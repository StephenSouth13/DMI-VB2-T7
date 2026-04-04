//D:\UEH\DMI-VB2-T7\src\components\dashboard\PPTXViewer.tsx
import NavigationBar from "@/components/dashboard/NavigationBar";
import HeroSection from "@/components/dashboard/HeroSection";
import BubbleChart from "@/components/dashboard/BubbleChart";
import RankingTable from "@/components/dashboard/RankingTable";
import RadarDonutSection from "@/components/dashboard/RadarDonutSection";
import StructuralShiftChart from "@/components/dashboard/StructuralShiftChart";
import SwotGrid from "@/components/dashboard/SwotGrid";
import MethodologySection from "@/components/dashboard/MethodologySection";
import VerdictSection from "@/components/dashboard/VerdictSection";
import PPTXViewer from "@/components/dashboard/PPTXViewer";
import { LanguageProvider } from "@/i18n";

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <NavigationBar />
        <div id="summary" className="scroll-mt-16">
          <HeroSection />
        </div>
        <div id="opportunity-matrix" className="scroll-mt-16">
          <BubbleChart />
        </div>
        <div id="ranking" className="scroll-mt-16">
          <RankingTable />
        </div>
        <div id="sector-analytics" className="scroll-mt-16">
          <RadarDonutSection />
        </div>
        <div id="structural-shift" className="scroll-mt-16">
          <StructuralShiftChart />
        </div>
        <div id="swot" className="scroll-mt-16">
          <SwotGrid />
        </div>
        <MethodologySection />
        <div id="presentation" className="scroll-mt-16 py-10 bg-black/20">
          <PPTXViewer 
            fileUrl="/Data-driven-Place-Marketing.pdf" 
            title="HCMC Strategic Investment Prospectus 2026" 
          />
        </div>
        <VerdictSection />

      </div>
    </LanguageProvider>
  );
};

export default Index;
