**1\. Đặc tả Use Case: Tra cứu sách bán**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tóm tắt** | **Cho phép nhân viên tìm kiếm sách theo tên, mã sách, thể loại, tác giả hoặc nhà xuất bản để phục vụ bán hàng.** |
| **Tiền điều kiện** | **Nhân viên bán hàng đã đăng nhập và truy cập giao diện bán hàng tại quầy.** |
| **Hậu điều kiện** | **Trả về danh sách sách hoặc thông tin cụ thể của cuốn sách cần tìm cùng số lượng tồn kho.** |
| **Dòng sự kiện chính** | **1\. Nhân viên nhập từ khóa tìm kiếm (tên, mã vạch, thể loại, tác giả, nhà xuất bản) vào ô tra cứu. 2\. Nhấn nút "Tìm kiếm" hoặc quét mã vạch bằng máy quét. 3\. Hệ thống truy vấn cơ sở dữ liệu. 4\. Hệ thống hiển thị kết quả bao gồm tên sách, giá bán, vị trí kệ và số lượng tồn kho thực tế.** |
| **Dòng sự kiện phụ** | **• Không tìm thấy sách: Hệ thống hiển thị thông báo "Không tìm thấy sách phù hợp" và gợi ý nhập lại từ khóa.** |

**2\. Đặc tả Use Case: Xem chi tiết giỏ hàng / hóa đơn tạm**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tóm tắt** | **Hiển thị danh sách các đầu sách đã được quét để chuẩn bị lập hóa đơn, cho phép nhân viên rà soát trước khi thanh toán.** |
| **Tiền điều kiện** | **Nhân viên đã chọn/quét ít nhất một đầu sách.** |
| **Hậu điều kiện** | **Danh sách sách, số lượng và tổng tiền tạm tính được hiển thị.** |
| **Dòng sự kiện chính** | **1\. Nhân viên quét mã hoặc chọn sách từ kết quả tra cứu để thêm vào giỏ hàng. 2\. Hệ thống cập nhật hiển thị danh sách sách trong hóa đơn tạm. 3\. Nhân viên có thể điều chỉnh số lượng mua (+ / \-) hoặc xóa sách khỏi giỏ hàng. 4\. Hệ thống tự động tính toán lại tổng tiền tạm tính mỗi khi có thay đổi.** |
| **Dòng sự kiện phụ** | **• Số lượng mua vượt tồn kho: Nếu nhân viên tăng số lượng mua lớn hơn tồn kho thực tế, hệ thống cảnh báo "Số lượng tồn không đủ" và đưa về số lượng tối đa có thể bán.** |

**3\. Đặc tả Use Case: Áp dụng khuyến mãi vào hóa đơn (Sub-usecase)**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tóm tắt** | **Hệ thống tự động quét và áp dụng các chương trình khuyến mãi hiện hành cho các sách trong giỏ hàng.** |
| **Tiền điều kiện** | **Giỏ hàng/hóa đơn tạm đã có dữ liệu và đang ở bước trước khi thanh toán.** |
| **Hậu điều kiện** | **Tổng tiền hóa đơn được giảm trừ chiết khấu chính xác theo chương trình khuyến mãi.** |
| **Dòng sự kiện chính** | **1\. Hệ thống tự động quét các sách khách chọn, số lượng, đơn giá. 2\. Đối chiếu với các chương trình khuyến mãi đang có hiệu lực trên toàn hệ thống. 3\. Hệ thống tính toán mức giảm trừ tương ứng cho từng đầu sách hoặc tổng hóa đơn. 4\. Hệ thống hiển thị rõ dòng "Chiết khấu khuyến mãi" và cập nhật lại tổng tiền phải thanh toán.** |
| **Dòng sự kiện phụ** | **• Khách hàng cung cấp mã giảm giá: Nhân viên nhập tay mã giảm giá, hệ thống kiểm tra hiệu lực. Nếu hợp lệ, áp dụng thêm mức giảm của mã; nếu không hợp lệ, báo lỗi "Mã không hợp lệ hoặc đã hết hạn".** |

