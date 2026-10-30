#### 1\. Đặc tả Use Case: Quản lý thể loại

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| Tóm tắt | Cho phép Nhân viên kho truy cập và quản lý tổng thể danh mục thể loại sách trong hệ thống. |
| Tiền điều kiện | Nhân viên kho đã đăng nhập thành công và mở màn hình Quản lý danh mục sách. |
| Hậu điều kiện | Hệ thống duy trì giao diện và trạng thái cập nhật mới nhất của cây danh mục thể loại sách. |
| Dòng sự kiện chính | 1\. Nhân viên kho chọn chức năng Quản lý thể loại. 2\. Hệ thống hiển thị giao diện quản lý kèm danh sách/cây danh mục các thể loại sách hiện có. 3\. Người dùng thực hiện chọn các thao tác nghiệp vụ tiếp theo (Thêm, sửa, xóa, tìm kiếm thể loại). 4\. Hệ thống phản hồi kết quả tương ứng. |
| Dòng sự kiện phụ | Mất kết nối CSDL:  Hệ thống thông báo lỗi kết nối và yêu cầu thử lại sau. |

#### 2\. Đặc tả Use Case: Tìm kiếm thể loại

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| Tóm tắt | Cho phép nhân viên kho tìm kiếm nhanh các thể loại sách theo tên hoặc mã thể loại. |
| Tiền điều kiện | Nhân viên kho đang ở giao diện *Quản lý thể loại*. |
| Hậu điều kiện | Hiển thị danh sách các thể loại thỏa mãn điều kiện tìm kiếm. |
| Dòng sự kiện chính | 1\. Nhân viên kho nhập từ khóa (tên hoặc mã thể loại) vào thanh tìm kiếm. 2\. Nhấn nút Tìm kiếm. 3\. Hệ thống truy vấn cơ sở dữ liệu và hiển thị danh sách kết quả phù hợp. |
| Dòng sự kiện phụ | • Không tìm thấy kết quả: Hệ thống hiển thị thông báo "Không tìm thấy thể loại phù hợp" và giữ nguyên danh sách gốc. |

#### 3\. Đặc tả Use Case: Cập nhật thể loại

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| Tóm tắt | Cho phép nhân viên kho thêm mới, chỉnh sửa thông tin hoặc xóa/khóa một thể loại sách. |
| Tiền điều kiện | Nhân viên kho đã truy cập vào mục *Quản lý thể loại*. |
| Hậu điều kiện | Thể loại sách được thêm mới, cập nhật thông tin hoặc thay đổi trạng thái trên cơ sở dữ liệu. |
| Dòng sự kiện chính | 1\. Nhân viên kho chọn thao tác Thêm mới, Chỉnh sửa hoặc Xóa thể loại. 2\. Hệ thống hiển thị form nhập liệu hoặc yêu cầu xác nhận. 3\. Nhân viên nhập/cập nhật thông tin thể loại và nhấn Lưu. 4\. Hệ thống kiểm tra dữ liệu, lưu vào CSDL và thông báo thành công. |
| Dòng sự kiện phụ | • Trùng tên thể loại: Hệ thống báo lỗi "Tên thể loại đã tồn tại" và yêu cầu nhập tên khác. • Xóa thể loại đang chứa sách: Hệ thống từ chối xóa và gợi ý chuyển sang trạng thái khóa/ngưng sử dụng. |

#### 4\. Đặc tả Use Case: Quản lý tác giả

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| Tóm tắt | Cho phép nhân viên kho quản lý toàn bộ hồ sơ thông tin của các tác giả. |
| Tiền điều kiện | Nhân viên kho đã đăng nhập thành công vào hệ thống. |
| Hậu điều kiện | Giao diện quản lý tác giả được hiển thị sẵn sàng cho các thao tác tiếp theo. |
| Dòng sự kiện chính | 1\. Nhân viên kho chọn chức năng Quản lý tác giả. 2\. Hệ thống hiển thị danh sách thông tin các tác giả (họ tên, bút danh, quốc tịch). 3\. Người dùng chọn các thao tác nghiệp vụ (tìm kiếm hoặc cập nhật tác giả). |
| Dòng sự kiện phụ | • Lỗi tải danh sách: Hệ thống hiển thị thông báo tải dữ liệu thất bại và cung cấp nút "Tải lại". |

