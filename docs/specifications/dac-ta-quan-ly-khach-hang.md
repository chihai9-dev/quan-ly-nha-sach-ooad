#### 1.Đặc tả Use Case: Cập nhật thông tin KH

| Thành phần | Nội dung chi tiết |
| ----- | ----- |
| Tóm tắt | Chức năng tổng hợp cho phép nhân viên bán hàng thêm mới, chỉnh sửa hoặc xóa hồ sơ khách hàng. PNG |
| Tiền điều kiện | Nhân viên bán hàng đã đăng nhập và mở phân hệ *Quản lý Khách hàng*. PNG |
| Hậu điều kiện | Hệ thống sẵn sàng tiếp nhận các thao tác cập nhật chi tiết hồ sơ khách hàng. |
| Dòng sự kiện chính | 1\. Nhân viên bán hàng chọn Cập nhật thông tin KH. PNG 2\. Hệ thống hiển thị màn hình quản lý với các tùy chọn: *Thêm mới KH*, *Chỉnh sửa KH*, *Xóa KH*. 3\. Người dùng chọn thao tác cụ thể cần thực hiện. |
| Dòng sự kiện phụ | •Hết phiên làm việc: Yêu cầu đăng nhập lại nếu phiên làm việc đã hết hạn. |

#### 2\. Đặc tả Use Case: Thêm mới KH

| Thành phần | Nội dung chi tiết |
| ----- | ----- |
| Tóm tắt | Cho phép thêm mới hồ sơ khách hàng vào hệ thống (họ tên, SĐT, email, địa chỉ). PNG |
| Tiền điều kiện | Nhân viên bán hàng đang ở màn hình *Cập nhật thông tin KH*. PNG |
| Hậu điều kiện | Hồ sơ khách hàng mới được lưu vào CSDL kèm mức điểm tích lũy ban đầu (0 điểm). |
| Dòng sự kiện chính | 1\. Nhân viên bán hàng chọn Thêm mới KH. 2\. Nhập thông tin khách hàng vào biểu mẫu. 3\. Hệ thống kích hoạt bắt buộc use-case Kiểm tra dữ liệu 4\. Nếu dữ liệu hợp lệ, hệ thống lưu hồ sơ khách hàng mới và báo thành công. |
| Dòng sự kiện phụ | •Số điện thoại đã tồn tại: Use-case *Kiểm tra dữ liệu* phát hiện trùng lặp SĐT, hệ thống báo lỗi và yêu cầu kiểm tra lại. |

#### 3\. Đặc tả Use Case: Chỉnh sửa KH

| Thành phần | Nội dung chi tiết |
| ----- | ----- |
| Tóm tắt | Cho phép cập nhật lại thông tin liên lạc của khách hàng hiện có. PNG |
| Tiền điều kiện | Nhân viên đã chọn được khách hàng cần sửa thông tin. PNG |
| Hậu điều kiện | Thông tin mới của khách hàng được cập nhật chính xác trên CSDL. |
| Dòng sự kiện chính | 1\. Nhân viên chọn khách hàng và nhấn Chỉnh sửa KH. 2\. Thay đổi thông tin cần cập nhật trên biểu mẫu. 3\. Hệ thống gọi use-case bắt buộc Kiểm tra dữ liệu. 4\. Khi dữ liệu hợp lệ, hệ thống lưu thay đổi và thông báo thành công. |
| Dòng sự kiện phụ | •Sai định dạng dữ liệu: Báo lỗi trường thông tin không hợp lệ, giữ nguyên dữ liệu cũ. |

#### 4\. Đặc tả Use Case: Xóa KH

| Thành phần | Nội dung chi tiết |
| ----- | ----- |
| Tóm tắt | Cho phép xóa hoặc ẩn hồ sơ khách hàng khỏi danh sách quản lý. |
| Tiền điều kiện | Nhân viên đã chọn hồ sơ khách hàng cần xóa. |
| Hậu điều kiện | Hồ sơ khách hàng bị xóa hoặc vô hiệu hóa trạng thái hoạt động. |
| Dòng sự kiện chính | 1\. Nhân viên chọn hồ sơ và nhấn Xóa KH. 2\. Hệ thống hiển thị bảng cảnh báo xác nhận xóa. 3\. Nhân viên nhấn Đồng ý. 4\. Hệ thống cập nhật trạng thái xóa hồ sơ trên CSDL. |
| Dòng sự kiện phụ | •Khách hàng còn công nợ/hóa đơn chưa hoàn tất: Hệ thống từ chối xóa để đảm bảo toàn vẹn dữ liệu giao dịch. |

#### 5\. Đặc tả Use Case: Kiểm tra dữ liệu

| Thành phần | Nội dung chi tiết |
| ----- | ----- |
| Tóm tắt | Use-case phụ dùng để xác thực tính đúng đắn và độc nhất của dữ liệu khách hàng trước khi lưu. |
| Tiền điều kiện | Hệ thống nhận yêu cầu lưu thông tin khách hàng từ chức năng Thêm mới hoặc Chỉnh sửa. |
| Dòng sự kiện chính | 1\. Hệ thống tiếp nhận thông tin khách hàng. 2\. Kiểm tra các điều kiện: Họ tên không bỏ trống, số điện thoại đúng định dạng 10 chữ số và không bị trùng với khách hàng khác. 3\. Trả về kết quả hợp lệ để tiến hành lưu dữ liệu. |
| Dòng sự kiện phụ | •Lỗi dữ liệu: Cảnh báo lỗi cụ thể ra màn hình (ví dụ: "Số điện thoại không hợp lệ" hoặc "SĐT đã được đăng ký"). |

