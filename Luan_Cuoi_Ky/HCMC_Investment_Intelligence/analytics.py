import statsmodels.api as sm
import pandas as pd
import numpy as np

def perform_pro_analysis(df):
    print("🧠 [Analysis] Đang chạy mô hình Lagged-OLS & Risk Scoring...")
    
    # 1. Time-Lag: FDI năm trước kéo kinh tế năm nay
    df['FDI_Lag1'] = df['FDI'].shift(1)
    df_clean = df.dropna()

    results = []
    # Phân tích nhân quả cho tất cả các ngành đã lấy
    sectors = [c for c in df_clean.columns if c not in ['year', 'FDI', 'FDI_Lag1']]
    
    for s in sectors:
        X = sm.add_constant(df_clean[['FDI_Lag1', 'Trade']])
        y = df_clean[s]
        model = sm.OLS(y, X).fit()
        
        # CAGR & Volatility (Risk)
        cagr = (y.iloc[-1] / y.iloc[0])**(1/(len(y)-1)) - 1
        volatility = y.pct_change().std()
        
        results.append({
            'Sector': s,
            'Confidence_R2': model.rsquared,
            'P_Value': model.pvalues['FDI_Lag1'],
            'Growth_CAGR': cagr,
            'Risk_Volatility': volatility,
            'Investment_Score': (model.rsquared * 0.4 + cagr * 0.4 + (1-volatility) * 0.2)
        })
    
    return df_clean, pd.DataFrame(results).sort_values(by='Investment_Score', ascending=False)