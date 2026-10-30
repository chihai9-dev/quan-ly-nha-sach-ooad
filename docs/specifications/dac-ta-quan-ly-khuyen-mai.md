**1\. Đặc tả Use Case: Tra cứu chương trình Khuyến mãi**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tóm tắt** | Cho phép Quản lý xem danh sách các chương trình khuyến mãi đang có trong hệ thống và tình trạng của chúng (Sắp diễn ra, Đang diễn ra, Đã kết thúc). |
| **Tiền điều kiện** | Quản lý đăng nhập vào phân hệ Quản lý khuyến mãi. |
| **Hậu điều kiện** | Danh sách các chương trình khuyến mãi được hiển thị. |
| **Dòng sự kiện chính** | 1\. Quản lý chọn menu "Danh sách Khuyến mãi". 2\. Hệ thống tải dữ liệu và hiển thị danh sách dạng bảng. 3\. Quản lý có thể lọc theo trạng thái, loại khuyến mãi hoặc tìm theo tên chương trình. |
| **Dòng sự kiện phụ** | • **Dữ liệu rỗng:** Chưa có chương trình nào được tạo, hệ thống hiển thị "Chưa có dữ liệu" kèm nút gợi ý "Tạo mới ngay". |

**2\. Đặc tả Use Case: Thêm mới / Thiết lập chương trình KM**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tóm tắt** | Tạo lập và kiểm soát các chiến dịch ưu đãi kèm các điều kiện áp dụng cụ thể. |
| **Tiền điều kiện** | Quản lý đang ở giao diện Quản lý khuyến mãi. |
| **Hậu điều kiện** | Một chiến dịch ưu đãi mới được lưu vào hệ thống. |
| **Dòng sự kiện chính** | 1\. Quản lý nhấn "Tạo mới Khuyến mãi". 2\. Hệ thống hiển thị form điền thông tin. 3\. Quản lý tạo lập các chiến dịch ưu đãi (giảm giá theo phần trăm, giảm số tiền cố định, mua combo sách). 4\. Quản lý kèm các điều kiện về thời gian áp dụng (Từ ngày \- Đến ngày). 5\. Quản lý thiết lập phạm vi áp dụng (toàn cửa hàng, theo danh mục hoặc theo từng đầu sách). 6\. Quản lý nhấn "Lưu". Hệ thống gọi Use Case "Kiểm tra dữ liệu KM". 7\. Dữ liệu hợp lệ, hệ thống lưu chương trình và thông báo thành công. |
| **Dòng sự kiện phụ** | • **Thời gian không hợp lệ:** Ngày kết thúc trước ngày bắt đầu, hệ thống báo lỗi không cho lưu. |

**3\. Đặc tả Use Case: Chỉnh sửa chương trình KM**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tóm tắt** | Cho phép Quản lý cập nhật lại nội dung, thời gian hoặc phạm vi áp dụng của một chương trình KM hiện có. |
| **Tiền điều kiện** | Quản lý đã chọn một chương trình KM từ danh sách tra cứu. |
| **Hậu điều kiện** | CSDL được cập nhật đè lên thông tin cũ. |
| **Dòng sự kiện chính** | 1\. Quản lý nhấn nút "Chỉnh sửa" tại dòng của chương trình KM. 2\. Hệ thống tải dữ liệu cũ lên biểu mẫu. 3\. Quản lý thay đổi các tham số (ví dụ: gia hạn thời gian, đổi % giảm giá). 4\. Nhấn "Cập nhật". Hệ thống gọi Use Case "Kiểm tra dữ liệu KM". 5\. Dữ liệu hợp lệ, hệ thống cập nhật và thông báo thành công. |
| **Dòng sự kiện phụ** | • **Chương trình đã kết thúc:** Hệ thống khóa nút chỉnh sửa, hiển thị thông báo "Không thể sửa chương trình đã kết thúc, vui lòng tạo mới". |

