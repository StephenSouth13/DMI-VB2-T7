import os
import pandas as pd
from datetime import datetime
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Image, 
                                Table, TableStyle, PageBreak, Frame, PageTemplate)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from config import OUTPUT_DIR

# ==========================================================
# 1. ĐĂNG KÝ FONT & CẤU HÌNH STYLE (UI/UX)
# ==========================================================
def register_fonts():
    try:
        # Đường dẫn font chuẩn Windows
        pdfmetrics.registerFont(TTFont('Arial', 'C:/Windows/Fonts/arial.ttf'))
        pdfmetrics.registerFont(TTFont('Arial-Bold', 'C:/Windows/Fonts/arialbd.ttf'))
        pdfmetrics.registerFont(TTFont('Arial-Italic', 'C:/Windows/Fonts/ariali.ttf'))
        return 'Arial', 'Arial-Bold', 'Arial-Italic'
    except:
        print("⚠️ Không tìm thấy Arial, dùng font mặc định (Lỗi Tiếng Việt).")
        return 'Helvetica', 'Helvetica-Bold', 'Helvetica-Oblique'

f_reg, f_bold, f_ital = register_fonts()

styles = getSampleStyleSheet()
# Style Tiêu đề cực lớn
title_style = ParagraphStyle('TitleStyle', fontName=f_bold, fontSize=28, 
                             textColor=colors.HexColor("#1A365D"), alignment=1, spaceAfter=20)
# Style Tiêu đề mục
h1_style = ParagraphStyle('H1Style', fontName=f_bold, fontSize=18, 
                          textColor=colors.HexColor("#2C5282"), spaceBefore=20, spaceAfter=12)
# Style khung Highlights
highlight_style = ParagraphStyle('Highlight', fontName=f_bold, fontSize=12, 
                                 textColor=colors.HexColor("#FFFFFF"), backColor=colors.HexColor("#2B6CB0"),
                                 borderPadding=10, borderRadius=5, alignment=1)
# Style nội dung
body_style = ParagraphStyle('BodyStyle', fontName=f_reg, fontSize=11, leading=15, alignment=4)

# ==========================================================
# 2. HÀM VẼ HEADER & FOOTER
# ==========================================================
def add_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont(f_reg, 9)
    canvas.setStrokeColor(colors.HexColor("#CBD5E0"))
    canvas.line(0.75*inch, 0.75*inch, 7.5*inch, 0.75*inch) # Đường kẻ chân trang
    
    page_num = f"Trang {doc.page} | HCMC Investment Intelligence Report 2026 - Confidential"
    canvas.drawCentredString(A4[0]/2, 0.5*inch, page_num)
    canvas.restoreState()

