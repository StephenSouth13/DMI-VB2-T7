import os

OUTPUT_DIR = "storage"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 12+ Chỉ số "Chứng thực" đa ngành nghề (World Bank Indicators)
INDICATORS = {
    'FDI': 'BX.KLT.DINV.CD.WD',           # Tổng vốn đầu tư
    'HighTech': 'TX.VAL.TECH.CD',         # Xuất khẩu Công nghệ cao
    'Manufacturing': 'NV.IND.MANF.ZS',    # Công nghiệp chế biến chế tạo
    'Services': 'NV.SRV.TOTL.ZS',         # Dịch vụ & Thương mại
    'Trade': 'NE.TRD.GNFS.ZS',            # Mức độ mở cửa kinh tế
    'Energy': 'EG.ELC.ACCS.ZS',           # Hạ tầng năng lượng
    'Logistics_Cost': 'IS.SHP.GDSW.ZS',   # Chỉ số vận tải/Logistics
    'Education': 'SE.XPD.TOTL.GD.ZS',     # Đầu tư nhân lực (Giáo dục)
    'Healthcare': 'SH.XPD.CHEX.GD.ZS'     # Y tế & An sinh
}

# Tỷ trọng đóng góp TP.HCM (Proxy thực tế cho từng ngành)
HCM_WEIGHTS = {
    'FDI': 0.28, 'HighTech': 0.45, 'Services': 0.35, 'Manufacturing': 0.18, 
    'General': 0.23
}