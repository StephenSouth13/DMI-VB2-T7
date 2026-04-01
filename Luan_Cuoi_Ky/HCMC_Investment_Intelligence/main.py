from engine import get_full_sector_data
from analytics import perform_pro_analysis
from visuals import generate_reports
from config import OUTPUT_DIR
import pandas as pd

def orchestrate():
    print("\n" + "="*50)
    print("🔥 HCMC INVESTMENT INTELLIGENCE SYSTEM - V3.0 PRO")
    print("="*50 + "\n")
    
    # Run Pipeline
    data = get_full_sector_data()
    clean_data, final_metrics = perform_pro_analysis(data)
    generate_reports(clean_data, final_metrics)
    
    # Export Data real 100%
    final_metrics.to_csv(f"{OUTPUT_DIR}/strategic_ranking.csv", index=False)
    clean_data.to_csv(f"{OUTPUT_DIR}/master_dataset.csv", index=False)
    
    print("\n✅ THÀNH CÔNG!")
    print(f"📍 Kết quả tại: {os.path.abspath(OUTPUT_DIR)}")
    print(f"💎 Ngành Kim Cương: {final_metrics.iloc[0]['Sector']}")
    print(f"📈 Tăng trưởng CAGR cao nhất: {final_metrics['Growth_CAGR'].max():.2%}")

if __name__ == "__main__":
    orchestrate()