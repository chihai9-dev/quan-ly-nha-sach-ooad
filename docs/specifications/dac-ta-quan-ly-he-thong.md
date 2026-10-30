1\. Use Case: Đăng nhập 

| Tóm tắt: Usecase bắt đầu khi Người dùng hệ thống (bao gồm cả Quản trị viên) nhập thông tin tài khoản và mật khẩu để xác thực quyền truy cập vào hệ thống.  |
| :---- |
| **Dòng sự kiện chính:** Người dùng truy cập vào trang đăng nhập của hệ thống. Hệ thống hiển thị biểu mẫu yêu cầu nhập Tên đăng nhập/Email và Mật khẩu. Người dùng nhập thông tin đăng nhập và nhấn nút "Đăng nhập". Hệ thống kiểm tra thông tin tài khoản trong cơ sở dữ liệu. Thông tin chính xác, hệ thống khởi tạo phiên làm việc (session), điều hướng người dùng tới màn hình làm việc tương ứng với quyền hạn và thông báo đăng nhập thành công. |
| **Dòng sự kiện phụ:** *Sai thông tin đăng nhập:* Nếu tên đăng nhập hoặc mật khẩu không chính xác, hệ thống hiển thị thông báo lỗi "Tên đăng nhập hoặc mật khẩu không đúng" và yêu cầu nhập lại. *Tài khoản bị khóa:* Nếu tài khoản đang ở trạng thái bị vô hiệu hóa hoặc nhập sai mật khẩu quá số lần quy định, hệ thống thông báo khóa tài khoản và từ chối đăng nhập. *Chọn quên mật khẩu:* Tại màn hình đăng nhập, người dùng có thể kích hoạt use case mở rộng "Quên mật khẩu". |
| **Tiền điều kiện (pre-condition):** Người dùng đã có tài khoản tồn tại trên hệ thống và thiết bị có kết nối mạng.  |
| **Hậu điều kiện (post-condition):** Người dùng đăng nhập thành công vào hệ thống và được điều hướng đến trang chủ/trang chức năng phù hợp.  |

2\. Use Case: Quên mật khẩu 

| Tóm tắt: Usecase bắt đầu khi Người dùng hệ thống chọn chức năng quên mật khẩu.Cho phép thiết lập lại mật khẩu mới khi quên thông tin đăng nhập.  |
| :---- |
| **Dòng sự kiện chính:** Tại màn hình Đăng nhập, người dùng nhấn vào liên kết "Quên mật khẩu". Hệ thống hiển thị giao diện yêu cầu nhập Email hoặc Tên tài khoản đã đăng ký. Người dùng nhập thông tin và nhấn "Gửi yêu cầu". Hệ thống kích hoạt use case "Xác thực OTP / Email" để kiểm tra danh tính người dùng. Sau khi xác thực thành công, hệ thống hiển thị biểu mẫu nhập mật khẩu mới. Người dùng nhập mật khẩu mới, xác nhận lại mật khẩu và nhấn "Lưu". Hệ thống cập nhật mật khẩu mới vào cơ sở dữ liệu, thông báo thành công và chuyển hướng về màn hình Đăng nhập. |
| **Dòng sự kiện phụ:** *Email/Tài khoản không tồn tại:* Nếu thông tin nhập không có trong hệ thống, hệ thống hiển thị thông báo "Tài khoản không tồn tại trên hệ thống". *Mật khẩu mới không khớp:* Nếu mật khẩu xác nhận không trùng khớp với mật khẩu mới, hệ thống hiển thị thông báo lỗi và yêu cầu nhập lại. *Xác thực không thành công:* Use case "Xác thực OTP / Email" thất bại, quy trình đặt lại mật khẩu dừng lại. |
| **Tiền điều kiện (pre-condition):** Người dùng đang ở màn hình Đăng nhập của hệ thống.  |
| **Hậu điều kiện (post-condition):** Mật khẩu tài khoản của người dùng được cập nhật mới trên hệ thống hoặc giữ nguyên nếu quy trình thất bại.  |

3\. Use Case: Xác thực OTP / Email 

