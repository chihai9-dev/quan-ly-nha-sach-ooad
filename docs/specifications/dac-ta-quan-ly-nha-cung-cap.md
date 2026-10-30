**1\. Use Case: Tra cứu thông tin Nhà cung cấp** 	

| Mục | Nội dung |
| ----- | ----- |
| **Tên Use Case** | Tra cứu thông tin Nhà cung cấp |
| **Tóm tắt** | Usecase bắt đầu khi Quản lý chọn chức năng tra cứu thông tin Nhà cung cấp. Hệ thống cho phép tìm kiếm Nhà cung cấp theo các tiêu chí như mã Nhà cung cấp, tên đơn vị hoặc số điện thoại và hiển thị danh sách kết quả phù hợp. |
| **Dòng sự kiện chính** | 1\. Quản lý chọn chức năng "Tra cứu thông tin Nhà cung cấp". 2\. Hệ thống kiểm tra trạng thái đăng nhập của Quản lý thông qua use case "Đăng nhập". 3\. Hệ thống hiển thị giao diện tra cứu và danh sách Nhà cung cấp hiện có. 4\. Quản lý nhập một hoặc nhiều tiêu chí tìm kiếm như mã Nhà cung cấp, tên đơn vị hoặc số điện thoại. 5\. Quản lý nhấn nút "Tìm kiếm". 6\. Hệ thống truy vấn dữ liệu Nhà cung cấp. 7\. Hệ thống hiển thị danh sách Nhà cung cấp thỏa mãn điều kiện tìm kiếm. |
| **Dòng sự kiện phụ** | \- Không tìm thấy kết quả: Nếu không có Nhà cung cấp nào phù hợp với tiêu chí, hệ thống hiển thị thông báo "Không tìm thấy Nhà cung cấp phù hợp" và cho phép nhập lại điều kiện tìm kiếm. \- Phiên đăng nhập không hợp lệ: Hệ thống yêu cầu Quản lý thực hiện lại use case "Đăng nhập". |
| **Tiền điều kiện**  | Quản lý có tài khoản hợp lệ và có quyền truy cập chức năng Quản lý Nhà cung cấp. |
| **Hậu điều kiện**  | Danh sách Nhà cung cấp phù hợp với điều kiện tìm kiếm được hiển thị. |

**2\. Use Case: Xem chi tiết hồ sơ Nhà cung cấp** 

| Mục | Nội dung |
| ----- | ----- |
| **Tên Use Case** | Xem chi tiết hồ sơ Nhà cung cấp |
| **Tóm tắt** | Usecase bắt đầu khi Quản lý chọn một Nhà cung cấp từ kết quả tra cứu và yêu cầu xem chi tiết. Cho phép xem đầy đủ thông tin hồ sơ và trạng thái cung cấp hàng của Nhà cung cấp. |
| **Dòng sự kiện chính** | 1\. Quản lý chọn một Nhà cung cấp từ danh sách kết quả của use case "Tra cứu thông tin Nhà cung cấp". 2\. Quản lý nhấn "Xem chi tiết". 3\. Hệ thống truy xuất thông tin Nhà cung cấp được chọn. 4\. Hệ thống hiển thị chi tiết hồ sơ gồm mã Nhà cung cấp, tên đơn vị, địa chỉ, số điện thoại, email, thông tin tài khoản và trạng thái hợp tác. 5\. Quản lý xem thông tin và đóng giao diện chi tiết để quay lại danh sách. |
| **Dòng sự kiện phụ** | \- Không tải được dữ liệu: Nếu xảy ra lỗi khi truy xuất dữ liệu, hệ thống thông báo không thể tải hồ sơ và giữ người dùng tại danh sách Nhà cung cấp. \- Hồ sơ không còn tồn tại: Nếu dữ liệu Nhà cung cấp đã bị thay đổi hoặc không còn tồn tại, hệ thống thông báo và tải lại danh sách. |
| **Tiền điều kiện**  | Quản lý đang ở màn hình kết quả của use case "Tra cứu thông tin Nhà cung cấp" và đã chọn một Nhà cung cấp. |
| **Hậu điều kiện**  | Thông tin chi tiết của Nhà cung cấp được hiển thị. |

