1\. Use Case: Tra cứu thông tin nhân viên 

| Tóm tắt:Usecase bắt đầu khi Quản lý chọn chức năng tra cứu thông tin nhân viên. Hệ thống cho phép tìm kiếm và xem danh sách nhân viên theo các điều kiện lọc (họ tên, mã nhân viên, phòng ban, chức vụ).  |
| :---- |
| **Dòng sự kiện chính:** Quản lý chọn chức năng "Tra cứu thông tin nhân viên" trên hệ thống. Hệ thống hiển thị giao diện tìm kiếm và danh sách nhân viên mặc định. Quản lý nhập thông tin/tiêu chí cần tìm kiếm và bấm nút "Tìm kiếm". Hệ thống truy vấn cơ sở dữ liệu và hiển thị danh sách các nhân viên thỏa mãn điều kiện. |
| **Dòng sự kiện phụ:** *Không tìm thấy kết quả:* Nếu không có nhân viên nào khớp với tiêu chí tìm kiếm, hệ thống hiển thị thông báo "Không tìm thấy kết quả phù hợp" và giữ nguyên giao diện để người dùng nhập lại. |
| **Tiền điều kiện (pre-condition):** Quản lý đã đăng nhập thành công vào hệ thống và có quyền truy cập vào phân hệ Quản lý nhân viên.  |
| **Hậu điều kiện (post-condition):** Danh sách nhân viên phù hợp được hiển thị trên màn hình . |

### 2\. Use Case: Xem chi tiết hồ sơ nhân viên

| Tóm tắt: Usecase bắt đầu khi Quản lý chọn chức năng xem chi tiết hồ sơ nhân viên.Cho phép xem toàn bộ thông tin chi tiết về lý lịch, hợp đồng, bằng cấp và công việc của một nhân viên được chọn từ danh sách tra cứu.  |
| :---- |
| **Dòng sự kiện chính:** Quản lý chọn một nhân viên cụ thể từ danh sách kết quả tra cứu và nhấn "Xem chi tiết". Hệ thống truy xuất và hiển thị toàn bộ hồ sơ chi tiết của nhân viên đó. Quản lý xem thông tin và đóng màn hình chi tiết để quay lại danh sách. |
| **Dòng sự kiện phụ:** *Lỗi tải dữ liệu:* Nếu không tải được thông tin nhân viên do lỗi đường truyền, hệ thống hiển thị thông báo lỗi và đưa người dùng trở lại màn hình danh sách. |
| **Tiền điều kiện (pre-condition):** Quản lý đang ở màn hình hiển thị danh sách của use case "Tra cứu thông tin nhân viên" và đã chọn một nhân viên cụ thể.  |
| **Hậu điều kiện (post-condition):** Thông tin hồ sơ chi tiết của nhân viên được hiển thị đầy đủ trên màn hình.  |

3\. Use Case: Cập nhật thông tin nhân viên 

| Tóm tắt: Usecase bắt đầu khi Quản lý bấm vào chức năng cập nhật thông tin nhân viên. Cho phép thực hiện các thao tác thay đổi dữ liệu nhân sự bao gồm thêm mới, chỉnh sửa hoặc xóa nhân viên.  |
| :---- |
| **Dòng sự kiện chính:** Quản lý chọn chức năng "Cập nhật thông tin nhân viên". Hệ thống hiển thị danh sách nhân viên hiện tại cùng các tùy chọn chức năng: Thêm mới, Chỉnh sửa, Xóa. Quản lý chọn thao tác tương ứng để thực hiện (kích hoạt mở rộng sang use case Thêm mới, Chỉnh sửa hoặc Xóa nhân viên). |
| **Dòng sự kiện phụ:** *Hệ thống gián đoạn kết nối:* Nếu mất kết nối cơ sở dữ liệu, hệ thống báo lỗi không tải được dữ liệu và đề nghị tải lại trang. |
| **Tiền điều kiện (pre-condition):** Quản lý đã đăng nhập vào hệ thống và được phân quyền chỉnh sửa dữ liệu nhân sự.  |
| **Hậu điều kiện (post-condition):** Giao diện quản lý và các nút thao tác nghiệp vụ được hiển thị sẵn sàng cho người dùng.  |