**4\. Đặc tả Use Case: Hủy / Ngừng chương trình KM**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tóm tắt** | Cho phép ngưng hiệu lực của một chương trình khuyến mãi trước thời hạn kết thúc dự kiến. |
| **Tiền điều kiện** | Quản lý chọn một chương trình đang ở trạng thái "Đang diễn ra" hoặc "Sắp diễn ra". |
| **Hậu điều kiện** | Chương trình chuyển sang trạng thái "Đã hủy/Ngưng" và không còn áp dụng được khi tính tiền. |
| **Dòng sự kiện chính** | 1\. Quản lý nhấn nút "Hủy / Ngưng" tại chương trình cần thao tác. 2\. Hệ thống hiển thị hộp thoại xác nhận: "Bạn có chắc chắn muốn ngưng chương trình này?". 3\. Quản lý bấm "Đồng ý". 4\. Hệ thống đổi trạng thái chương trình thành "Đã ngưng" và cập nhật vào CSDL. |
| **Dòng sự kiện phụ** | • **Hủy thao tác:** Quản lý bấm "Không", hộp thoại đóng lại và không có thay đổi nào diễn ra. |

**5\. Đặc tả Use Case: Kiểm tra dữ liệu KM (Sub-usecase)**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tóm tắt** | Chức năng chạy ngầm để validate tính hợp lệ của dữ liệu trước khi lưu thiết lập khuyến mãi. |
| **Tiền điều kiện** | Quản lý nhấn nút Lưu/Cập nhật khi tạo/sửa khuyến mãi. |
| **Hậu điều kiện** | Trả về tín hiệu "Hợp lệ" hoặc "Có lỗi" để hệ thống xử lý tiếp. |
| **Dòng sự kiện chính** | 1\. Hệ thống tiếp nhận luồng dữ liệu biểu mẫu. 2\. Kiểm tra các quy tắc: Tên KM không được trống; Mức giảm giá % phải từ 1-100; Ngày kết thúc phải \>= Ngày bắt đầu. 3\. Kiểm tra tính xung đột (Ví dụ: 1 cuốn sách không thể áp dụng 2 mức giảm giá % đồng thời). 4\. Dữ liệu đạt, trả về tín hiệu Hợp lệ. |
| **Dòng sự kiện phụ** | • **Lỗi xung đột sản phẩm:** Phát hiện cuốn A đã có trong chương trình KM khác cùng thời điểm, hệ thống báo lỗi "Sản phẩm X đang trùng khuyến mãi" và yêu cầu quản lý bỏ chọn sản phẩm đó. |

**6\. Đặc tả Use Case: Tạo và Quản lý mã giảm giá (Voucher)**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tóm tắt** | Tạo, phát hành mã coupon/voucher ưu đãi độc lập với các chương trình giảm giá trực tiếp. |
| **Tiền điều kiện** | Quản lý chọn chức năng "Quản lý mã giảm giá". |
| **Hậu điều kiện** | Hệ thống sinh ra một loạt mã giảm giá hoặc một mã dùng chung. |
| **Dòng sự kiện chính** | 1\. Quản lý thực hiện tạo, phát hành và kiểm duyệt mã coupon/voucher ưu đãi. 2\. Nhập chuỗi mã (ví dụ: BOOK2026) hoặc cho hệ thống sinh mã ngẫu nhiên. 3\. Quản lý quy định điều kiện hưởng ưu đãi (giá trị đơn hàng tối thiểu, số lần sử dụng tối đa, hạn sử dụng). 4\. Nhấn "Lưu mã giảm giá". 5\. Hệ thống ghi nhận vào CSDL. |
| **Dòng sự kiện phụ** | • **Mã đã tồn tại:** Nếu chuỗi mã quản lý nhập tay đã có trên hệ thống, hệ thống báo lỗi "Mã voucher đã tồn tại, vui lòng nhập mã khác". |

**7\. Đặc tả Use Case: Tra cứu lịch sử sử dụng mã giảm giá**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tóm tắt** | Cho phép quản lý theo dõi lịch sử áp dụng của mã giảm giá đã phát hành. |
| **Tiền điều kiện** | Quản lý đang ở giao diện danh sách mã giảm giá. |
| **Hậu điều kiện** | Bảng danh sách các hóa đơn đã dùng mã giảm giá đó được hiển thị. |
| **Dòng sự kiện chính** | 1\. Quản lý click vào nút "Xem lịch sử" tại một mã voucher cụ thể. 2\. Hệ thống tiến hành theo dõi lịch sử áp dụng của mã. 3\. Hệ thống truy xuất CSDL các giao dịch liên quan. 4\. Hệ thống hiển thị: Mã hóa đơn, Tên khách hàng sử dụng, Ngày dùng, Tổng tiền đơn hàng được giảm. |
| **Dòng sự kiện phụ** | • **Chưa có người dùng:** Hệ thống hiển thị "Mã chưa được sử dụng lần nào". |