**4\. Đặc tả Use Case: Lập hóa đơn và Ghi nhận thanh toán**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tóm tắt** | **Tạo hóa đơn bán hàng chính thức, ghi nhận số tiền khách thanh toán, phương thức thanh toán và hoàn tất giao dịch.** |
| **Tiền điều kiện** | **Khách hàng đồng ý với tổng số tiền phải trả và tiến hành thanh toán.** |
| **Hậu điều kiện** | **Hóa đơn được lưu trữ, tồn kho bị trừ, doanh thu được ghi nhận.** |
| **Dòng sự kiện chính** | **1\. Nhân viên xác nhận lại danh sách mua và nhấn "Thanh toán". 2\. Nhân viên tạo hóa đơn bán hàng dựa trên các sách khách chọn, số lượng, đơn giá và các chương trình khuyến mãi áp dụng. 3\. Nhân viên ghi nhận số tiền khách đưa và chọn phương thức thanh toán (Tiền mặt, Chuyển khoản, Thẻ). 4\. Hệ thống tính toán tiền thừa trả khách (nếu có). 5\. Nhân viên nhấn "Hoàn tất". 6\. Hệ thống đồng thời hoàn tất giao dịch bán hàng, trừ số lượng tồn kho và lưu dữ liệu hóa đơn vào cơ sở dữ liệu. 7\. Hệ thống ra lệnh cho máy in hóa đơn.** |
| **Dòng sự kiện phụ** | **• Hủy thanh toán: Nhân viên nhấn hủy, hệ thống không lưu hóa đơn, giữ nguyên tồn kho và đưa trở lại màn hình giỏ hàng tạm.** |

**5\. Đặc tả Use Case: Tra cứu hóa đơn**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tóm tắt** | **Cho phép tìm kiếm và xem lại thông tin các hóa đơn đã lập.** |
| **Tiền điều kiện** | **Nhân viên/Quản lý đang ở phân hệ Quản lý bán hàng hoặc Quản lý hóa đơn.** |
| **Hậu điều kiện** | **Danh sách hóa đơn hoặc chi tiết một hóa đơn cụ thể được hiển thị.** |
| **Dòng sự kiện chính** | **1\. Người dùng chọn chức năng Tra cứu hóa đơn. 2\. Nhập các tiêu chí lọc: Ngày tạo, mã hóa đơn, tên nhân viên lập, hoặc SĐT khách hàng. 3\. Hệ thống trả về danh sách các hóa đơn đã lập phù hợp. 4\. Người dùng click vào một hóa đơn để xem chi tiết danh mục sách đã bán, chiết khấu và phương thức thanh toán.** |
| **Dòng sự kiện phụ** | **• Mất kết nối: Hệ thống báo lỗi không thể truy xuất dữ liệu do rớt mạng.** |

**6\. Đặc tả Use Case: Quản lý trả hàng / đổi hàng**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tóm tắt** | **Xử lý các trường hợp khách trả hoặc đổi sách dựa trên hóa đơn đã mua, đồng thời cập nhật lại tồn kho và thông tin giao dịch liên quan.** |
| **Tiền điều kiện** | **Nhân viên/Quản lý đã tìm thấy hóa đơn cần xử lý đổi/trả.** |
| **Hậu điều kiện** | **Hệ thống tạo biên bản đổi trả, hoàn tiền (nếu có) và khôi phục tồn kho cho sách bị trả.** |
| **Dòng sự kiện chính** | **1\. Từ giao diện chi tiết hóa đơn cũ, người dùng chọn "Tạo phiếu Đổi/Trả hàng". 2\. Hệ thống xử lý các trường hợp khách trả hoặc đổi sách dựa trên hóa đơn đã mua. 3\. Nếu là Đổi sách: Nhân viên quét mã sách mới khách muốn lấy bù vào. 4\. Hệ thống tính toán chênh lệch giá tiền (khách cần bù thêm hoặc cửa hàng thối lại). 5\. Nhân viên xác nhận hoàn tất. 6\. Hệ thống cập nhật lại tồn kho (cộng lại sách cũ, trừ sách mới) và ghi nhận thông tin giao dịch liên quan.** |
| **Dòng sự kiện phụ** | **• Sách không đủ điều kiện đổi trả: Ví dụ sách rách, quá 7 ngày. Nhân viên từ chối xử lý, hệ thống đóng quy trình.** |

