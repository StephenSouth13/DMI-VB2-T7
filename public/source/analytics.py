# analytics.py
import statsmodels.api as sm
import pandas as pd
import numpy as np

def perform_pro_analysis(df):
    print("🧠 [Analysis] Đang chạy mô hình Kinh tế lượng & chuẩn hóa Score...")
    
    # 1. Tạo biến trễ (Time-Lag) chuẩn xác
    # FDI năm trước (t-1) giải thích cho sự tăng trưởng năm nay (t)
    df['FDI_Lag1'] = df['FDI'].shift(1)
    df_clean = df.dropna().copy()

    raw_results = []
    # Lọc các ngành thực tế (bỏ các cột kỹ thuật và năm)
    sectors = [c for c in df_clean.columns if c not in ['year', 'FDI', 'FDI_Lag1', 'Trade'] and 'HCM_' in c]
    
    for s in sectors:
        # Mô hình OLS: y = beta0 + beta1*FDI_Lag1 + beta2*Trade
        X = sm.add_constant(df_clean[['FDI_Lag1', 'Trade']])
        y = df_clean[s]
        model = sm.OLS(y, X).fit()
        
        # A. Tốc độ tăng trưởng kép (CAGR)
        start_val = y.iloc[0]
        end_val = y.iloc[-1]
        n_periods = len(y) - 1
        cagr = (end_val / start_val)**(1/n_periods) - 1 if start_val > 0 else 0
        
        # B. Độ biến động (Volatility - Rủi ro hệ thống)
        volatility = y.pct_change().std()
        
        # C. Hệ số Beta (Độ nhạy với FDI)
        fdi_beta = model.params['FDI_Lag1']
        
        raw_results.append({
            'Sector': s,
            'R2': model.rsquared,
            'P_Value': model.pvalues['FDI_Lag1'],
            'Beta': fdi_beta,
            'CAGR': cagr,
            'Volatility': volatility
        })
    
    results_df = pd.DataFrame(raw_results)

    # 2. CHUẨN HÓA DỮ LIỆU (NORMALIZATION) 
    # Đưa về thang điểm 0-1 để tính Score công bằng
    def min_max_scale(series):
        if series.max() == series.min(): return series * 0
        return (series - series.min()) / (series.max() - series.min())

    results_df['Score_Growth'] = min_max_scale(results_df['CAGR'])
    results_df['Score_Confidence'] = min_max_scale(results_df['R2'])
    results_df['Score_Stability'] = 1 - min_max_scale(results_df['Volatility']) # Rủi ro càng thấp điểm càng cao

    # 3. TÍNH INVESTMENT SCORE (TRỌNG SỐ CHIẾN LƯỢC)
    # Trọng số: 40% Tăng trưởng, 40% Tin cậy (R2), 20% Ổn định (Risk)
    results_df['Investment_Score'] = (
        results_df['Score_Growth'] * 0.4 + 
        results_df['Score_Confidence'] * 0.4 + 
        results_df['Score_Stability'] * 0.2
    )

    return df_clean, results_df.sort_values(by='Investment_Score', ascending=False)