# ==========================================================
# 3. CORE REPORT GENERATOR
# ==========================================================
def create_final_pdf():
    print("📄 [Reporting] Đang đúc báo cáo 'Bản cáo bạch' siêu cấp...")
    
    METRICS_FILE = f"{OUTPUT_DIR}/strategic_ranking.csv"
    PDF_PATH = f"{OUTPUT_DIR}/HCMC_Investment_Strategic_Report_2026.pdf"

    if not os.path.exists(METRICS_FILE):
        print("❌ Lỗi: Chạy main.py trước để có dữ liệu!")
        return

    df_metrics = pd.read_csv(METRICS_FILE)
    top_row = df_metrics.iloc[0]
    
    doc = SimpleDocTemplate(PDF_PATH, pagesize=A4, topMargin=60, bottomMargin=80)
    story = []

    # ----------------------------------------------------------
    # TRANG 1: TRANG BÌA HIỆN ĐẠI
    # ----------------------------------------------------------
    story.append(Spacer(1, 1.5*inch))
    story.append(Paragraph("BÁO CÁO CHIẾN LƯỢC ĐẦU TƯ", title_style))
    story.append(Paragraph("TP.HỒ CHÍ MINH: TẦM NHÌN 2026", title_style))
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("<font color='#4A5568' size='14'>DATA-DRIVEN INVESTMENT PROSPECTUS</font>", title_style))
    story.append(Spacer(1, 1*inch))
    
    # Bảng tóm tắt nhanh ở trang bìa
    quick_data = [
        [Paragraph(f"<b>NGÀNH DẪN DẮT</b><br/>{top_row['Sector']}", highlight_style),
         Paragraph(f"<b>TĂNG TRƯỞNG CAGR</b><br/>{top_row['CAGR']:.2%}", highlight_style),
         Paragraph(f"<b>ĐỘ TIN CẬY R2</b><br/>{top_row['R2']:.2f}", highlight_style)]
    ]
    t_quick = Table(quick_data, colWidths=[2.2*inch, 2.2*inch, 2.2*inch])
    story.append(t_quick)
    
    story.append(Spacer(1, 2.5*inch))
    story.append(Paragraph(f"Ngày báo cáo: {datetime.now().strftime('%d/%m/%Y')}", body_style))
    story.append(Paragraph("Hệ thống: HCMC Intelligence System V3.0 PRO", body_style))
    story.append(Paragraph("Đơn vị: UEH - DMI-VB2-T7", body_style))
    story.append(PageBreak())

    # ----------------------------------------------------------
    # TRANG 2: MA TRẬN CƠ HỘI & PHÂN TÍCH ĐA NGÀNH
    # ----------------------------------------------------------
    story.append(Paragraph("1. Phân tích Cơ hội & Hiệu suất Đa ngành", h1_style))
    story.append(Paragraph("Ma trận Diamonds vs Dead-ends dưới đây phân loại các ngành dựa trên sự kết hợp giữa tốc độ tăng trưởng (CAGR) và độ tin cậy của dòng vốn (R2).", body_style))
    
    img_bubble = f"{OUTPUT_DIR}/2_opportunity_matrix.png"
    if os.path.exists(img_bubble):
        story.append(Spacer(1, 10))
        story.append(Image(img_bubble, width=6.5*inch, height=4.2*inch))
    
    story.append(Spacer(1, 20))
    story.append(Paragraph("2. Bảng Xếp hạng Đầu tư Chi tiết", h1_style))
    
    # Bảng dữ liệu McKinsey Style
    table_data = [["Ngành (Sector)", "Tăng trưởng (CAGR)", "Tin cậy (R2)", "Rủi ro (Vol)", "Điểm Score"]]
    for _, row in df_metrics.head(8).iterrows():
        table_data.append([
            row['Sector'], f"{row['CAGR']:.1%}", f"{row['R2']:.2f}", 
            f"{row['Volatility']:.2f}", f"{row['Investment_Score']:.2f}"
        ])

    t_main = Table(table_data, colWidths=[2.2*inch, 1.2*inch, 1*inch, 1*inch, 1*inch])
    t_main.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1A365D")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,0), (-1,-1), f_reg),
        ('FONTNAME', (0,0), (-1,0), f_bold),
        ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.whitesmoke, colors.white]),
        ('FONTSIZE', (0,0), (-1,-1), 10),
    ]))
    story.append(t_main)
    story.append(PageBreak())

    # ----------------------------------------------------------
    # TRANG 3: SO SÁNH ĐA CHIỀU & PHÂN BỔ VỐN
    # ----------------------------------------------------------
    story.append(Paragraph("3. So sánh Radar & Phân bổ Chiến lược", h1_style))
    
    # Radar và Donut nằm ngang hàng (nếu đủ chỗ)
    radar_img = f"{OUTPUT_DIR}/5_radar_comparison.png"
    donut_img = f"{OUTPUT_DIR}/3_investment_donut_chart.png"
    
    data_charts = []
    row_charts = []
    if os.path.exists(radar_img): row_charts.append(Image(radar_img, width=3.4*inch, height=3.4*inch))
    if os.path.exists(donut_img): row_charts.append(Image(donut_img, width=3.4*inch, height=3.4*inch))
    
    if row_charts:
        data_charts.append(row_charts)
        t_charts = Table(data_charts, colWidths=[3.5*inch, 3.5*inch])
        story.append(t_charts)
    
    story.append(Spacer(1, 20))
    story.append(Paragraph("4. Dịch chuyển Cơ cấu Kinh tế", h1_style))
    area_img = f"{OUTPUT_DIR}/4_structural_shift_area.png"
    if os.path.exists(area_img):
        story.append(Image(area_img, width=6.8*inch, height=3.2*inch))
    
    story.append(PageBreak())

    # ----------------------------------------------------------
    # TRANG 4: SWOT CHIẾN LƯỢC & KẾT LUẬN
    # ----------------------------------------------------------
    story.append(Paragraph("5. Phân tích SWOT & Quyết định Đầu tư", h1_style))
    
    # SWOT Modern UI
    swot_style = ParagraphStyle('SWOT', fontName=f_reg, fontSize=10, leading=14)
    swot_data = [
        [Paragraph("<font color='white'><b>ĐIỂM MẠNH (STRENGTHS)</b></font>", swot_style), 
         Paragraph("<font color='white'><b>ĐIỂM YẾU (WEAKNESSES)</b></font>", swot_style)],
        [Paragraph("• Nhân lực chất lượng cao tiêu chuẩn quốc tế.<br/>• Hệ sinh thái Start-up phát triển mạnh.", swot_style), 
         Paragraph("• Hạ tầng logistics còn hiện tượng nghẽn mạch.<br/>• Chi phí mặt bằng tăng trưởng nóng.", swot_style)],
        [Paragraph("<font color='white'><b>CƠ HỘI (OPPORTUNITIES)</b></font>", swot_style), 
         Paragraph("<font color='white'><b>THÁCH THỨC (THREATS)</b></font>", swot_style)],
        [Paragraph("• Làn sóng FDI bán dẫn toàn cầu.<br/>• Chuyển đổi số doanh nghiệp mạnh mẽ.", swot_style), 
         Paragraph("• Biến đổi khí hậu & Rủi ro ngập lụt.<br/>• Cạnh tranh gay gắt từ các thành phố vệ tinh.", swot_style)]
    ]
    t_swot = Table(swot_data, colWidths=[3.4*inch, 3.4*inch])
    t_swot.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor("#2F855A")), # Xanh lá
        ('BACKGROUND', (1,0), (1,0), colors.HexColor("#C53030")), # Đỏ
        ('BACKGROUND', (0,2), (0,2), colors.HexColor("#2B6CB0")), # Xanh dương
        ('BACKGROUND', (1,2), (1,2), colors.HexColor("#C05621")), # Cam
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 1, colors.white),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(t_swot)

    story.append(Spacer(1, 40))
    story.append(Paragraph("6. Lời kết", h1_style))
    story.append(Paragraph(f"""
    Dựa trên các bằng chứng thực chứng, chúng tôi khẳng định <b>{top_row['Sector']}</b> là ngành mũi nhọn 
    cần được ưu tiên nguồn lực đầu tư trong giai đoạn 2026-2030. TP.HCM vẫn giữ vững vị thế là tâm điểm 
    thu hút FDI bền vững tại khu vực Đông Nam Á.
    """, body_style))

    # Xây dựng PDF với Page Numbering
    doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
    print(f"🚀 [HOÀN THÀNH] Báo cáo PDF Đỉnh cao tại: {PDF_PATH}")

if __name__ == "__main__":
    create_final_pdf()