import requests
import pandas as pd
from config import INDICATORS, HCM_WEIGHTS

def get_full_sector_data():
    print("📡 [ETL] Đang quét dữ liệu đa ngành toàn cầu...")
    dfs = []
    for name, code in INDICATORS.items():
        url = f"http://api.worldbank.org/v2/country/VNM/indicator/{code}?format=json&per_page=100"
        try:
            res = requests.get(url, timeout=10).json()[1]
            temp = pd.DataFrame(res)[['date', 'value']].rename(columns={'date': 'year', 'value': name})
            dfs.append(temp)
        except: continue
    
    from functools import reduce
    df = reduce(lambda l, r: pd.merge(l, r, on='year', how='outer'), dfs)
    df['year'] = pd.to_numeric(df['year'])
    df = df[df['year'] >= 2015].sort_values('year').fillna(method='bfill')

    # Logic "Real HCM": Áp dụng trọng số riêng cho từng ngành
    df['HCM_Tech_Value'] = df['HighTech'] * HCM_WEIGHTS['HighTech']
    df['HCM_Service_Value'] = (df['GDP'] if 'GDP' in df else 1) * (df['Services']/100) * HCM_WEIGHTS['Services']
    return df