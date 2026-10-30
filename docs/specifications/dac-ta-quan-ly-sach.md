#### 1\. Đặc tả Use Case: Cập nhật thông tin sách

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| Tóm tắt | Chức năng tổng hợp cho phép nhân viên kho thực hiện việc thêm mới, chỉnh sửa hoặc xóa thông tin đầu sách. |
| Tiền điều kiện | Nhân viên kho đã đăng nhập hệ thống và truy cập phân hệ *Quản lý sách*. |
| Hậu điều kiện | Trạng thái dữ liệu sách sẵn sàng nhận các thao tác cập nhật chi tiết. |
| Dòng sự kiện chính | 1\. Nhân viên kho chọn chức năng Cập nhật thông tin sách. 2\. Hệ thống hiển thị màn hình quản lý sách kèm các tùy chọn: *Thêm mới sách*, *Chỉnh sửa / Cập nhật*, *Xóa sách*. 3\. Người dùng chọn hành động cụ thể để tiến hành xử lý dữ liệu. |
|  |  |
| Dòng sự kiện phụ | • Không có quyền: Hệ thống thông báo từ chối truy cập nếu tài khoản không đủ quyền quản lý kho. |

#### 2\. Đặc tả Use Case: Thêm mới sách

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| Tóm tắt | Cho phép khai báo và thêm một đầu sách mới vào kho hàng. |
| Tiền điều kiện | Nhân viên kho đang mở giao diện *Cập nhật thông tin sách*. |
| Hậu điều kiện | Đầu sách mới được thêm vào hệ thống CSDL kho sách. |
| Dòng sự kiện chính | 1\. Nhân viên kho chọn Thêm mới sách. 2\. Nhập các thông tin sách (Tên sách, ISBN, giá bán, thể loại, tác giả, NXB). 3\. Hệ thống kích hoạt bắt buộc use-case Kiểm tra dữ liệu. 4\. Nếu dữ liệu hợp lệ, hệ thống lưu thông tin sách mới và thông báo thành công. |
| Dòng sự kiện phụ | •Trùng mã ISBN / Dữ liệu không hợp lệ: Use-case *Kiểm tra dữ liệu* trả về kết quả lỗi, hệ thống hiển thị cảnh báo và yêu cầu sửa lại. |

#### 3\. Đặc tả Use Case: Chỉnh sửa / Cập nhật

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| Tóm tắt | Cho phép thay đổi, cập nhật các thuộc tính của một đầu sách đã có sẵn. |
| Tiền điều kiện | Nhân viên kho đã chọn được đầu sách cần sửa trong danh sách. |
| Hậu điều kiện | Thông tin mới của đầu sách được lưu đè lên dữ liệu cũ trên CSDL. |
| Dòng sự kiện chính | 1\. Nhân viên kho chọn đầu sách và nhấn Chỉnh sửa / Cập nhật. 2\. Thay đổi các thông tin cần thiết trên biểu mẫu. 3\. Hệ thống gọi use-case bắt buộc Kiểm tra dữ liệu . 4\. Khi dữ liệu hợp lệ, hệ thống cập nhật và ghi nhận thành công. |
| Dòng sự kiện phụ | • A1 (Kiểm tra dữ liệu không đạt): Hệ thống báo lỗi các trường thông tin sai định dạng, ngăn việc lưu thay đổi. |

#### 4\. Đặc tả Use Case: Xóa sách

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| Tóm tắt | Cho phép xóa hoặc vô hiệu hóa một đầu sách khỏi danh mục hệ thống. |
| Tiền điều kiện | Nhân viên kho đã chọn đầu sách cần xóa. |
| Hậu điều kiện | Đầu sách bị xóa hoặc chuyển sang trạng thái ngưng kinh doanh. |
| Dòng sự kiện chính | 1\. Nhân viên kho chọn đầu sách và nhấn Xóa sách. 2\. Hệ thống hiển thị hộp thoại yêu cầu xác nhận xóa. 3\. Nhân viên nhấn Xác nhận. 4\. Hệ thống thực hiện xóa hoặc chuyển trạng thái sách. |
| Dòng sự kiện phụ | •Sách đã phát sinh giao dịch hóa đơn/nhập kho: Hệ thống từ chối xóa vật lý để đảm bảo toàn vẹn dữ liệu, tự động chuyển sang khóa/ngừng kinh doanh. |

#### 5\. Đặc tả Use Case: Kiểm tra dữ liệu

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| Tóm tắt | Use-case phụ thực hiện kiểm tra tính hợp lệ, đầy đủ của dữ liệu sách trước khi lưu. |
| Tiền điều kiện | Hệ thống nhận được yêu cầu lưu (thêm mới hoặc chỉnh sửa) thông tin sách. |
| Hậu điều kiện | Trả về kết quả hợp lệ (cho phép lưu) hoặc không hợp lệ (báo lỗi). |
| Dòng sự kiện chính | 1\. Hệ thống tiếp nhận dữ liệu từ form Thêm mới hoặc Chỉnh sửa sách. 2\. Kiểm tra các điều kiện bắt buộc: Tên sách không trống, mã ISBN không trùng, giá bán $>0$, đã chọn thể loại/tác giả/NXB. 3\. Xác nhận dữ liệu hợp lệ và trả về tín hiệu cho phép hoàn tất giao dịch. |
| Dòng sự kiện phụ | •Phát hiện lỗi: Hệ thống chỉ ra chính xác trường dữ liệu bị thiếu hoặc sai quy tắc, gửi thông báo lỗi ra màn hình. |

#### 6\. Đặc tả Use Case: Tra cứu thông tin sách

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| Tóm tắt | Cho phép nhân viên kho tìm kiếm, tra cứu hồ sơ sách theo nhiều tiêu chí linh hoạt. |
| Tiền điều kiện | Nhân viên kho đã đăng nhập hệ thống. |
| Hậu điều kiện | Danh sách sách tìm kiếm được hiển thị theo tiêu chí lọc. |
| Dòng sự kiện chính | 1\. Nhân viên kho chọn chức năng Tra cứu thông tin sách. 2\. Nhập/chọn các tiêu chí lọc (tên, mã, thể loại, tác giả, NXB) và nhấn Tìm kiếm. 3\. Hệ thống trả về danh sách các đầu sách thỏa mãn. |
| Dòng sự kiện phụ | •Không tìm thấy: Hệ thống hiển thị thông báo không có đầu sách nào khớp với điều kiện lọc. |

#### 7\. Đặc tả Use Case: Xem chi tiết sách

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| Tóm tắt | Cho phép xem toàn bộ thuộc tính chi tiết cùng tình trạng tồn kho thực tế của một đầu sách. |
| Tiền điều kiện | Nhân viên kho đã thực hiện tra cứu và có danh sách kết quả sách. |
| Hậu điều kiện | Bảng thông tin chi tiết và số lượng tồn kho của sách được hiển thị. |
| Dòng sự kiện chính | 1\. Nhân viên kho chọn một đầu sách từ danh sách kết quả tra cứu để kích hoạt Xem chi tiết sách. 2\. Hệ thống truy vấn CSDL lấy toàn bộ thuộc tính và số lượng tồn kho thực tế. 3\. Hiển thị bảng chi tiết lên màn hình cho nhân viên theo dõi. |
| Dòng sự kiện phụ | •Dữ liệu tồn kho bị lỗi đồng bộ: Hệ thống hiển thị cảnh báo yêu cầu làm mới dữ liệu tồn kho. |

