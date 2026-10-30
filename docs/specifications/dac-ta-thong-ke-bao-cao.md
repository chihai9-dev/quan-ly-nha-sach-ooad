**1\. Use Case: Thống kê doanh thu**

| Mục | Nội dung |
| ----- | ----- |
| **Tóm tắt** | Usecase bắt đầu khi Quản lý chọn chức năng thống kê doanh thu. Hệ thống cho phép tổng hợp và trực quan hóa doanh thu bán hàng theo khoảng thời gian, hình thức thanh toán hoặc nhân viên bán hàng. |
| **Dòng sự kiện chính** | 1\. Quản lý chọn chức năng "Thống kê doanh thu". 2\. Hệ thống kiểm tra trạng thái đăng nhập của Quản lý thông qua use case "Đăng nhập". 3\. Hệ thống hiển thị giao diện thống kê doanh thu và các tiêu chí lọc. 4\. Quản lý chọn khoảng thời gian cần thống kê như ngày, tháng, quý hoặc năm và các tiêu chí liên quan. 5\. Quản lý nhấn nút "Thống kê". 6\. Hệ thống truy xuất dữ liệu bán hàng tương ứng. 7\. Hệ thống tính toán tổng doanh thu và phân tích doanh thu theo các tiêu chí đã chọn. 8\. Hệ thống hiển thị kết quả thống kê dưới dạng số liệu và biểu đồ phù hợp. |
| **Dòng sự kiện phụ** | \- Không có dữ liệu: Nếu không phát sinh giao dịch trong khoảng thời gian đã chọn, hệ thống thông báo "Không có dữ liệu thống kê". \- Khoảng thời gian không hợp lệ: Nếu thời gian bắt đầu lớn hơn thời gian kết thúc, hệ thống thông báo và yêu cầu chọn lại. \- Phiên đăng nhập hết hạn: Hệ thống yêu cầu Quản lý đăng nhập lại. |
| **Tiền điều kiện** | Quản lý đã đăng nhập và có quyền truy cập chức năng Thống kê \- Báo cáo. |
| **Hậu điều kiện** | Kết quả thống kê doanh thu theo các tiêu chí đã chọn được hiển thị trên hệ thống. |

**2\. Use Case: Thống kê sách bán chạy**

| Mục | Nội dung |
| ----- | ----- |
| **Tóm tắt** | Usecase bắt đầu khi Quản lý chọn chức năng thống kê sách bán chạy. Hệ thống cho phép tổng hợp và xếp hạng các đầu sách có số lượng tiêu thụ cao nhất trong khoảng thời gian được lựa chọn. |
| **Dòng sự kiện chính** | 1\. Quản lý chọn chức năng "Thống kê sách bán chạy". 2\. Hệ thống kiểm tra trạng thái đăng nhập thông qua use case "Đăng nhập". 3\. Hệ thống hiển thị giao diện thống kê sách bán chạy và các tiêu chí lọc. 4\. Quản lý chọn khoảng thời gian cần thống kê. 5\. Quản lý nhấn nút "Thống kê". 6\. Hệ thống truy xuất dữ liệu chi tiết các hóa đơn bán hàng trong khoảng thời gian tương ứng. 7\. Hệ thống tổng hợp số lượng đã bán của từng đầu sách và sắp xếp theo số lượng tiêu thụ giảm dần. 8\. Hệ thống hiển thị danh sách xếp hạng các sách bán chạy. |
| **Dòng sự kiện phụ** | \- Không có dữ liệu bán hàng: Nếu khoảng thời gian được chọn không có sách nào được bán, hệ thống thông báo "Không có dữ liệu thống kê". \- Khoảng thời gian không hợp lệ: Hệ thống thông báo và yêu cầu Quản lý chọn lại khoảng thời gian. \- Phiên đăng nhập hết hạn: Hệ thống yêu cầu Quản lý đăng nhập lại. |
| **Tiền điều kiện** | Quản lý đã đăng nhập và hệ thống có dữ liệu giao dịch bán hàng. |
| **Hậu điều kiện** | Danh sách các đầu sách bán chạy được xếp hạng và hiển thị theo khoảng thời gian đã chọn. |

**3\. Use Case: Báo cáo tồn kho**

| Mục | Nội dung |
| ----- | ----- |
| **Tóm tắt** | Usecase bắt đầu khi Quản lý chọn chức năng báo cáo tồn kho. Hệ thống tổng hợp tình hình nhập, xuất và tồn của sách trong một khoảng thời gian, đồng thời thống kê giá trị tồn kho và các mặt hàng bán chậm. |
| **Dòng sự kiện chính** | 1\. Quản lý chọn chức năng "Báo cáo tồn kho". 2\. Hệ thống kiểm tra trạng thái đăng nhập thông qua use case "Đăng nhập". 3\. Hệ thống hiển thị giao diện báo cáo tồn kho và tiêu chí lọc. 4\. Quản lý chọn khoảng thời gian cần lập báo cáo. 5\. Quản lý nhấn nút "Xem báo cáo". 6\. Hệ thống truy xuất dữ liệu nhập kho, xuất kho và tồn kho trong khoảng thời gian tương ứng. 7\. Hệ thống tổng hợp tồn đầu kỳ, nhập trong kỳ, xuất trong kỳ và tồn cuối kỳ. 8\. Hệ thống tính toán giá trị tồn kho và xác định các mặt hàng bán chậm. 9\. Hệ thống hiển thị báo cáo tồn kho cho Quản lý. |
| **Dòng sự kiện phụ** | \- Không có dữ liệu: Nếu không có dữ liệu kho trong khoảng thời gian đã chọn, hệ thống thông báo "Không có dữ liệu báo cáo". \- Khoảng thời gian không hợp lệ: Hệ thống yêu cầu Quản lý chọn lại thời gian. \- Lỗi truy xuất dữ liệu: Hệ thống thông báo không thể tạo báo cáo và yêu cầu thử lại. \- Phiên đăng nhập hết hạn: Hệ thống yêu cầu Quản lý đăng nhập lại. |
| **Tiền điều kiện** | Quản lý đã đăng nhập và có dữ liệu nhập, xuất, tồn kho trên hệ thống. |
| **Hậu điều kiện** | Báo cáo về tồn đầu kỳ, nhập trong kỳ, xuất trong kỳ, tồn cuối kỳ, giá trị tồn kho và sách bán chậm được hiển thị. |

