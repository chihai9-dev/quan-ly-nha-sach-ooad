## **1\. Use Case: Tra cứu phiếu nhập**

| Mục | Nội dung |
| ----- | ----- |
| **Tên Use Case** | Tra cứu phiếu nhập |
| **Tóm tắt** | Usecase bắt đầu khi Nhân viên kho chọn chức năng tra cứu phiếu nhập. Hệ thống cho phép tìm kiếm và rà soát lịch sử các phiếu nhập hàng theo khoảng thời gian, mã phiếu, Nhà cung cấp hoặc người lập phiếu. |
| **Dòng sự kiện chính** | 1\. Nhân viên kho chọn chức năng "Tra cứu phiếu nhập". 2\. Hệ thống kiểm tra trạng thái đăng nhập của Nhân viên kho thông qua use case "Đăng nhập". 3\. Hệ thống hiển thị giao diện tra cứu và danh sách phiếu nhập hiện có. 4\. Nhân viên kho nhập một hoặc nhiều tiêu chí tìm kiếm như khoảng thời gian, mã phiếu, Nhà cung cấp hoặc người lập phiếu. 5\. Nhân viên kho nhấn nút "Tìm kiếm". 6\. Hệ thống truy vấn dữ liệu phiếu nhập. 7\. Hệ thống hiển thị danh sách các phiếu nhập thỏa mãn điều kiện tìm kiếm. |
| **Dòng sự kiện phụ** | \- Không tìm thấy kết quả: Nếu không có phiếu nhập nào phù hợp với tiêu chí tìm kiếm, hệ thống hiển thị thông báo "Không tìm thấy phiếu nhập phù hợp" và cho phép nhập lại điều kiện tìm kiếm. \- Phiên đăng nhập không hợp lệ: Hệ thống yêu cầu Nhân viên kho thực hiện lại use case "Đăng nhập". |
| **Tiền điều kiện**  | Nhân viên kho có tài khoản hợp lệ và có quyền truy cập chức năng Quản lý nhập hàng. |
| **Hậu điều kiện**  | Danh sách phiếu nhập phù hợp với điều kiện tìm kiếm được hiển thị. |

**2\. Use Case: Xem chi tiết phiếu nhập** 

| Mục | Nội dung |
| ----- | ----- |
| **Tên Use Case** | Xem chi tiết phiếu nhập |
| **Tóm tắt** | Usecase bắt đầu khi Nhân viên kho chọn một phiếu nhập từ kết quả tra cứu và yêu cầu xem chi tiết. Cho phép xem đầy đủ thông tin của đợt nhập hàng tương ứng. |
| **Dòng sự kiện chính** | 1\. Nhân viên kho chọn một phiếu nhập từ danh sách kết quả của use case "Tra cứu phiếu nhập". 2\. Nhân viên kho nhấn "Xem chi tiết". 3\. Hệ thống truy xuất dữ liệu của phiếu nhập được chọn. 4\. Hệ thống hiển thị thông tin chi tiết gồm mã phiếu, Nhà cung cấp, ngày nhập, người lập phiếu, danh sách sách nhập, số lượng, đơn giá nhập, chiết khấu và tổng giá trị. 5\. Nhân viên kho xem thông tin và đóng màn hình chi tiết để quay lại danh sách. |
| **Dòng sự kiện phụ** | \- Lỗi tải dữ liệu: Nếu không thể truy xuất thông tin phiếu nhập, hệ thống hiển thị thông báo lỗi và đưa người dùng trở lại danh sách. \- Phiếu nhập không tồn tại: Nếu phiếu nhập đã bị thay đổi hoặc không còn tồn tại, hệ thống thông báo và tải lại danh sách. |
| **Tiền điều kiện**  | Nhân viên kho đang ở màn hình kết quả của use case "Tra cứu phiếu nhập" và đã chọn một phiếu nhập cụ thể. |
| **Hậu điều kiện** | Thông tin chi tiết của phiếu nhập được hiển thị đầy đủ. |

**3\. Use Case: Ghi nhận thanh toán Nhà cung cấp** 

