import matplotlib.pyplot as plt
import seaborn as sns
from config import OUTPUT_DIR

def generate_reports(df, metrics):
    print("📊 [Visuals] Đang xuất báo cáo chiến lược...")
    
    # 1. Ma trận tương quan đa ngành
    plt.figure(figsize=(12, 10))
    sns.heatmap(df.corr(), annot=True, cmap='RdYlGn', fmt=".2f")
    plt.title("HCMC Multi-Sector Correlation Matrix", fontsize=15)
    plt.savefig(f"{OUTPUT_DIR}/correlation_matrix.png")
    
    # 2. Phân loại dự án (Bubble Chart: Growth vs Confidence vs Risk)
    plt.figure(figsize=(10, 7))
    plt.scatter(metrics['Growth_CAGR'], metrics['Confidence_R2'], 
                s=metrics['Investment_Score']*1000, alpha=0.5, c=metrics['Investment_Score'], cmap='viridis')
    for i, txt in enumerate(metrics['Sector']):
        plt.annotate(txt, (metrics['Growth_CAGR'].iat[i], metrics['Confidence_R2'].iat[i]))
    plt.xlabel("Growth (CAGR)")
    plt.ylabel("Confidence (R2)")
    plt.title("Investment Opportunity Matrix: Diamonds vs Dead-ends")
    plt.savefig(f"{OUTPUT_DIR}/opportunity_matrix.png")