**3\. Use Case: Tra cứu lịch sử nhập hàng** 

| Mục | Nội dung |
| ----- | ----- |
| **Tên Use Case** | Tra cứu lịch sử nhập hàng |
| **Tóm tắt** | Usecase bắt đầu khi Quản lý chọn chức năng tra cứu lịch sử nhập hàng. Hệ thống cho phép theo dõi toàn bộ các giao dịch nhập sách của từng Nhà cung cấp, bao gồm các phiếu nhập, ngày nhập, tổng giá trị và trạng thái đơn. |
| **Dòng sự kiện chính** | 1\. Quản lý chọn chức năng "Tra cứu lịch sử nhập hàng". 2\. Hệ thống kiểm tra trạng thái đăng nhập thông qua use case "Đăng nhập". 3\. Hệ thống hiển thị giao diện tra cứu lịch sử nhập hàng. 4\. Quản lý chọn Nhà cung cấp hoặc nhập điều kiện cần tra cứu. 5\. Quản lý nhấn nút "Tìm kiếm". 6\. Hệ thống truy vấn lịch sử nhập hàng tương ứng. 7\. Hệ thống hiển thị danh sách các phiếu nhập gồm mã phiếu, ngày nhập, tổng giá trị và trạng thái. |
| **Dòng sự kiện phụ** | \- Không có lịch sử nhập hàng: Nếu Nhà cung cấp chưa có giao dịch nhập hàng, hệ thống thông báo "Không có dữ liệu nhập hàng". \- Không tìm thấy Nhà cung cấp: Hệ thống thông báo không tìm thấy dữ liệu phù hợp và cho phép Quản lý nhập lại điều kiện. \- Phiên đăng nhập hết hạn: Hệ thống yêu cầu thực hiện lại use case "Đăng nhập". |
| **Tiền điều kiện**  | Quản lý có quyền truy cập chức năng Quản lý Nhà cung cấp. |
| **Hậu điều kiện** | Danh sách lịch sử nhập hàng của Nhà cung cấp được hiển thị. |

**4\. Use Case: Xem chi tiết phiếu nhập** 

| Mục | Nội dung |
| ----- | ----- |
| **Tên Use Case** | Xem chi tiết phiếu nhập |
| **Tóm tắt** | Usecase bắt đầu khi Quản lý chọn một phiếu nhập trong danh sách lịch sử nhập hàng. Cho phép xem thông tin chi tiết của đợt nhập hàng tương ứng. |
| **Dòng sự kiện chính** | 1\. Quản lý chọn một phiếu nhập từ kết quả của use case "Tra cứu lịch sử nhập hàng". 2\. Quản lý nhấn "Xem chi tiết". 3\. Hệ thống truy xuất dữ liệu của phiếu nhập. 4\. Hệ thống hiển thị thông tin chi tiết gồm mã phiếu, Nhà cung cấp, ngày nhập, người lập phiếu, danh sách sách, số lượng, đơn giá nhập, chiết khấu và tổng giá trị. 5\. Quản lý xem thông tin và đóng màn hình chi tiết. |
| **Dòng sự kiện phụ** | \- Lỗi tải phiếu nhập: Hệ thống thông báo không thể tải thông tin phiếu nhập và đưa Quản lý trở về danh sách lịch sử. \- Phiếu nhập không tồn tại: Hệ thống thông báo dữ liệu không còn tồn tại và cập nhật lại danh sách. |
| **Tiền điều kiện**  | Quản lý đang xem kết quả của use case "Tra cứu lịch sử nhập hàng" và đã chọn một phiếu nhập. |
| **Hậu điều kiện**  | Chi tiết phiếu nhập được hiển thị đầy đủ. |

**5\. Use Case: Cập nhật thông tin Nhà cung cấp** 

