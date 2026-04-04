// src/components/dashboard/PPTXViewer.tsx
import { useState, useRef } from "react";
import { Maximize2, FileText, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PPTXViewerProps {
  fileUrl: string;
  title?: string;
}

const PPTXViewer = ({ fileUrl, title = "Báo cáo Chiến lược 2026" }: PPTXViewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  
  // Kiểm tra xem là file PDF hay PPTX
  const isPdf = fileUrl.toLowerCase().endsWith('.pdf');
  
  // Nếu là PPTX thì dùng Microsoft Viewer, nếu PDF thì dùng trực tiếp
  const displayUrl = isPdf 
    ? fileUrl 
    : `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(window.location.origin + fileUrl)}`;

  const handleFullScreen = () => {
    if (viewerRef.current?.requestFullscreen) {
      viewerRef.current.requestFullscreen();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-10 p-6 bg-[#1A1F2C] rounded-2xl border border-gray-800 shadow-2xl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <FileText className="text-blue-400 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">{title}</h3>
            <p className="text-sm text-gray-400">Data-driven Presentation Hub</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.open(fileUrl)} className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <Download className="w-4 h-4 mr-2" /> Tải tài liệu
          </Button>
          <Button onClick={handleFullScreen} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Maximize2 className="w-4 h-4 mr-2" /> Toàn màn hình
          </Button>
        </div>
      </div>

      <div ref={viewerRef} className="relative w-full aspect-video bg-[#05070A] rounded-xl overflow-hidden border border-gray-700">
        <iframe
          src={displayUrl}
          width="100%"
          height="100%"
          className="rounded-xl"
          title="Document Viewer"
        />
        
        {/* Chỉ dẫn nhỏ nếu chạy localhost */}
        {window.location.hostname === 'localhost' && !isPdf && (
          <div className="absolute bottom-4 left-4 right-4 bg-amber-500/10 border border-amber-500/20 p-2 rounded flex items-center gap-2 text-amber-500 text-[10px]">
            <AlertCircle size={14} />
            <span>Lưu ý: Chế độ xem PPTX trực tuyến yêu cầu URL công khai. Hãy dùng file .pdf trong public để chạy offline mượt hơn.</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between text-[10px] uppercase tracking-widest text-gray-500 font-mono italic">
        <span>Strategic Evidence-Based Analysis</span>
        <span>HCMC Intelligence System v3.0 PRO</span>
      </div>
    </div>
  );
};

export default PPTXViewer;