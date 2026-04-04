# engine.py
import requests
import pandas as pd
import time
import os
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from config import INDICATORS, HCM_WEIGHTS, OUTPUT_DIR
from functools import reduce

def get_full_sector_data():
    print("📡 [ETL] Đang khởi tạo kết nối an toàn với World Bank...")
    CACHE_FILE = f"{OUTPUT_DIR}/raw_data_cache.csv"
    
    # 1. Cấu hình cơ chế Tự động thử lại (Retry)
    session = requests.Session()
    retry_strategy = Retry(
        total=5, # Tăng lên 5 lần cho chắc
        backoff_factor=1, # Đợi 1s, 2s, 4s...
        status_forcelist=[429, 500, 502, 503, 504],
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("https://", adapter)
    session.mount("http://", adapter)

    dfs = []
    headers = {'User-Agent': 'HCMC-Invest-Intelligence-System/3.0'}

    # 2. Vòng lặp thu hoạch dữ liệu
    for name, code in INDICATORS.items():
        url = f"http://api.worldbank.org/v2/country/VNM/indicator/{code}?format=json&per_page=100"
        try:
            print(f"   🔄 Đang truy xuất: {name.ljust(15)}", end=" ", flush=True)
            res = session.get(url, headers=headers, timeout=20).json()
            
            if isinstance(res, list) and len(res) > 1 and res[1] is not None:
                # Lọc bỏ các giá trị None ngay từ đầu để tránh lỗi toán học sau này
                raw_data = res[1]
                valid_data = [item for item in raw_data if item['value'] is not None]
                
                if valid_data:
                    temp = pd.DataFrame(valid_data)[['date', 'value']].rename(columns={'date': 'year', 'value': name})
                    dfs.append(temp)
                    print("✅ [SUCCESS]")
                else:
                    print("⚠️ [EMPTY] - Không có dữ liệu trị số")
            else:
                print("❌ [FORMAT ERROR]")
            
            time.sleep(0.5) # Nghỉ ngắn để không bị WB chặn IP

        except Exception as e:
            print(f"🔥 [TIMEOUT/ERROR]")

    # 3. Cơ chế Fallback (Nếu API sập thì dùng Cache)
    if not dfs:
        if os.path.exists(CACHE_FILE):
            print(f"\n🚨 [OFFLINE MODE] Mạng lỗi. Đang nạp dữ liệu từ Cache: {CACHE_FILE}")
            return pd.read_csv(CACHE_FILE)
        else:
            print("\n🛑 [CRITICAL ERROR] Không có dữ liệu API và cũng không có Cache!")
            return pd.DataFrame()

    # 4. Hợp nhất (Merge) & Làm sạch (Clean)
    print("🧹 [CLEANING] Đang đồng bộ hóa và xử lý nội suy dữ liệu...")
    df = reduce(lambda l, r: pd.merge(l, r, on='year', how='outer'), dfs)
    df['year'] = pd.to_numeric(df['year'])
    df = df[df['year'] >= 2015].sort_values('year')
    
    # Nội suy tuyến tính (Interpolation) để điền các năm bị khuyết
    df = df.interpolate(method='linear', limit_direction='both').ffill().bfill()
    
    # 5. Tính toán Proxy cho TP.HCM (Real Logic)
    # Lấy các cột ngành thực tế (bỏ cột year)
    sector_cols = [col for col in df.columns if col != 'year']
    for col in sector_cols:
        weight = HCM_WEIGHTS.get(col, 0.23) # Mặc định 23% nếu không khai báo
        df[f'HCM_{col}'] = df[col] * weight
            
    # 6. Lưu Cache cho lần sau
    df.to_csv(CACHE_FILE, index=False)
    print(f"💾 [CACHE] Đã lưu dữ liệu vào: {CACHE_FILE}")
            
    return df