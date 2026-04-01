import zipfile
import io
import os
import time
import requests
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

# =========================
# CONFIG & PATHS
# =========================
START_YEAR = 2015
END_YEAR = 2025
FORECAST_YEARS = 3  # Dự báo đến 2028

CACHE_DIR = "cache"
OUTPUT_DIR = "output"
GRDP_PATH = "data/grdp_hcm.csv"
FINAL_OUTPUT = f"{OUTPUT_DIR}/hcmc_macro_analysis.csv"

# Hệ số ước lượng: FDI HCMC chiếm khoảng 28% FDI cả nước (Dựa trên báo cáo GSO)
HCMC_FDI_PROXY_RATIO = 0.28

os.makedirs(CACHE_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# =========================
# 1. GET FDI DATA (WORLD BANK)
# =========================
def get_fdi_data():
    print("📡 Đang kéo dữ liệu FDI từ World Bank...")
    cache_file = f"{CACHE_DIR}/fdi_vn_raw.csv"
    
    if os.path.exists(cache_file):
        print("⚡ Sử dụng dữ liệu FDI từ Cache")
        return pd.read_csv(cache_file)

    url = "http://api.worldbank.org/v2/country/VNM/indicator/BX.KLT.DINV.CD.WD?format=json&per_page=100"
    try:
        r = requests.get(url, timeout=15)
        data = r.json()[1]
        df = pd.DataFrame(data)
        df = df[['date', 'value']].rename(columns={'date': 'year', 'value': 'fdi_vn'})
        df['year'] = pd.to_numeric(df['year'])
        df['fdi_vn'] = pd.to_numeric(df['fdi_vn'])
        
        # Ước lượng FDI cho riêng HCMC
        df['fdi_hcm'] = df['fdi_vn'] * HCMC_FDI_PROXY_RATIO
        
        df = df[(df['year'] >= START_YEAR) & (df['year'] <= END_YEAR)].sort_values('year')
        df.to_csv(cache_file, index=False)
        return df
    except Exception as e:
        print(f"❌ Lỗi lấy FDI: {e}")
        return pd.DataFrame()

# =========================
# 2. FORECASTING ENGINE
# =========================
def predict_future(df, column, steps=3):
    """ Dự báo xu hướng bằng Linear Regression (chuẩn APA) """
    
    X = df['year'].values.reshape(-1, 1)
    y = df[column].values

    model = LinearRegression()
    model.fit(X, y)

    last_year = df['year'].max()

    # Tạo future years
    future_years = np.arange(last_year + 1, last_year + steps + 1).reshape(-1, 1)

    preds = model.predict(future_years)

    result = pd.DataFrame({
        'year': future_years.flatten(),
        f'{column}_forecast': preds
    })

    print("\n🔮 Dự báo tương lai:")
    print(result)

    return result
# =========================
# 3. VISUALIZATION (DUAL AXIS)
# =========================
def plot_macro_trends(df):
    print("📊 Đang vẽ biểu đồ xu hướng đối soát...")
    fig, ax1 = plt.subplots(figsize=(12, 6))

    # Trục 1: GRDP (Bar)
    color = 'tab:blue'
    ax1.set_xlabel('Năm')
    ax1.set_ylabel('GRDP (Tỷ VNĐ)', color=color, fontweight='bold')
    ax1.bar(df['year'], df['grdp'], color=color, alpha=0.3, label='GRDP HCMC')
    ax1.tick_params(axis='y', labelcolor=color)

    # Trục 2: FDI (Line)
    ax2 = ax1.twinx()
    color = 'tab:red'
    ax2.set_ylabel('FDI Ước tính (USD)', color=color, fontweight='bold')
    ax2.plot(df['year'], df['fdi_hcm'], color=color, marker='o', linewidth=2, label='FDI HCMC (Proxy)')
    ax2.tick_params(axis='y', labelcolor=color)

    plt.title('TƯƠNG QUAN DÒNG VỐN FDI VÀ TĂNG TRƯỞNG GRDP TP.HCM', fontsize=14, fontweight='bold')
    fig.tight_layout()
    plt.savefig(f"{OUTPUT_DIR}/macro_trend_chart.png", dpi=300)
    print(f"✅ Đã lưu biểu đồ tại {OUTPUT_DIR}")
    plt.show()

# =========================
# MAIN PIPELINE
# =========================
def run_pipeline():
    print("🚀 KHỞI CHẠY HỆ THỐNG PHÂN TÍCH VĨ MÔ TP.HCM\n")

    # Load dữ liệu
    fdi_df = get_fdi_data()
    if not os.path.exists(GRDP_PATH):
        print(f"❌ Thiếu file {GRDP_PATH}. Hãy tạo file CSV có cột 'year' và 'grdp' nhé Long!")
        return

    grdp_df = pd.read_csv(GRDP_PATH)
    
    # Merge & Clean
    final_df = pd.merge(grdp_df, fdi_df[['year', 'fdi_hcm']], on='year', how='inner')
    
    # Tính toán Correlation
    corr = final_df['grdp'].corr(final_df['fdi_hcm'])
    print(f"\n📈 Chỉ số thực chứng: Hệ số tương quan R = {corr:.4f}")
    
    # Dự báo 3 năm tới cho GRDP
    forecast_df = predict_future(final_df, 'grdp', steps=FORECAST_YEARS)
    
    # Lưu kết quả cho PowerBI
    final_df.to_csv(FINAL_OUTPUT, index=False)
    forecast_df.to_csv(f"{OUTPUT_DIR}/grdp_forecast.csv", index=False)
    
    print(f"💾 Đã xuất dữ liệu sạch cho Dashboard: {FINAL_OUTPUT}")
    
    # Vẽ hình
    plot_macro_trends(final_df)

if __name__ == "__main__":
    run_pipeline()