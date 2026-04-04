# main.py
from engine import get_full_sector_data
from analytics import perform_pro_analysis
from visuals import generate_reports
from config import OUTPUT_DIR
import os
import pandas as pd

def orchestrate():
    print("\n" + "="*60)
    print("🔥 HCMC INVESTMENT INTELLIGENCE SYSTEM - V3.0 PRO")
    print("="*60 + "\n")
    
    # 1. Thu thập dữ liệu
    data = get_full_sector_data()
    
    if data.empty:
        print("\n❌ LỖI: Không có dữ liệu để phân tích. Kiểm tra lại kết nối mạng!")
        return

    # 2. Phân tích
    print("\n📊 [Analysis] Bắt đầu xử lý toán học...")
    clean_data, final_metrics = perform_pro_analysis(data)
    
    if final_metrics.empty:
        print("❌ LỖI: Quá trình phân tích không tạo ra kết quả.")
        return

    # 3. Trực quan hóa
    generate_reports(clean_data, final_metrics)
    
    # 4. Xuất file
    final_metrics.to_csv(f"{OUTPUT_DIR}/strategic_ranking.csv", index=False)
    clean_data.to_csv(f"{OUTPUT_DIR}/master_dataset.csv", index=False)
    
    print("\n" + "🚀 HỆ THỐNG HOÀN TẤT ".center(60, "="))
    print(f"📍 Kết quả lưu tại: {os.path.abspath(OUTPUT_DIR)}")
    print(f"💎 Ngành dẫn dắt đầu tư: {final_metrics.iloc[0]['Sector']}")
    print("="*60)

if __name__ == "__main__":
    orchestrate()