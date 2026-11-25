# UI — Trọn bộ giao diện "mộc." (Quản lý nhà sách)

Bộ giao diện HTML/CSS/JS tĩnh, không cần cài đặt hay build. Mở file `index.html` trực tiếp bằng bất kỳ trình duyệt nào để trải nghiệm và điều hướng toàn bộ hệ thống.

---

## 1. Danh sách màn hình trong thư mục `UI/`

### 1.1. Phân hệ chính (Core Modules)
| File | Màn hình | Mô tả & Thuật ngữ nghiệp vụ |
|---|---|---|
| `tong-quan.html` | **Tổng quan (Dashboard)** | Tái hiện 100% mẫu thiết kế gốc: 4 thẻ KPI, biểu đồ doanh thu 7 ngày, sách bán chạy, 5 giao dịch gần đây, danh sách việc cần chú ý và mục tiêu 7 ngày (81,5%). |
| `quan-ly-sach.html` | **Quản lý sách** | Tái hiện 100% mẫu thiết kế gốc: Danh mục 1.248 đầu sách, lọc thể loại, NXB, tình trạng kho, 8 dòng dữ liệu mẫu, phân trang và trạng thái kinh doanh. |
| `ban-hang.html` | **Bán hàng tại quầy (POS)** | Lưới sách, phím tắt F2 quét mã, F4 tìm khách VIP, F8 voucher MOC10, tính VAT 8%, tiền thừa và 4 phương thức thanh toán. |
| `ton-kho.html` | **Tồn kho & Cảnh báo** | Kiểm soát 12.486 cuốn sách trong kho, cảnh báo 24 đầu sách sắp hết, danh sách đề xuất nhập bổ sung và biến động xuất nhập trong ngày. |
| `nhap-hang.html` | **Nhập hàng từ NCC** | Quản lý 18 phiếu nhập sách, danh sách hàng về hôm nay, công nợ nhà cung cấp theo kỳ hạn trả. |
| `khach-hang.html` | **Khách hàng thành viên** | Quản lý 3.842 khách hàng, 4 hạng thẻ (`STANDARD`, `SILVER`, `GOLD`, `PLATINUM`), tích điểm thưởng và hồ sơ chi tiết. |
| `bao-cao.html` | **Báo cáo kinh doanh** | Biểu đồ cột so sánh theo ngày, donut cơ cấu doanh thu theo thể loại sách, bảng xếp hạng thu ngân và phương thức thanh toán. |

### 1.2. Màn hình chi tiết & quy trình nghiệp vụ con (Sub-flows)
| File | Màn hình | Mô tả & Thuật ngữ nghiệp vụ |
|---|---|---|
| `quan-ly-sach-them.html` | **Thêm sách mới / Sửa** | Form nhập ISBN, tác giả, nhà xuất bản, giá nhập, giá bán (tính biên lãi +42,8%), vị trí kệ trưng bày và ảnh bìa. |
| `ban-hang-hoa-don.html` | **Hóa đơn & Đổi trả** | Tra cứu danh sách hóa đơn xuất tại quầy, chi tiết hóa đơn nhiệt HD-0128, tính năng in lại và nghiệp vụ đổi trả hoàn kho. |
| `kiem-ke.html` | **Kiểm kê kho (`StockAudit`)** | Quy trình 4 bước kiểm kê kệ A: đếm thực tế vs hệ thống, tính chênh lệch thừa/thiếu, lý do hư hỏng/thất lạc và gửi duyệt quản lý. |
| `nhap-hang-tao-phieu.html` | **Tạo phiếu nhập (`GoodsReceipt`)** | Lập phiếu nhập từ đối tác (Phương Nam), bảng dòng sách, giá nhập, chiết khấu NCC 2%, VAT 5% và trả trước. |
| `nha-cung-cap.html` | **Nhà cung cấp & Công nợ** | Danh sách 8 đối tác phát hành, theo dõi hạn nợ chi tiết, số dư từng phiếu nhập và lập phiếu chi thanh toán nợ. |
| `khuyen-mai.html` | **Khuyến mãi & Voucher** | Quản lý mã coupon (`MOC10`, `SACH10`, `VIPMEMBER`), chiến dịch combo sách và cơ chế tính chiết khấu kép. |

### 1.3. Hệ thống & Vận hành
| File | Màn hình | Mô tả |
|---|---|---|
| `cai-dat.html` | **Cài đặt hệ thống** | Cấu hình nhà sách Nguyễn Văn Cừ, tỷ lệ thuế VAT 8%, định mức 4 hạng thẻ thành viên, danh sách nhân viên & phân quyền. |
| `tro-giup.html` | **Trung tâm trợ giúp** | Câu hỏi thường gặp FAQ, bảng phím tắt POS quầy thu ngân, video clip hướng dẫn nhân viên mới và hotline hỗ trợ. |
| `dang-nhap.html` | **Đăng nhập ca làm việc** | Màn hình đăng nhập thương hiệu mộc., chọn chi nhánh làm việc, ghi nhớ tài khoản và tài khoản thử nghiệm mẫu. |
| `index.html` | **Mục lục điều hướng** | Trang đích tổng hợp liên kết trực quan đến tất cả 16 màn hình và tài nguyên. |

---

## 2. Thư viện dùng chung
- `assets/moc.css`: Toàn bộ design tokens (màu chủ đạo xanh rêu `#24533a`, nền ấm `#f6f6f1`, border `#e7e6dc`), typography, table, card, badge, status pill, progress bar, chart...
- `assets/shell.js`: Shell kiến trúc tự động chèn Sidebar và Topbar thống nhất, render biểu tượng SVG Lucide mượt mà và xử lý tab/filter tương tác.
- `reference/`: Lưu 2 ảnh thiết kế mẫu tham chiếu gốc của người dùng (`tong-quan.png` và `quan-ly-sach.png`).
