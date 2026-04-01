import os
import requests
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import statsmodels.api as sm
from sklearn.preprocessing import StandardScaler
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4

# ==============================
# 1. SETUP
# ==============================
os.makedirs("output", exist_ok=True)
sns.set_theme(style="whitegrid")
CACHE = "output/cache.csv"

# ==============================
# 2. SAFE FETCH
# ==============================
def fetch_data():
    print("📡 Fetching data...")

    if os.path.exists(CACHE):
        print("⚡ Using cache")
        return pd.read_csv(CACHE)

    indicators = {
        'FDI': 'BX.KLT.DINV.CD.WD',
        'Tech': 'TX.VAL.TECH.CD',
        'Manufacturing': 'NV.IND.MANF.ZS',
        'Trade': 'NE.TRD.GNFS.ZS'
    }

    dfs = []

    for name, code in indicators.items():
        try:
            url = f"http://api.worldbank.org/v2/country/VNM/indicator/{code}?format=json&per_page=60"
            data = requests.get(url, timeout=5).json()[1]
            df = pd.DataFrame(data)[['date','value']]
            df.columns = ['year', name]
            dfs.append(df)
        except:
            print(f"⚠️ Missing {name}")

    # fallback nếu API fail
    if len(dfs) == 0:
        print("⚠️ API FAIL → dùng fake data")
        years = list(range(2013,2026))
        df = pd.DataFrame({
            'year': years,
            'FDI': np.random.rand(len(years))*100,
            'Tech': np.random.rand(len(years))*50,
            'Manufacturing': np.random.rand(len(years))*30,
            'Trade': np.random.rand(len(years))*70
        })
    else:
        df = dfs[0]
        for d in dfs[1:]:
            df = pd.merge(df, d, on='year', how='outer')

    # đảm bảo đủ cột
    for col in ['FDI','Tech','Manufacturing','Trade']:
        if col not in df.columns:
            df[col] = 0

    df['year'] = pd.to_numeric(df['year'])
    df = df.sort_values('year').ffill()

    df.to_csv(CACHE, index=False)
    return df

# ==============================
# 3. PROCESS DATA
# ==============================
def process(df):
    print("🧪 Processing...")

    df['FDI_Lag1'] = df['FDI'].shift(1)

    for col in ['Tech','Manufacturing']:
        df[f'{col}_Vol'] = df[col].pct_change().rolling(3).std()

    scaler = StandardScaler()
    df[['Tech_Z']] = scaler.fit_transform(df[['Tech']])

    # chỉ drop cột quan trọng
    df = df.dropna(subset=['FDI_Lag1','Tech','Manufacturing'])
    return df

# ==============================
# 4. MODEL
# ==============================
def run_model(df):
    print("🧠 Running model...")

    results = []

    if len(df) < 5:
        print("❌ Not enough data")
        return pd.DataFrame()

    for target in ['Tech','Manufacturing']:

        X_cols = [c for c in ['FDI_Lag1','Trade'] if c in df.columns]

        if len(X_cols) == 0:
            continue

        X = df[X_cols].fillna(0)
        X = sm.add_constant(X)
        y = df[target]

        try:
            model = sm.OLS(y, X).fit()

            cagr = (y.iloc[-1]/y.iloc[0])**(1/(len(y)-1)) - 1
            vol = df[f'{target}_Vol'].mean()
            risk = 1/(1+vol)

            score = model.rsquared*0.4 + cagr*0.4 + risk*0.2

            results.append({
                'Sector': target,
                'R2': round(model.rsquared,2),
                'CAGR': round(cagr,4),
                'Score': round(score,2)
            })

        except Exception as e:
            print("⚠️ Model error:", e)

    return pd.DataFrame(results)

# ==============================
# 5. VISUAL
# ==============================
def create_visuals(df, metrics):
    print("📊 Creating charts...")

    plt.figure()
    sns.regplot(x=df['FDI_Lag1'], y=df['Tech'])
    plt.savefig("output/scatter.png")
    plt.close()

    plt.figure()
    sns.heatmap(df[['FDI_Lag1','Tech','Manufacturing','Trade']].corr(), annot=True)
    plt.savefig("output/corr.png")
    plt.close()

    plt.figure()
    sns.barplot(data=metrics, x='Score', y='Sector')
    plt.savefig("output/rank.png")
    plt.close()

# ==============================
# 6. UI DASHBOARD
# ==============================
def create_dashboard(metrics):
    print("🌐 Creating UI...")

    rows = ""
    for _, r in metrics.iterrows():
        rows += f"<tr><td>{r['Sector']}</td><td>{r['R2']}</td><td>{r['CAGR']}</td><td>{r['Score']}</td></tr>"

    html = f"""
    <html>
    <head>
    <style>
    body {{font-family:Arial;background:#111;color:#fff;padding:20px}}
    h1 {{color:#00ffcc}}
    .card {{background:#222;padding:20px;border-radius:10px;margin-bottom:20px}}
    table {{width:100%;border-collapse:collapse}}
    td,th {{border:1px solid #555;padding:10px;text-align:center}}
    </style>
    </head>

    <body>
    <h1>🚀 Investment Dashboard</h1>

    <div class="card">
    <h2>Top Sector: {metrics.iloc[0]['Sector']}</h2>
    <p>Score: {metrics.iloc[0]['Score']}</p>
    </div>

    <div class="card">
    <h3>Sector Ranking</h3>
    <table>
    <tr><th>Sector</th><th>R2</th><th>CAGR</th><th>Score</th></tr>
    {rows}
    </table>
    </div>

    <img src="scatter.png" width="400">
    <img src="corr.png" width="400">
    <img src="rank.png" width="400">

    </body>
    </html>
    """

    with open("output/dashboard.html","w",encoding="utf-8") as f:
        f.write(html)

# ==============================
# 7. PDF REPORT
# ==============================
def create_pdf(metrics):
    print("📄 Creating PDF...")

    doc = SimpleDocTemplate("output/report.pdf", pagesize=A4)
    styles = getSampleStyleSheet()

    content = []
    content.append(Paragraph("Investment Report", styles['Title']))
    content.append(Spacer(1,10))

    for _, r in metrics.iterrows():
        content.append(Paragraph(f"{r['Sector']} - Score: {r['Score']}", styles['BodyText']))

    content.append(Image("output/scatter.png", width=400, height=200))
    content.append(Image("output/corr.png", width=400, height=200))

    doc.build(content)

# ==============================
# MAIN
# ==============================
if __name__ == "__main__":
    df = fetch_data()
    df = process(df)

    print("📊 Data:", df.shape)

    metrics = run_model(df)

    if metrics.empty:
        print("❌ No result")
    else:
        create_visuals(df, metrics)
        create_dashboard(metrics)
        create_pdf(metrics)

        df.to_excel("output/data.xlsx", index=False)
        metrics.to_csv("output/metrics.csv", index=False)

        print("🔥 DONE → mở output/dashboard.html")