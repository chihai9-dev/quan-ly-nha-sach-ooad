**1\. Use Case: Theo dõi tồn kho**

| Mục | Nội dung |
| ----- | ----- |
| **Tóm tắt** | Usecase bắt đầu khi Nhân viên kho chọn chức năng theo dõi tồn kho. Hệ thống cho phép giám sát số lượng sách thực tế hiện có trong kho và cập nhật số liệu tồn kho sau các nghiệp vụ nhập hàng, bán hàng hoặc đổi trả. |
| **Dòng sự kiện chính** | 1\. Nhân viên kho chọn chức năng "Theo dõi tồn kho". 2\. Hệ thống kiểm tra trạng thái đăng nhập của Nhân viên kho thông qua use case "Đăng nhập". 3\. Hệ thống truy xuất dữ liệu tồn kho hiện tại. 4\. Hệ thống hiển thị danh sách các đầu sách cùng số lượng tồn kho tương ứng. 5\. Nhân viên kho nhập tiêu chí tìm kiếm hoặc chọn đầu sách cần theo dõi. 6\. Hệ thống hiển thị thông tin tồn kho của đầu sách được chọn. 7\. Khi phát sinh nghiệp vụ nhập hàng, bán hàng hoặc đổi trả, hệ thống tự động cập nhật lại số lượng tồn kho tương ứng. |
| **Dòng sự kiện phụ** | \- Không tìm thấy sách: Nếu không có đầu sách phù hợp với tiêu chí tìm kiếm, hệ thống hiển thị thông báo "Không tìm thấy sách phù hợp" và cho phép nhập lại tiêu chí. \- Không tải được dữ liệu: Nếu xảy ra lỗi khi truy xuất dữ liệu tồn kho, hệ thống hiển thị thông báo lỗi và yêu cầu thử lại. \- Phiên đăng nhập hết hạn: Hệ thống yêu cầu Nhân viên kho đăng nhập lại. |
| **Tiền điều kiện** | Nhân viên kho có tài khoản hợp lệ và có quyền truy cập chức năng Quản lý Kho. |
| **Hậu điều kiện** | Thông tin số lượng tồn kho hiện tại của các đầu sách được hiển thị và cập nhật theo dữ liệu mới nhất. |

**2\. Use Case: Cảnh báo tồn kho**

| Mục | Nội dung |
| ----- | ----- |
| **Tóm tắt** | Usecase được kích hoạt khi hệ thống phát hiện số lượng tồn kho của một đầu sách chạm ngưỡng tồn kho tối thiểu hoặc vượt ngưỡng tồn kho tối đa. Hệ thống đưa ra cảnh báo để Nhân viên kho kịp thời xử lý. |
| **Dòng sự kiện chính** | 1\. Use case được kích hoạt trong quá trình thực hiện use case "Theo dõi tồn kho". 2\. Hệ thống kiểm tra số lượng tồn kho hiện tại của từng đầu sách. 3\. Hệ thống so sánh số lượng tồn kho với ngưỡng tồn kho tối thiểu và tối đa đã thiết lập. 4\. Nếu số lượng tồn kho chạm mức tối thiểu hoặc vượt mức tối đa, hệ thống xác định trạng thái cần cảnh báo. 5\. Hệ thống hiển thị cảnh báo gồm thông tin đầu sách, số lượng tồn hiện tại và trạng thái cảnh báo. 6\. Nhân viên kho xem thông tin cảnh báo để có phương án xử lý phù hợp. |
| **Dòng sự kiện phụ** | \- Tồn kho nằm trong giới hạn: Nếu số lượng tồn kho vẫn nằm trong khoảng cho phép, hệ thống không phát sinh cảnh báo. \- Chưa thiết lập ngưỡng tồn kho: Nếu đầu sách chưa có ngưỡng tối thiểu hoặc tối đa, hệ thống không thể xác định trạng thái cảnh báo cho đầu sách đó. |
| **Tiền điều kiện** | Hệ thống có dữ liệu số lượng tồn kho và ngưỡng tồn kho tối thiểu, tối đa của đầu sách. |
| **Hậu điều kiện** | Các đầu sách có số lượng tồn kho bất thường được hiển thị cảnh báo để Nhân viên kho theo dõi và xử lý. |

**3\. Use Case: Kiểm kê kho**