| Mục | Nội dung |
| ----- | ----- |
| **Tên Use Case** | Ghi nhận thanh toán Nhà cung cấp |
| **Tóm tắt** | Usecase bắt đầu khi Nhân viên kho chọn chức năng ghi nhận thanh toán Nhà cung cấp. Hệ thống cho phép xác nhận giao dịch thanh toán toàn bộ hoặc từng phần cho Nhà cung cấp theo từng đơn hoặc phiếu nhập hàng cụ thể. |
| **Dòng sự kiện chính** | 1\. Nhân viên kho chọn chức năng "Ghi nhận thanh toán Nhà cung cấp". 2\. Hệ thống kiểm tra trạng thái đăng nhập thông qua use case "Đăng nhập". 3\. Hệ thống hiển thị danh sách các phiếu nhập hoặc khoản thanh toán cần xử lý. 4\. Nhân viên kho chọn phiếu nhập cần thanh toán. 5\. Hệ thống hiển thị thông tin số tiền cần thanh toán và số dư còn lại. 6\. Nhân viên kho nhập số tiền thanh toán và thông tin giao dịch liên quan. 7\. Nhân viên kho nhấn nút "Xác nhận thanh toán". 8\. Hệ thống ghi nhận giao dịch thanh toán vào cơ sở dữ liệu. 9\. Hệ thống cập nhật số tiền đã trả và số dư công nợ tương ứng. 10\. Hệ thống thông báo "Ghi nhận thanh toán thành công". |
| **Dòng sự kiện phụ** | \- Số tiền thanh toán không hợp lệ: Nếu số tiền nhập nhỏ hơn hoặc bằng 0 hoặc vượt quá số tiền còn phải trả, hệ thống hiển thị thông báo lỗi và yêu cầu nhập lại. \- Không tìm thấy phiếu nhập: Hệ thống thông báo phiếu nhập không tồn tại hoặc không còn hợp lệ. \- Hủy thao tác: Nhân viên kho chọn "Hủy", hệ thống không ghi nhận giao dịch. \- Phiên đăng nhập hết hạn: Hệ thống yêu cầu Nhân viên kho đăng nhập lại. |
| **Tiền điều kiện**  | Nhân viên kho đã đăng nhập và tồn tại phiếu nhập cần thực hiện thanh toán cho Nhà cung cấp. |
| **Hậu điều kiện**  | Giao dịch thanh toán được ghi nhận; số tiền đã trả và công nợ của Nhà cung cấp được cập nhật tương ứng. |

**4\. Use Case: Quản lý công nợ Nhà cung cấp** 

| Mục | Nội dung |
| ----- | ----- |
| **Tên Use Case** | Quản lý công nợ Nhà cung cấp |
| **Tóm tắt** | Usecase bắt đầu khi Nhân viên kho chọn chức năng quản lý công nợ Nhà cung cấp. Hệ thống cho phép theo dõi tổng số tiền đã nhập, số tiền đã thanh toán và số dư nợ còn lại của từng Nhà cung cấp. |
| **Dòng sự kiện chính** | 1\. Nhân viên kho chọn chức năng "Quản lý công nợ Nhà cung cấp". 2\. Hệ thống kiểm tra trạng thái đăng nhập thông qua use case "Đăng nhập". 3\. Hệ thống hiển thị giao diện quản lý công nợ và danh sách Nhà cung cấp. 4\. Nhân viên kho chọn Nhà cung cấp hoặc nhập tiêu chí cần tra cứu. 5\. Hệ thống truy xuất các giao dịch nhập hàng và thanh toán có liên quan. 6\. Hệ thống tính toán tổng giá trị hàng đã nhập, tổng số tiền đã trả và số dư nợ còn lại. 7\. Hệ thống hiển thị thông tin công nợ của Nhà cung cấp để Nhân viên kho theo dõi và đối soát. |
| **Dòng sự kiện phụ** | \- Không có công nợ: Nếu Nhà cung cấp không còn khoản nợ nào, hệ thống hiển thị số dư công nợ bằng 0\. \- Không có dữ liệu giao dịch: Nếu chưa phát sinh giao dịch với Nhà cung cấp, hệ thống thông báo "Không có dữ liệu công nợ". \- Phiên đăng nhập hết hạn: Hệ thống yêu cầu Nhân viên kho đăng nhập lại. |
| **Tiền điều kiện**  | Nhân viên kho có quyền truy cập chức năng quản lý công nợ Nhà cung cấp. |
| **Hậu điều kiện**  | Thông tin tổng số tiền đã nhập, đã thanh toán và số dư nợ của Nhà cung cấp được hiển thị. |

**5\. Use Case: Cảnh báo nợ đến hạn** 

