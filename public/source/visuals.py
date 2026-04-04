# visuals.py
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from config import OUTPUT_DIR

# 1. CẤU HÌNH FONT TIẾNG VIỆT & STYLE TOÀN CỤC
plt.rcParams['font.family'] = 'Arial' 
plt.rcParams['axes.unicode_minus'] = False
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_theme(style="whitegrid")

def generate_reports(df, metrics):
    print("📊 [Visuals] Đang thiết kế Dashboard 'Vũ Trụ' với 5 biểu đồ chiến lược...")

    # ---------------------------------------------------------
    # 1. Heatmap: Ma trận tương quan đa ngành
    # ---------------------------------------------------------
    plt.figure(figsize=(12, 10))
    corr_df = df.select_dtypes(include=[float, int]).drop(columns=['year'], errors='ignore')
    # Lấy các cột liên quan đến HCM để Heatmap tập trung
    hcm_cols = [c for c in corr_df.columns if 'HCM' in c or 'Trade' in c or 'FDI' in c]
    sns.heatmap(corr_df[hcm_cols].corr(), annot=True, cmap='RdYlGn', fmt=".2f", linewidths=0.5)
    plt.title("MA TRẬN TƯƠNG QUAN ĐA NGÀNH (CHỨNG THỰC LAGGED)", fontsize=16, fontweight='bold', pad=20)
    plt.savefig(f"{OUTPUT_DIR}/1_correlation_matrix.png", dpi=300, bbox_inches='tight')
    plt.close()

    # ---------------------------------------------------------
    # 2. Bubble Chart: Ma trận cơ hội (Diamond vs Dead-ends)
    # ---------------------------------------------------------
    plt.figure(figsize=(11, 8))
    scatter = plt.scatter(metrics['CAGR'], metrics['R2'], 
                          s=metrics['Investment_Score']*2000, alpha=0.6, 
                          c=metrics['Investment_Score'], cmap='mako')
    
    for i, txt in enumerate(metrics['Sector']):
        plt.annotate(txt, (metrics['CAGR'].iat[i], metrics['R2'].iat[i]), 
                     fontsize=10, fontweight='bold', xytext=(8, 8), textcoords='offset points')
    
    plt.colorbar(scatter, label='Investment Priority Score')
    plt.axhline(y=0.5, color='r', linestyle='--', alpha=0.3)
    plt.axvline(x=metrics['CAGR'].mean(), color='r', linestyle='--', alpha=0.3)
    plt.xlabel("Tốc độ tăng trưởng kép (CAGR)", fontsize=12)
    plt.ylabel("Độ tin cậy mô hình (R2)", fontsize=12)
    plt.title("MA TRẬN CƠ HỘI ĐẦU TƯ: DIAMONDS VS DEAD-ENDS", fontsize=16, fontweight='bold', pad=20)
    plt.savefig(f"{OUTPUT_DIR}/2_opportunity_matrix.png", dpi=300, bbox_inches='tight')
    plt.close()

    # ---------------------------------------------------------
    # 3. Donut Chart: Phân bổ vốn tối ưu (Modern Style)
    # ---------------------------------------------------------
    plt.figure(figsize=(10, 8))
    top_5 = metrics.head(5)
    colors = sns.color_palette('mako', n_colors=5)
    
    # Vẽ biểu đồ tròn trước
    wedges, texts, autotexts = plt.pie(top_5['Investment_Score'], labels=top_5['Sector'], 
                                       autopct='%1.1f%%', startangle=140, colors=colors, 
                                       pctdistance=0.85, explode=[0.05]*5)
    
    # Vẽ hình tròn trắng ở giữa để tạo hiệu ứng Donut
    centre_circle = plt.Circle((0,0), 0.70, fc='white')
    fig = plt.gcf()
    fig.gca().add_artist(centre_circle)
    
    plt.setp(autotexts, size=10, weight="bold", color="white")
    plt.title("TỶ TRỌNG PHÂN BỔ VỐN KHUYẾN NGHỊ (TOP 5)", fontsize=16, fontweight='bold')
    plt.savefig(f"{OUTPUT_DIR}/3_investment_donut_chart.png", dpi=300, bbox_inches='tight')
    plt.close()

    # ---------------------------------------------------------
    # 4. Area Chart: Sự dịch chuyển cơ cấu kinh tế
    # ---------------------------------------------------------
    plt.figure(figsize=(13, 7))
    area_cols = [c for c in df.columns if 'HCM_' in c]
    if area_cols:
        df_sorted = df.sort_values('year')
        # Normalize dữ liệu về dạng % để thấy sự dịch chuyển cơ cấu
        df_perc = df_sorted.set_index('year')[area_cols]
        df_perc = df_perc.divide(df_perc.sum(axis=1), axis=0) * 100
        
        df_perc.plot.area(ax=plt.gca(), alpha=0.7, colormap='viridis')
        plt.title("SỰ DỊCH CHUYỂN CƠ CẤU KINH TẾ TP.HCM THEO THỜI GIAN (%)", fontsize=16, fontweight='bold')
        plt.ylabel("Tỷ trọng đóng góp (%)")
        plt.legend(loc='center left', bbox_to_anchor=(1, 0.5), title="Ngành")
        plt.tight_layout()
        plt.savefig(f"{OUTPUT_DIR}/4_structural_shift_area.png", dpi=300, bbox_inches='tight')
    plt.close()

    # ---------------------------------------------------------
    # 5. Radar Chart (Spider Chart): So sánh đa chiều (PEAK)
    # ---------------------------------------------------------
    print("🕸️  Đang tạo Radar Chart so sánh đa chiều...")
    labels=np.array(['Tăng trưởng (CAGR)', 'Tin cậy (R2)', 'Ổn định (Risk)', 'Điểm Tổng (Score)'])
    num_vars = len(labels)
    
    # Lấy 3 ngành top đầu để so sánh
    top_3 = metrics.head(3)
    
    angles = np.linspace(0, 2 * np.pi, num_vars, endpoint=False).tolist()
    angles += angles[:1] # Đóng vòng biểu đồ

    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))
    
    colors_radar = ['#1f77b4', '#ff7f0e', '#2ca02c']
    
    for i, (idx, row) in enumerate(top_3.iterrows()):
        # Chuẩn hóa giá trị để đưa lên Radar (0-1)
        # Risk được đảo ngược (1-volatility) để càng xa tâm càng tốt
        stats = [row['CAGR']*5, row['R2'], (1-row['Volatility']), row['Investment_Score']]
        stats += stats[:1]
        ax.plot(angles, stats, color=colors_radar[i], linewidth=2, label=row['Sector'])
        ax.fill(angles, stats, color=colors_radar[i], alpha=0.25)

    ax.set_theta_offset(np.pi / 2)
    ax.set_theta_direction(-1)
    ax.set_thetagrids(np.degrees(angles[:-1]), labels)
    plt.title("SO SÁNH ĐA CHIỀU TOP 3 NGÀNH TIỀM NĂNG", size=16, fontweight='bold', y=1.1)
    plt.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1))
    plt.savefig(f"{OUTPUT_DIR}/5_radar_comparison.png", dpi=300, bbox_inches='tight')
    plt.close()

    print(f"🚀 [COMPLETE] Hệ thống đã xuất bản 5 biểu đồ 'siêu phẩm' vào {OUTPUT_DIR}")