| Mục | Nội dung |
| ----- | ----- |
| **Tóm tắt** | Usecase bắt đầu khi Nhân viên kho chọn chức năng kiểm kê kho. Hệ thống hỗ trợ ghi nhận số lượng sách thực tế, đối chiếu với số liệu trên phần mềm và xác định các trường hợp chênh lệch thừa, thiếu hoặc hỏng hóc. |
| **Dòng sự kiện chính** | 1\. Nhân viên kho chọn chức năng "Kiểm kê kho". 2\. Hệ thống kiểm tra trạng thái đăng nhập thông qua use case "Đăng nhập". 3\. Hệ thống hiển thị giao diện kiểm kê và danh sách các đầu sách cùng số lượng tồn kho trên hệ thống. 4\. Nhân viên kho tiến hành kiểm đếm thực tế và nhập số lượng thực tế của từng đầu sách. 5\. Nhân viên kho xác nhận hoàn tất kiểm kê. 6\. Hệ thống đối chiếu số lượng thực tế với số lượng đang ghi nhận trên hệ thống. 7\. Hệ thống tính toán và hiển thị chênh lệch của từng đầu sách. 8\. Hệ thống ghi nhận kết quả kiểm kê. |
| **Dòng sự kiện phụ** | \- Không có chênh lệch: Nếu số lượng thực tế trùng với số liệu hệ thống, hệ thống ghi nhận kết quả kiểm kê bình thường. \- Có chênh lệch: Nếu phát hiện thừa, thiếu hoặc hỏng hóc, hệ thống hiển thị thông tin chênh lệch và cho phép thực hiện use case "Lập phiếu điều chỉnh kho". \- Dữ liệu kiểm kê không hợp lệ: Nếu số lượng nhập không hợp lệ, hệ thống hiển thị thông báo lỗi và yêu cầu nhập lại. \- Hủy kiểm kê: Nhân viên kho chọn "Hủy", hệ thống không ghi nhận kết quả kiểm kê. \- Phiên đăng nhập hết hạn: Hệ thống yêu cầu Nhân viên kho đăng nhập lại. |
| **Tiền điều kiện** | Nhân viên kho đã đăng nhập và có quyền thực hiện kiểm kê kho. |
| **Hậu điều kiện** | Kết quả kiểm kê được ghi nhận và các chênh lệch giữa số lượng thực tế với số liệu trên hệ thống được xác định. |

**4\. Use Case: Lập phiếu điều chỉnh kho**

| Mục | Nội dung |
| ----- | ----- |
| **Tóm tắt** | Usecase bắt đầu khi kết quả kiểm kê phát hiện chênh lệch giữa số lượng sách thực tế và số liệu trên hệ thống. Nhân viên kho lập phiếu điều chỉnh để ghi nhận và điều chỉnh lại số lượng tồn kho. |
| **Dòng sự kiện chính** | 1\. Nhân viên kho phát hiện chênh lệch từ kết quả của use case "Kiểm kê kho". 2\. Nhân viên kho chọn chức năng "Lập phiếu điều chỉnh kho". 3\. Hệ thống hiển thị thông tin các đầu sách có chênh lệch gồm số lượng trên hệ thống, số lượng thực tế và mức chênh lệch. 4\. Nhân viên kho nhập nguyên nhân điều chỉnh và các thông tin cần thiết. 5\. Nhân viên kho kiểm tra thông tin và nhấn nút "Lưu phiếu điều chỉnh". 6\. Hệ thống lưu phiếu điều chỉnh kho vào cơ sở dữ liệu. 7\. Hệ thống cập nhật lại số lượng tồn kho theo kết quả điều chỉnh. 8\. Hệ thống thông báo "Lập phiếu điều chỉnh kho thành công". |
| **Dòng sự kiện phụ** | \- Thiếu nguyên nhân điều chỉnh: Nếu chưa nhập đầy đủ thông tin cần thiết, hệ thống thông báo và yêu cầu bổ sung. \- Dữ liệu điều chỉnh không hợp lệ: Nếu số lượng điều chỉnh không phù hợp với kết quả kiểm kê, hệ thống hiển thị lỗi và không cho phép lưu phiếu. \- Hủy thao tác: Nhân viên kho chọn "Hủy", hệ thống không tạo phiếu điều chỉnh và không thay đổi dữ liệu tồn kho. \- Lỗi lưu dữ liệu: Nếu không thể lưu phiếu điều chỉnh, hệ thống thông báo lỗi và giữ nguyên số liệu tồn kho hiện tại. |
| **Tiền điều kiện** | Use case "Kiểm kê kho" đã xác định có chênh lệch giữa số lượng thực tế và số liệu trên hệ thống. |
| **Hậu điều kiện** | Phiếu điều chỉnh kho được lưu và số lượng tồn kho được cập nhật theo kết quả kiểm kê. |