| Mục | Nội dung |
| ----- | ----- |
| **Tên Use Case** | Cảnh báo nợ đến hạn |
| **Tóm tắt** | Usecase được kích hoạt khi hệ thống phát hiện khoản công nợ Nhà cung cấp sắp đến hạn hoặc đã đến hạn thanh toán. Hệ thống cảnh báo để Nhân viên kho kịp thời theo dõi và xử lý. |
| **Dòng sự kiện chính** | 1\. Use case được kích hoạt trong quá trình thực hiện use case "Quản lý công nợ Nhà cung cấp". 2\. Hệ thống kiểm tra các khoản công nợ hiện có và thời hạn thanh toán tương ứng. 3\. Hệ thống xác định các khoản nợ sắp đến hạn hoặc đã đến hạn. 4\. Hệ thống hiển thị cảnh báo gồm Nhà cung cấp, số tiền còn nợ và thời hạn thanh toán. 5\. Nhân viên kho xem thông tin cảnh báo để thực hiện xử lý công nợ phù hợp. |
| **Dòng sự kiện phụ** | \- Không có khoản nợ đến hạn: Nếu không có công nợ nào sắp hoặc đã đến hạn, hệ thống không phát sinh cảnh báo. \- Thiếu thông tin thời hạn: Nếu khoản công nợ chưa có dữ liệu về thời hạn thanh toán, hệ thống không thể xác định trạng thái đến hạn. |
| **Tiền điều kiện**  | Hệ thống có dữ liệu công nợ và thời hạn thanh toán của Nhà cung cấp. |
| **Hậu điều kiện**  | Các khoản công nợ sắp đến hạn hoặc đến hạn được hiển thị cảnh báo để Nhân viên kho theo dõi. |

**6\. Use Case: Lập phiếu nhập** 

| Mục | Nội dung |
| ----- | ----- |
| **Tên Use Case** | Lập phiếu nhập |
| **Tóm tắt** | Usecase bắt đầu khi Nhân viên kho nhập sách từ Nhà cung cấp và chọn chức năng lập phiếu nhập. Hệ thống cho phép ghi nhận Nhà cung cấp, danh sách sách nhập, số lượng, đơn giá nhập, chiết khấu và tổng giá trị lô hàng. |
| **Dòng sự kiện chính** | 1\. Nhân viên kho chọn chức năng "Lập phiếu nhập". 2\. Hệ thống kiểm tra trạng thái đăng nhập thông qua use case "Đăng nhập". 3\. Hệ thống hiển thị biểu mẫu lập phiếu nhập. 4\. Nhân viên kho chọn Nhà cung cấp. 5\. Nhân viên kho nhập danh sách sách cần nhập, số lượng, đơn giá nhập và chiết khấu tương ứng. 6\. Hệ thống tính toán tổng giá trị của lô hàng. 7\. Nhân viên kho kiểm tra thông tin và nhấn nút "Lưu phiếu nhập". 8\. Hệ thống lưu thông tin phiếu nhập vào cơ sở dữ liệu. 9\. Hệ thống tự động cộng số lượng sách nhập vào tồn kho tương ứng. 10\. Hệ thống thông báo "Lập phiếu nhập thành công". |
| **Dòng sự kiện phụ** | \- Thiếu thông tin bắt buộc: Nếu chưa nhập đầy đủ Nhà cung cấp, sách hoặc số lượng, hệ thống thông báo và yêu cầu bổ sung. \- Số lượng hoặc đơn giá không hợp lệ: Nếu số lượng hoặc đơn giá nhập không hợp lệ, hệ thống thông báo lỗi và yêu cầu nhập lại. \- Nhà cung cấp không tồn tại: Hệ thống thông báo không tìm thấy Nhà cung cấp và không cho phép lưu phiếu. \- Hủy thao tác: Nhân viên kho chọn "Hủy", hệ thống không lưu phiếu nhập. \- Phiên đăng nhập hết hạn: Hệ thống yêu cầu Nhân viên kho đăng nhập lại. |
| **Tiền điều kiện**  | Nhân viên kho đã đăng nhập, có quyền lập phiếu nhập và thông tin Nhà cung cấp đã tồn tại trong hệ thống. |
| **Hậu điều kiện**  | Phiếu nhập được lưu thành công và số lượng tồn kho của các sách tương ứng được cập nhật tăng. |