#### 5\. Đặc tả Use Case: Tìm kiếm tác giả

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| Tóm tắt | Hỗ trợ nhân viên kho tìm kiếm thông tin tác giả theo tên, bút danh hoặc quốc tịch. |
| Tiền điều kiện | Nhân viên kho đang ở giao diện *Quản lý tác giả*. |
| Hậu điều kiện | Danh sách tác giả khớp với từ khóa tìm kiếm được hiển thị. |
| Dòng sự kiện chính | 1\. Nhân viên kho nhập thông tin tìm kiếm vào ô tra cứu. 2\. Nhấn Tìm kiếm. 3\. Hệ thống lọc và trả về danh sách tác giả thỏa mãn. |
| Dòng sự kiện phụ | • Không tìm thấy: Hệ thống hiển thị thông báo "Không tìm thấy tác giả tương ứng". |

#### 6\. Đặc tả Use Case: Cập nhật tác giả

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| Tóm tắt | Cho phép thêm mới, chỉnh sửa tiểu sử hoặc xóa hồ sơ tác giả. |
| Tiền điều kiện | Nhân viên kho đang mở giao diện *Quản lý tác giả*. |
| Hậu điều kiện | Hồ sơ tác giả được ghi nhận, chỉnh sửa hoặc xóa khỏi hệ thống. |
| Dòng sự kiện chính | 1\. Nhân viên kho chọn hành động Thêm mới, Sửa hoặc Xóa tác giả. 2\. Nhập/chỉnh sửa thông tin chi tiết (Họ tên, bút danh, tiểu sử, quốc tịch). 3\. Nhấn Lưu để xác nhận. 4\. Hệ thống kiểm tra hợp lệ, lưu vào CSDL và thông báo thành công. |
| Dòng sự kiện phụ | • Bỏ trống họ tên: Hệ thống báo lỗi yêu cầu điền đầy đủ họ tên tác giả. |

#### 7\. Đặc tả Use Case: Quản lý NXB

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| Tóm tắt | Quản lý danh bạ thông tin các Nhà xuất bản hợp tác với cửa hàng. |
| Tiền điều kiện | Nhân viên kho đã đăng nhập vào hệ thống. |
| Hậu điều kiện | Giao diện danh bạ Nhà xuất bản được hiển thị. |
| Dòng sự kiện chính | 1\. Nhân viên kho chọn chức năng Quản lý NXB. 2\. Hệ thống hiển thị danh sách các đơn vị xuất bản. 3\. Người dùng tiến hành chọn tìm kiếm hoặc cập nhật NXB. |
| Dòng sự kiện phụ | • Lỗi hệ thống: Hiển thị thông báo khi không thể kết nối tới dữ liệu NXB. |

#### 8\. Đặc tả Use Case: Tìm kiếm nhà xuất bản

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| Tóm tắt | Cho phép tìm kiếm hồ sơ nhà xuất bản theo tên NXB, số điện thoại hoặc mã NXB. |
| Tiền điều kiện | Nhân viên kho đang ở giao diện *Quản lý NXB*. |
| Hậu điều kiện | Hiển thị thông tin NXB cần tìm. |
| Dòng sự kiện chính | 1\. Nhân viên kho nhập từ khóa tìm kiếm. 2\. Nhấn Tìm kiếm. 3\. Hệ thống tra cứu và trả về kết quả Nhà xuất bản phù hợp. |
| Dòng sự kiện phụ | • Không có kết quả: Thông báo không tìm thấy NXB thỏa mãn điều kiện. |

#### 9\. Đặc tả Use Case: Cập nhật nhà xuất bản

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| Tóm tắt | Thêm mới, chỉnh sửa thông tin liên lạc (địa chỉ, số điện thoại, người đại diện) hoặc xóa NXB. |
| Tiền điều kiện | Nhân viên kho đang ở giao diện *Quản lý NXB*. |
| Hậu điều kiện | Dữ liệu Nhà xuất bản được cập nhật chính xác trên CSDL. |
| Dòng sự kiện chính | 1\. Nhân viên kho chọn Thêm mới, Chỉnh sửa hoặc Xóa NXB. 2\. Nhập các thông tin chi tiết vào biểu mẫu. 3\. Nhấn Lưu. 4\. Hệ thống kiểm tra tính hợp lệ, cập nhật vào CSDL và báo thành công. |
| Dòng sự kiện phụ | • Sai định dạng SĐT/Email: Hệ thống báo lỗi và yêu cầu nhập lại đúng định dạng. |