#### 6\. Đặc tả Use Case: Tra cứu thông tin KH

| Thành phần | Nội dung chi tiết |
| ----- | ----- |
| Tóm tắt | Cho phép nhân viên bán hàng tìm kiếm nhanh hồ sơ khách hàng theo SĐT, họ tên hoặc mã thành viên. |
| Tiền điều kiện | Nhân viên bán hàng đã đăng nhập hệ thống. |
| Hậu điều kiện | Trả về danh sách khách hàng khớp với từ khóa tìm kiếm. |
| Dòng sự kiện chính | 1\. Nhân viên chọn chức năng Tra cứu thông tin KH. 2\. Nhập từ khóa tìm kiếm (SĐT hoặc tên) và nhấn Tìm kiếm. 3\. Hệ thống trả về kết quả danh sách khách hàng tương ứng. |
| Dòng sự kiện phụ | • Không tìm thấy: Hiển thị thông báo không tìm thấy khách hàng và gợi ý thêm mới hồ sơ. |

#### 7\. Đặc tả Use Case: Xem chi KH

| Thành phần | Nội dung chi tiết |
| ----- | ----- |
| Tóm tắt | Cho phép xem chi tiết thông tin hồ sơ của một khách hàng cụ thể (thứ hạng, điểm tích lũy, thông tin liên lạc). |
| Tiền điều kiện | Nhân viên đã thực hiện tra cứu và có danh sách kết quả khách hàng. |
| Hậu điều kiện | Bảng thông tin chi tiết hồ sơ khách hàng được hiển thị đầy đủ. |
| Dòng sự kiện chính | 1\. Nhân viên chọn một khách hàng từ kết quả tìm kiếm để kích hoạt Xem chi KH. 2\. Hệ thống truy vấn CSDL lấy thông tin chi tiết, hạng thành viên và số điểm tích lũy. 3\. Hiển thị thông tin lên màn hình giao diện. |
| Dòng sự kiện phụ | •Lỗi tải dữ liệu: Hiển thị thông báo không thể tải chi tiết hồ sơ khách hàng. |

#### 8\. Đặc tả Use Case: Tra cứu lịch sử mua hàng

| Thành phần | Nội dung chi tiết |
| ----- | ----- |
| Tóm tắt | Cho phép nhân viên xem lại toàn bộ danh sách hóa đơn giao dịch trước đây của khách hàng. |
| Tiền điều kiện | Nhân viên đã chọn sẵn hồ sơ khách hàng cần tra cứu lịch sử. |
| Hậu điều kiện | Danh sách lịch sử mua hàng của khách hàng được hiển thị. |
| Dòng sự kiện chính | 1\. Nhân viên chọn chức năng Tra cứu lịch sử mua hàng. 2\. Hệ thống truy vấn CSDL lấy toàn bộ danh sách hóa đơn theo thời gian giao dịch của khách hàng đó. 3\. Hiển thị danh sách hóa đơn lên màn hình và cho phép người dùng mở rộng các tính năng phụ. |
| Dòng sự kiện phụ | • Khách hàng chưa có giao dịch: Hiển thị thông báo khách hàng chưa phát sinh hóa đơn mua hàng nào. |

#### 9\. Đặc tả Use Case: Xem yêu cầu đổi trả

| Thành phần | Nội dung chi tiết |
| ----- | ----- |
| Tóm tắt | Cho phép xem chi tiết các lịch sử hoặc yêu cầu đổi/trả sách phát sinh từ giao dịch của khách hàng. |
| Tiền điều kiện | Nhân viên đang ở màn hình *Tra cứu lịch sử mua hàng* của khách hàng. |
| Hậu điều kiện | Hiển thị danh sách các phiếu đổi trả hàng liên quan đến khách hàng. |
| Dòng sự kiện chính | 1\. Nhân viên chọn kích hoạt tính năng Xem yêu cầu đổi trả từ màn hình lịch sử. 2\. Hệ thống truy vấn các phiếu đổi trả liên quan đến mã khách hàng. 3\. Hiển thị danh sách chi tiết các lần đổi/trả sách. |
| Dòng sự kiện phụ | • Không có lịch sử đổi trả: Hiển thị thông báo khách hàng chưa từng phát sinh yêu cầu đổi trả sách nào. |

#### 10\. Đặc tả Use Case: Theo dõi tổng chi tiêu & Tần suất mua

| Thành phần | Nội dung chi tiết |
| ----- | ----- |
| Tóm tắt | Cho phép phân tích, thống kê tổng số tiền khách hàng đã chi tiêu và tần suất ghé mua sắm tại cửa hàng. |
| Tiền điều kiện | Nhân viên đang ở màn hình *Tra cứu lịch sử mua hàng* của khách hàng. |
| Hậu điều kiện | Hiển thị các chỉ số tổng chi tiêu, số lượng đơn hàng và tần suất mua sắm của khách. |
| Dòng sự kiện chính | 1\. Nhân viên chọn tính năng Theo dõi tổng chi tiêu & Tần suất mua 2\. Hệ thống tự động tổng hợp dữ liệu từ toàn bộ hóa đơn đã mua của khách hàng. 3\. Tính toán tổng tiền chi tiêu, số lượng đơn và chu kỳ/tần suất mua sắm. 4\. Hiển thị kết quả thống kê trực quan lên màn hình. |
| Dòng sự kiện phụ | •Dữ liệu chưa đủ để tính toán: Hiển thị các chỉ số ở mức mặc định (0) đối với khách hàng mới mua lần đầu. |

