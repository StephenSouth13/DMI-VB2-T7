from pytrends.request import TrendReq
import pandas as pd

pytrends = TrendReq(hl='vi-VN', tz=360)
# So sánh mức độ quan tâm đầu tư
kw_list = ["Đầu tư TP.HCM", "Invest in Ho Chi Minh City", "Invest in Bangkok"]
pytrends.build_payload(kw_list, cat=0, timeframe='today 5-y', geo='', gprop='')

df = pytrends.interest_over_time()
df.to_csv("cache/invest_interest.csv")
print("✅ Đã lấy xong dữ liệu 'Sức nóng' đầu tư!")