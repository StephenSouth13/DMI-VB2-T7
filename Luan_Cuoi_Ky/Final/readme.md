# 🚀 INVESTMENT INTELLIGENCE SYSTEM – DOCUMENTATION

## 1. 🎯 Mục tiêu hệ thống

Hệ thống được xây dựng nhằm:

* Thu thập dữ liệu vĩ mô đa ngành từ API quốc tế
* Chuẩn hóa dữ liệu về cùng hệ quy chiếu
* Phân tích mối quan hệ giữa dòng vốn FDI và các ngành kinh tế
* Xếp hạng mức độ hấp dẫn đầu tư (Investment Score)
* Xuất báo cáo dạng Dashboard + PDF

---

## 2. 📥 INPUT (Dữ liệu đầu vào)

### 2.1 Nguồn dữ liệu chính

* World Bank API (Vietnam)
* Các chỉ số:

| Biến          | Ý nghĩa                      |
| ------------- | ---------------------------- |
| FDI           | Dòng vốn đầu tư nước ngoài   |
| Tech          | Xuất khẩu công nghệ cao      |
| Manufacturing | Giá trị sản xuất công nghiệp |
| Trade         | Tỷ lệ thương mại/GDP         |

---

### 2.2 Dạng dữ liệu sau khi fetch

```python
year | FDI | Tech | Manufacturing | Trade
```

---

## 3. ⚙️ LUỒNG XỬ LÝ (PIPELINE)

### Bước 1: Fetch Data

```python
requests.get(...)
```

👉 Lấy dữ liệu từ World Bank API
👉 Nếu API lỗi → dùng dữ liệu giả (fallback)

---

### Bước 2: Data Cleaning

```python
df.sort_values().ffill()
```

* Sắp xếp theo năm
* Điền giá trị thiếu (forward fill)

---

### Bước 3: Feature Engineering

```python
df['FDI_Lag1'] = df['FDI'].shift(1)
```

👉 Tạo biến trễ (Lag) để mô phỏng:

> FDI năm trước ảnh hưởng năm sau

---

```python
df['Tech_Vol'] = pct_change().rolling().std()
```

👉 Tính biến động (Risk)

---

```python
StandardScaler()
```

👉 Chuẩn hóa dữ liệu (Z-score)

---

## 4. 🧠 MÔ HÌNH PHÂN TÍCH

### 4.1 Hồi quy tuyến tính (OLS)

```python
model = sm.OLS(y, X).fit()
```

* X: FDI_Lag1 + Trade
* y: Tech / Manufacturing

---

### 4.2 Hệ số xác định R²

👉 Đo mức độ giải thích của FDI đối với ngành:

```
R² = 1 - (Sai số mô hình / Sai số tổng)
```

* Gần 1 → tương quan mạnh
* Gần 0 → yếu

---

### 4.3 CAGR (Tăng trưởng)

```python
cagr = (end/start)**(1/n) - 1
```

👉 Đo tốc độ tăng trưởng dài hạn

---

### 4.4 Risk Score

```python
risk = 1 / (1 + volatility)
```

👉 Biến động càng thấp → điểm càng cao

---

### 4.5 Investment Score

```python
Score = 0.4*R² + 0.4*CAGR + 0.2*Risk
```

👉 Công thức tổng hợp:

* Tăng trưởng
* Độ tin cậy
* Rủi ro

---

## 5. 📊 OUTPUT (Đầu ra)

### 5.1 File dữ liệu

| File        | Nội dung         |
| ----------- | ---------------- |
| data.xlsx   | Dữ liệu đã xử lý |
| metrics.csv | Xếp hạng ngành   |

---

### 5.2 Biểu đồ

| File        | Ý nghĩa            |
| ----------- | ------------------ |
| scatter.png | Quan hệ FDI → Tech |
| corr.png    | Ma trận tương quan |
| rank.png    | Xếp hạng ngành     |

---

### 5.3 Dashboard HTML

```html
dashboard.html
```

Hiển thị:

* Ngành tốt nhất
* Bảng xếp hạng
* Biểu đồ

---

### 5.4 PDF Report

```text
report.pdf
```

Bao gồm:

* Kết luận chiến lược
* Biểu đồ
* Tóm tắt ngành

---

## 6. 🧠 LOGIC CHỐNG LỖI

Hệ thống đảm bảo:

### ✔ Nếu API lỗi

→ dùng dữ liệu giả

### ✔ Nếu thiếu cột

→ tự tạo cột = 0

### ✔ Nếu thiếu dữ liệu

→ fill forward

### ✔ Nếu model lỗi

→ skip và log

---

## 7. 📈 Ý NGHĨA KINH TẾ

### Insight chính:

* FDI có ảnh hưởng trực tiếp đến tăng trưởng ngành
* Công nghệ có xu hướng tương quan cao với FDI
* Ngành có CAGR cao + R² cao → ngành "Diamond"

---

## 8. 🎤 CÁCH TRÌNH BÀY TRƯỚC HỘI ĐỒNG

Bạn có thể nói:

> "Hệ thống sử dụng dữ liệu vĩ mô, áp dụng mô hình hồi quy có độ trễ để chứng minh mối quan hệ nhân quả giữa dòng vốn FDI và tăng trưởng ngành, từ đó xây dựng chỉ số Investment Score nhằm hỗ trợ ra quyết định đầu tư."

---

## 9. 🏁 KẾT LUẬN

Hệ thống không chỉ:

* Phân tích dữ liệu
  mà còn:
* Đưa ra quyết định đầu tư dựa trên bằng chứng

👉 Đây là bước chuyển từ Data Analysis → Investment Intelligence

---