| Tóm tắt:Usecase bắt đầu sau khi người dùng hệ thống kích hoạt usecase quên mật khẩu.Thực hiện gửi và kiểm tra mã xác thực một lần (OTP) hoặc liên kết xác nhận qua Email để xác minh danh tính người dùng. |
| :---- |
| **Dòng sự kiện chính:** Use case được kích hoạt tự động từ use case Quên mật khẩu. Hệ thống tạo mã xác thực ngẫu nhiên và gửi mã tới Email đã đăng ký của người dùng kèm thời gian hết hạn. Hệ thống hiển thị màn hình yêu cầu nhập mã xác thực OTP. Người dùng nhận mã, điền vào ô xác thực và nhấn "Xác nhận". Hệ thống kiểm tra mã OTP: mã đúng và còn hiệu lực, trả về kết quả xác thực thành công cho use case gọi tiếp tục thực hiện. |
| **Dòng sự kiện phụ:** *Mã OTP sai:* Người dùng nhập sai mã, hệ thống báo lỗi "Mã xác thực không chính xác" và cho phép nhập lại. *Mã OTP hết hạn:* Người dùng nhập sau thời gian hiệu lực quy định, hệ thống thông báo "Mã xác thực đã hết hạn" và cung cấp nút "Gửi lại mã". *Vượt quá số lần gửi/nhập:* Người dùng nhập sai quá số lần quy định, hệ thống hủy phiên xác thực và bắt đầu lại từ đầu. |
| **Tiền điều kiện (pre-condition):** Người dùng đã cung cấp đúng Email/Tài khoản hợp lệ trong use case Quên mật khẩu.  |
| **Hậu điều kiện (post-condition):** Danh tính người dùng được xác minh hợp lệ (hoặc phiên xác thực bị hủy bỏ).  |

4\. Use Case: Đăng xuất 

| Tóm tắt:Usecase bắt đầu khi Người dùng hệ thống bấm vào nút đăng xuất.Hệ thống sẽ kết thúc phiên làm việc hiện tại và quay trở về trạng thái Đăng nhập để bảo mật thông tin.  |
| :---- |
| **Dòng sự kiện chính:** Người dùng nhấn vào nút/tùy chọn "Đăng xuất" trên giao diện hệ thống. Hệ thống hủy bỏ phiên làm việc (session/token) hiện tại của người dùng. Hệ thống tự động chuyển hướng giao diện về màn hình "Đăng nhập" (kích hoạt use case Đăng nhập). |
| **Dòng sự kiện phụ:** *Hủy xác nhận đăng xuất:* Nếu hệ thống bật hộp thoại xác nhận "Bạn có muốn đăng xuất không?", người dùng chọn "Không" thì phiên làm việc tiếp tục duy trì bình thường. |
| **Tiền điều kiện (pre-condition):** Người dùng đang đăng nhập và có phiên làm việc hợp lệ trong hệ thống.  |
| **Hậu điều kiện (post-condition):** Phiên làm việc bị đóng hoàn toàn, người dùng bị đưa về màn hình Đăng nhập và không thể truy cập các tài nguyên nội bộ khi chưa đăng nhập lại.  |

5\. Use Case: Phân quyền hệ thống 

| Tóm tắt: Usecase bắt đầu khi Quản trị viên chọn chức năng phân quyền hệ thống .Cho phép thiết lập, chỉnh sửa và gán vai trò/quyền hạn truy cập chức năng cho các nhóm người dùng trong hệ thống.  |
| :---- |
| **Dòng sự kiện chính:** Quản trị viên truy cập vào chức năng "Phân quyền hệ thống". Hệ thống kiểm tra phiên đăng nhập hợp lệ của Quản trị viên (gọi use case Đăng nhập nếu phiên làm việc chưa xác thực hoặc yêu cầu tái xác thực). Hệ thống hiển thị danh sách vai trò (roles) và các nhóm chức năng/quyền hạn tương ứng. Quản trị viên chọn vai trò/tài khoản cần phân quyền, tích chọn/bỏ chọn các quyền truy cập (Xem, Thêm, Sửa, Xóa, Phê duyệt...). Quản trị viên nhấn nút "Lưu thay đổi". Hệ thống cập nhật bảng phân quyền vào cơ sở dữ liệu và hiển thị thông báo "Cập nhật quyền hạn thành công". |
| **Dòng sự kiện phụ:** *Phiên đăng nhập hết hạn:* Hệ thống yêu cầu Quản trị viên đăng nhập lại (thông qua use case Đăng nhập) trước khi cho phép tiếp tục thao tác. *Hủy bỏ thao tác:* Quản trị viên bấm "Hủy", các quyền hạn vừa điều chỉnh sẽ không được lưu. |
| **Tiền điều kiện (pre-condition):** Người thực hiện phải là Quản trị viên và đã đăng nhập thành công vào hệ thống với quyền admin cao nhất.  |
| **Hậu điều kiện (post-condition):** Chính sách phân quyền mới được áp dụng cho các tài khoản người dùng liên quan trên toàn hệ thống.  |