**4\. Use Case: Báo cáo công nợ Nhà cung cấp**

| Mục | Nội dung |
| ----- | ----- |
| **Tóm tắt** | Usecase bắt đầu khi Quản lý chọn chức năng báo cáo công nợ Nhà cung cấp. Hệ thống cho phép tổng hợp và theo dõi chi tiết tình hình công nợ của từng Nhà cung cấp, bao gồm số tiền đã thanh toán, số nợ còn lại và các khoản đến hạn hoặc quá hạn. |
| **Dòng sự kiện chính** | 1\. Quản lý chọn chức năng "Báo cáo công nợ Nhà cung cấp". 2\. Hệ thống kiểm tra trạng thái đăng nhập thông qua use case "Đăng nhập". 3\. Hệ thống hiển thị giao diện báo cáo công nợ và các tiêu chí lọc. 4\. Quản lý chọn Nhà cung cấp hoặc khoảng thời gian cần lập báo cáo. 5\. Quản lý nhấn nút "Xem báo cáo". 6\. Hệ thống truy xuất dữ liệu phiếu nhập, thanh toán và công nợ liên quan. 7\. Hệ thống tổng hợp tổng giá trị nhập hàng, số tiền đã thanh toán, số nợ còn lại và tình trạng đến hạn của từng khoản nợ. 8\. Hệ thống hiển thị báo cáo công nợ Nhà cung cấp. |
| **Dòng sự kiện phụ** | \- Không phát sinh công nợ: Nếu Nhà cung cấp không có khoản công nợ trong điều kiện đã chọn, hệ thống thông báo "Không có dữ liệu công nợ". \- Không tìm thấy Nhà cung cấp: Hệ thống thông báo không tìm thấy dữ liệu phù hợp và cho phép chọn lại. \- Lỗi truy xuất dữ liệu: Hệ thống thông báo không thể tạo báo cáo và yêu cầu thử lại. \- Phiên đăng nhập hết hạn: Hệ thống yêu cầu Quản lý đăng nhập lại. |
| **Tiền điều kiện** | Quản lý đã đăng nhập và hệ thống có dữ liệu nhập hàng, thanh toán và công nợ Nhà cung cấp. |
| **Hậu điều kiện** | Báo cáo chi tiết công nợ của Nhà cung cấp được tổng hợp và hiển thị trên hệ thống. |

**5\. Use Case: Xuất file báo cáo / In ấn**

| Mục | Nội dung |
| ----- | ----- |
| **Tóm tắt** | Usecase bắt đầu khi Quản lý đang xem một kết quả thống kê hoặc báo cáo và chọn chức năng xuất file hoặc in ấn. Hệ thống cho phép tạo file báo cáo hoặc gửi nội dung báo cáo đến chức năng in. |
| **Dòng sự kiện chính** | 1\. Quản lý đang xem kết quả của một trong các chức năng thống kê hoặc báo cáo. 2\. Quản lý chọn chức năng "Xuất file báo cáo / In ấn". 3\. Hệ thống hiển thị các tùy chọn xuất file hoặc in báo cáo. 4\. Quản lý chọn hình thức cần thực hiện. 5\. Nếu chọn xuất file, hệ thống tạo file chứa nội dung báo cáo hiện tại. 6\. Nếu chọn in ấn, hệ thống hiển thị bản xem trước nội dung báo cáo. 7\. Quản lý xác nhận thao tác. 8\. Hệ thống hoàn tất việc xuất file hoặc chuyển nội dung báo cáo đến chức năng in. |
| **Dòng sự kiện phụ** | \- Lỗi tạo file: Nếu hệ thống không thể tạo file báo cáo, hệ thống hiển thị thông báo lỗi và cho phép thực hiện lại. \- Hủy thao tác: Quản lý chọn "Hủy", hệ thống quay lại màn hình báo cáo và không thực hiện xuất file hoặc in. \- Không có dữ liệu báo cáo: Nếu báo cáo hiện tại không có dữ liệu, hệ thống thông báo không thể xuất hoặc in. |
| **Tiền điều kiện** | Quản lý đang xem kết quả của chức năng Thống kê doanh thu, Thống kê sách bán chạy, Báo cáo tồn kho hoặc Báo cáo công nợ Nhà cung cấp. |
| **Hậu điều kiện** | File báo cáo được tạo thành công hoặc nội dung báo cáo được chuyển sang chức năng in; dữ liệu gốc trên hệ thống không bị thay đổi. |