| Mục | Nội dung |
| ----- | ----- |
| **Tên Use Case** | **Cập nhật thông tin Nhà cung cấp** |
| **Tóm tắt** | Usecase bắt đầu khi Quản lý chọn chức năng cập nhật thông tin Nhà cung cấp. Cho phép thêm mới hồ sơ Nhà cung cấp hoặc chỉnh sửa thông tin, trạng thái hợp tác của Nhà cung cấp hiện có. |
| **Dòng sự kiện chính** | 1\. Quản lý chọn chức năng "Cập nhật thông tin Nhà cung cấp". 2\. Hệ thống kiểm tra trạng thái đăng nhập thông qua use case "Đăng nhập". 3\. Hệ thống hiển thị danh sách Nhà cung cấp cùng các chức năng thêm mới hoặc chỉnh sửa. 4\. Quản lý lựa chọn thao tác cần thực hiện. 5\. Hệ thống hiển thị biểu mẫu thông tin Nhà cung cấp tương ứng. 6\. Quản lý nhập mới hoặc chỉnh sửa các thông tin cần thiết. 7\. Quản lý nhấn nút "Lưu/Cập nhật". 8\. Hệ thống thực hiện use case "Kiểm tra tính hợp lệ dữ liệu". 9\. Nếu dữ liệu hợp lệ, hệ thống lưu thông tin vào cơ sở dữ liệu. 10\. Hệ thống thông báo "Cập nhật thông tin Nhà cung cấp thành công" và tải lại danh sách. |
| **Dòng sự kiện phụ** | \- Dữ liệu không hợp lệ: Use case "Kiểm tra tính hợp lệ dữ liệu" trả về lỗi, hệ thống đánh dấu các trường sai và yêu cầu Quản lý chỉnh sửa. \- Thông tin bị trùng: Nếu mã Nhà cung cấp, số điện thoại hoặc thông tin cần đảm bảo duy nhất đã tồn tại, hệ thống thông báo trùng dữ liệu và không lưu. \- Hủy thao tác: Quản lý chọn "Hủy", hệ thống bỏ các thay đổi chưa lưu. \- Phiên đăng nhập hết hạn: Hệ thống yêu cầu Quản lý đăng nhập lại. |
| **Tiền điều kiện**  | Quản lý có quyền cập nhật dữ liệu Nhà cung cấp. |
| **Hậu điều kiện**  | Thông tin Nhà cung cấp mới hoặc các thay đổi được lưu thành công; nếu thao tác thất bại thì dữ liệu cũ được giữ nguyên. |

**6\. Use Case: Kiểm tra tính hợp lệ dữ liệu** 

| Mục | Nội dung |
| ----- | ----- |
| **Tên Use Case** | Kiểm tra tính hợp lệ dữ liệu |
| **Tóm tắt** | Usecase được kích hoạt khi Quản lý gửi yêu cầu lưu hoặc cập nhật thông tin Nhà cung cấp. Hệ thống kiểm tra tính đầy đủ và hợp lệ của dữ liệu trước khi ghi vào cơ sở dữ liệu. |
| **Dòng sự kiện chính** | 1\. Use case được tự động kích hoạt từ use case "Cập nhật thông tin Nhà cung cấp". 2\. Hệ thống kiểm tra các trường thông tin bắt buộc. 3\. Hệ thống kiểm tra định dạng dữ liệu như số điện thoại và email. 4\. Hệ thống kiểm tra các giá trị dữ liệu theo quy tắc của hệ thống. 5\. Hệ thống kiểm tra các thông tin không được phép trùng lặp. 6\. Nếu dữ liệu đạt yêu cầu, hệ thống trả về kết quả "Hợp lệ" cho use case gọi tiếp tục lưu dữ liệu. |
| **Dòng sự kiện phụ** | \- Thiếu thông tin bắt buộc: Hệ thống trả về danh sách các trường còn thiếu. \- Sai định dạng: Hệ thống trả về lỗi tại trường dữ liệu không đúng định dạng. \- Trùng dữ liệu: Hệ thống trả về thông tin dữ liệu bị trùng và dừng quá trình lưu. |
| **Tiền điều kiện**  | Quản lý đã nhập hoặc chỉnh sửa dữ liệu Nhà cung cấp và gửi yêu cầu lưu/cập nhật. |
| **Hậu điều kiện**  | Kết quả kiểm tra Hợp lệ hoặc danh sách lỗi được trả về cho use case "Cập nhật thông tin Nhà cung cấp". |