4\. Use Case: Thêm mới nhân viên 

| Tóm tắt: Usecase bắt đầu khi Quản lý chọn chức năng thêm mới nhân viên. Cho phép nhập và ghi nhận thông tin của một nhân viên mới vào cơ sở dữ liệu hệ thống (mở rộng từ Cập nhật thông tin nhân viên và bao gồm Kiểm tra tính hợp lệ dữ liệu).  |
| :---- |
| **Dòng sự kiện chính:** Quản lý nhấn nút "Thêm mới" từ màn hình Cập nhật thông tin nhân viên. Hệ thống hiển thị biểu mẫu tiếp nhận thông tin nhân viên mới. Quản lý điền đầy đủ các thông tin nhân viên (họ tên, ngày sinh, CCCD, chức vụ, email, phòng ban...) và nhấn "Lưu". Hệ thống gọi thực thi use case "Kiểm tra tính hợp lệ dữ liệu". Dữ liệu hợp lệ, hệ thống tiến hành lưu bản ghi mới vào cơ sở dữ liệu và hiển thị thông báo "Thêm mới nhân viên thành công". Danh sách nhân viên được cập nhật lại với bản ghi vừa thêm. |
| **Dòng sự kiện phụ:** *Dữ liệu không hợp lệ:* Use case "Kiểm tra tính hợp lệ dữ liệu" trả về lỗi, hệ thống đánh dấu các trường nhập sai hoặc thiếu và yêu cầu người dùng sửa lại. *Trùng lặp dữ liệu:* Nếu mã nhân viên hoặc CCCD/Email đã tồn tại trong hệ thống, hệ thống hiển thị thông báo trùng lặp và không lưu. *Hủy bỏ thao tác:* Quản lý chọn "Hủy", hệ thống đóng biểu mẫu và không lưu dữ liệu. |
| **Tiền điều kiện (pre-condition):** Quản lý đang ở giao diện use case "Cập nhật thông tin nhân viên".  |
| **Hậu điều kiện (post-condition):** Hồ sơ nhân viên mới được tạo và lưu trữ thành công trong cơ sở dữ liệu.  |

5\. Use Case: Chỉnh sửa thông tin nhân viên 

| Tóm tắt: Usecase bắt đầu khi Quản lý chọn chức năng chỉnh sửa thông tin nhân viên. Cho phép  cập nhật lại các thông tin của một nhân viên hiện có.  |
| :---- |
| **Dòng sự kiện chính:** Quản lý chọn nhân viên cần cập nhật và nhấn nút "Chỉnh sửa". Hệ thống tải dữ liệu hiện tại của nhân viên lên biểu mẫu chỉnh sửa. Quản lý sửa đổi các thông tin cần thiết và bấm nút "Cập nhật". Hệ thống gọi thực thi use case "Kiểm tra tính hợp lệ dữ liệu". Dữ liệu hợp lệ, hệ thống cập nhật các thay đổi vào cơ sở dữ liệu và thông báo "Cập nhật thành công". |
| **Dòng sự kiện phụ:** *Dữ liệu chỉnh sửa không hợp lệ:* Use case "Kiểm tra tính hợp lệ dữ liệu" trả về kết quả lỗi, hệ thống hiển thị thông báo chi tiết lỗi và yêu cầu điều chỉnh. *Hủy bỏ thao tác:* Quản lý nhấn "Hủy", hệ thống hoàn nguyên các thay đổi chưa lưu và thoát biểu mẫu. |
| **Tiền điều kiện (pre-condition):** Nhân viên cần chỉnh sửa tồn tại trong hệ thống và đã được Quản lý lựa chọn.  |
| **Hậu điều kiện (post-condition):** Dữ liệu thay đổi của nhân viên được lưu thành công vào cơ sở dữ liệu.  |

6\. Use Case: Xóa nhân viên 

| Tóm tắt: Usecase bắt đầu khi Quản lý chọn chức năng xóa hồ sơ nhân viên. Cho phép xóa nhân viên đó khỏi danh sách nhân viên.  |
| :---- |
| **Dòng sự kiện chính:** Quản lý chọn một hoặc nhiều nhân viên cần xóa và nhấn nút "Xóa". Hệ thống hiển thị hộp thoại xác nhận: "Bạn có chắc chắn muốn xóa nhân viên này không?". Quản lý chọn "Xác nhận". Hệ thống thực hiện xóa bản ghi (hoặc cập nhật trạng thái ngừng hoạt động) trong cơ sở dữ liệu. Hệ thống thông báo "Xóa nhân viên thành công" và cập nhật lại danh sách hiển thị. |
| **Dòng sự kiện phụ:** *Hủy thao tác xóa:* Quản lý nhấn "Hủy" trên hộp thoại xác nhận, hệ thống giữ nguyên trạng thái dữ liệu. *Ràng buộc dữ liệu:* Nếu nhân viên có ràng buộc dữ liệu không thể xóa trực tiếp (như lịch sử chấm công, hợp đồng, bảng lương liên kết), hệ thống hiển thị cảnh báo từ chối xóa và gợi ý đổi trạng thái sang "Đã nghỉ việc". |
| **Tiền điều kiện (pre-condition):** Quản lý đã chọn nhân viên cần xóa trên danh sách của use case "Cập nhật thông tin nhân viên".  |
| **Hậu điều kiện (post-condition):** Nhân viên được xóa khỏi danh sách hoặc được cập nhật trạng thái vô hiệu hóa thành công.  |

7\. Use Case: Kiểm tra tính hợp lệ dữ liệu 

| Tóm tắt: Usecase bắt đầu sau khi quản lý thêm mới hoặc chỉnh sửa.Hệ thống thực hiện kiểm tra, xác thực tính chính xác và đầy đủ của thông tin nhân viên trước khi thực hiện ghi dữ liệu (được gọi tự động bởi use case Thêm mới và Chỉnh sửa thông tin nhân viên).  |
| :---- |
| **Dòng sự kiện chính:** Use case được tự động kích hoạt khi Quản lý gửi yêu cầu Lưu/Cập nhật dữ liệu từ biểu mẫu. Hệ thống kiểm tra tính bắt buộc của các trường dữ liệu (không được bỏ trống). Hệ thống kiểm tra định dạng dữ liệu (email đúng định dạng, số điện thoại, ngày tháng năm hợp lệ). Hệ thống kiểm tra logic dữ liệu nghiệp vụ (ví dụ: ngày vào làm phải sau ngày sinh, đủ độ tuổi lao động). Dữ liệu đạt yêu cầu, trả về kết quả hợp lệ để use case gọi tiếp tục quy trình lưu dữ liệu. |
| **Dòng sự kiện phụ:** *Dữ liệu vi phạm quy tắc:* Nếu có bất kỳ trường nào vi phạm quy tắc kiểm tra, hệ thống ghi nhận chi tiết lỗi, ngừng tiến trình lưu và trả về danh sách lỗi tương ứng cho use case gọi để cảnh báo cho người dùng. |
| **Tiền điều kiện (pre-condition):** Dữ liệu nhân viên đã được nhập trên biểu mẫu và có tín hiệu gửi yêu cầu lưu/cập nhật.  |
| **Hậu điều kiện (post-condition):** Kết quả kiểm tra (Hợp lệ hoặc Danh sách lỗi) được phản hồi lại cho use case gọi.  |

