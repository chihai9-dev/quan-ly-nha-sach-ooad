**1. Đặc tả Use Case: Tra cứu chương trình khuyến mãi**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tác nhân** | Quản lý |
| **Tóm tắt** | Cho phép Quản lý xem danh sách các chương trình khuyến mãi trong hệ thống cùng tình trạng của chúng (Sắp diễn ra, Đang diễn ra, Đã kết thúc, Đã hủy / Đã ngưng). |
| **Tiền điều kiện** | Quản lý đã đăng nhập hệ thống và truy cập phân hệ Quản lý khuyến mãi. |
| **Hậu điều kiện** | Danh sách các chương trình khuyến mãi phù hợp được hiển thị. |
| **Dòng sự kiện chính** | 1. Quản lý chọn menu "Danh sách khuyến mãi".<br>2. Hệ thống truy vấn dữ liệu và hiển thị danh sách chương trình khuyến mãi dạng bảng kèm trạng thái và thời gian áp dụng.<br>3. Quản lý có thể lọc theo trạng thái, loại khuyến mãi hoặc tìm kiếm theo tên chương trình. |
| **Dòng sự kiện phụ** | • **Dữ liệu rỗng:** Chưa có chương trình nào được tạo, hệ thống hiển thị "Chưa có dữ liệu" kèm nút gợi ý "Tạo mới ngay".<br>• **Không tìm thấy kết quả phù hợp:** Hệ thống hiển thị thông báo "Không tìm thấy chương trình khuyến mãi phù hợp với bộ lọc/từ khóa". |

**2. Đặc tả Use Case: Thêm mới / Thiết lập chương trình khuyến mãi**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tác nhân** | Quản lý |
| **Tóm tắt** | Tạo lập và thiết lập các chiến dịch ưu đãi kèm điều kiện thời gian và phạm vi áp dụng cụ thể. |
| **Tiền điều kiện** | Quản lý đã đăng nhập và đang ở giao diện Quản lý khuyến mãi. |
| **Hậu điều kiện** | Một chương trình khuyến mãi mới hợp lệ được lưu vào hệ thống. |
| **Dòng sự kiện chính** | 1. Quản lý nhấn nút "Tạo mới khuyến mãi".<br>2. Hệ thống hiển thị biểu mẫu thiết lập chương trình khuyến mãi.<br>3. Quản lý nhập tên chương trình, chọn loại ưu đãi (giảm giá theo phần trăm, giảm số tiền cố định, mua combo sách) và nhập mức giảm / cấu hình ưu đãi tương ứng.<br>4. Quản lý thiết lập thời gian áp dụng (Từ ngày – Đến ngày).<br>5. Quản lý chọn phạm vi áp dụng (toàn cửa hàng, theo danh mục sách hoặc theo từng đầu sách cụ thể).<br>6. Quản lý nhấn "Lưu". Hệ thống gọi Use Case **"Kiểm tra dữ liệu khuyến mãi"** (`«include»`).<br>7. Khi dữ liệu hợp lệ, hệ thống lưu chương trình vào cơ sở dữ liệu và hiển thị thông báo tạo mới thành công. |
| **Dòng sự kiện phụ** | • **Dữ liệu không hợp lệ (từ Use Case "Kiểm tra dữ liệu khuyến mãi"):** Hệ thống hiển thị thông báo lỗi tương ứng, không lưu dữ liệu và giữ nguyên biểu mẫu để Quản lý chỉnh sửa.<br>• **Hủy thao tác:** Quản lý nhấn "Hủy", hệ thống đóng biểu mẫu và không lưu thay đổi. |

**3. Đặc tả Use Case: Chỉnh sửa chương trình khuyến mãi**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tác nhân** | Quản lý |
| **Tóm tắt** | Cho phép Quản lý cập nhật lại nội dung, mức giảm, thời gian hoặc phạm vi áp dụng của một chương trình khuyến mãi hiện có. |
| **Tiền điều kiện** | Quản lý đã chọn một chương trình khuyến mãi đang ở trạng thái "Sắp diễn ra" hoặc "Đang diễn ra" từ danh sách tra cứu. |
| **Hậu điều kiện** | Thông tin mới của chương trình khuyến mãi được lưu cập nhật vào hệ thống. |
| **Dòng sự kiện chính** | 1. Quản lý nhấn nút "Chỉnh sửa" tại dòng của chương trình khuyến mãi cần cập nhật.<br>2. Hệ thống tải thông tin hiện tại của chương trình lên biểu mẫu.<br>3. Quản lý thay đổi các tham số cần thiết (ví dụ: gia hạn thời gian áp dụng, thay đổi mức giảm giá hoặc phạm vi sách áp dụng).<br>4. Quản lý nhấn "Cập nhật". Hệ thống gọi Use Case **"Kiểm tra dữ liệu khuyến mãi"** (`«include»`).<br>5. Khi dữ liệu hợp lệ, hệ thống lưu cập nhật vào cơ sở dữ liệu và thông báo thành công. |
| **Dòng sự kiện phụ** | • **Chương trình đã kết thúc hoặc đã hủy/ngưng:** Hệ thống vô hiệu hóa nút chỉnh sửa và hiển thị thông báo "Không thể chỉnh sửa chương trình đã kết thúc hoặc đã ngừng, vui lòng tạo mới".<br>• **Dữ liệu cập nhật không hợp lệ (từ Use Case "Kiểm tra dữ liệu khuyến mãi"):** Hệ thống hiển thị thông báo lỗi cụ thể và yêu cầu Quản lý điều chỉnh trước khi lưu.<br>• **Hủy thao tác:** Quản lý nhấn "Hủy", hệ thống đóng biểu mẫu và giữ nguyên dữ liệu cũ. |

**4. Đặc tả Use Case: Hủy / Ngừng chương trình khuyến mãi**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tác nhân** | Quản lý |
| **Tóm tắt** | Cho phép ngừng hiệu lực của một chương trình khuyến mãi trước thời hạn kết thúc dự kiến. |
| **Tiền điều kiện** | Quản lý chọn một chương trình khuyến mãi đang ở trạng thái "Đang diễn ra" hoặc "Sắp diễn ra". |
| **Hậu điều kiện** | Chương trình chuyển sang trạng thái "Đã hủy / Đã ngưng" và không còn được áp dụng cho các hóa đơn mới (các hóa đơn đã lập trước đó vẫn giữ nguyên chiết khấu cũ). |
| **Dòng sự kiện chính** | 1. Quản lý nhấn nút "Hủy / Ngừng" tại chương trình cần thao tác.<br>2. Hệ thống hiển thị hộp thoại xác nhận: "Bạn có chắc chắn muốn ngừng chương trình này?".<br>3. Quản lý bấm "Đồng ý".<br>4. Hệ thống cập nhật trạng thái chương trình thành "Đã hủy / Đã ngưng" trong cơ sở dữ liệu và thông báo thành công. |
| **Dòng sự kiện phụ** | • **Hủy thao tác:** Quản lý bấm "Không", hộp thoại xác nhận đóng lại và trạng thái chương trình giữ nguyên. |

**5. Đặc tả Use Case: Kiểm tra dữ liệu khuyến mãi (Include Sub-usecase)**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tác nhân** | Quản lý (được gọi bắt buộc từ Use Case "Thêm mới / Thiết lập chương trình khuyến mãi" và "Chỉnh sửa chương trình khuyến mãi") |
| **Tóm tắt** | Kiểm tra tính hợp lệ và tính xung đột của dữ liệu thiết lập khuyến mãi trước khi lưu vào cơ sở dữ liệu. |
| **Tiền điều kiện** | Quản lý nhấn nút "Lưu" hoặc "Cập nhật" khi thêm mới hoặc chỉnh sửa chương trình khuyến mãi. |
| **Hậu điều kiện** | Trả về kết quả "Hợp lệ" để tiếp tục lưu hoặc danh sách lỗi cụ thể để Quản lý khắc phục. |
| **Dòng sự kiện chính** | 1. Hệ thống tiếp nhận dữ liệu từ biểu mẫu thiết lập/chỉnh sửa chương trình khuyến mãi.<br>2. Hệ thống kiểm tra các quy tắc hợp lệ: Tên chương trình không được để trống; Mức giảm theo phần trăm phải từ 1% đến 100%; Mức giảm số tiền cố định phải lớn hơn 0; Cấu hình combo sách phải hợp lệ; Ngày kết thúc phải lớn hơn hoặc bằng Ngày bắt đầu.<br>3. Hệ thống kiểm tra tính xung đột phạm vi áp dụng (ví dụ: một đầu sách không thể đồng thời tham gia hai chương trình giảm giá trực tiếp trong cùng khoảng thời gian).<br>4. Nếu tất cả điều kiện đều đạt, hệ thống trả về kết quả "Hợp lệ". |
| **Dòng sự kiện phụ** | • **Dữ liệu vi phạm quy tắc hợp lệ:** Hệ thống xác định trường dữ liệu sai (tên trống, mức giảm không hợp lệ, ngày kết thúc trước ngày bắt đầu...) và trả về thông báo lỗi tương ứng.<br>• **Lỗi xung đột đầu sách:** Phát hiện đầu sách A đã thuộc một chương trình khuyến mãi khác trong cùng thời điểm, hệ thống báo lỗi "Sách A đang trùng khuyến mãi trong khoảng thời gian này" và yêu cầu Quản lý bỏ chọn đầu sách đó hoặc điều chỉnh thời gian. |

**6. Đặc tả Use Case: Tạo và cập nhật mã giảm giá (Voucher)**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tác nhân** | Quản lý |
| **Tóm tắt** | Cho phép Quản lý tạo mới, phát hành, chỉnh sửa thông tin hoặc ngừng kích hoạt các mã giảm giá (Voucher) áp dụng tại quầy bán hàng. |
| **Tiền điều kiện** | Quản lý đã đăng nhập và chọn chức năng "Quản lý mã giảm giá (Voucher)". |
| **Hậu điều kiện** | Mã giảm giá mới được phát hành hoặc thông tin/trạng thái của mã giảm giá hiện có được cập nhật vào cơ sở dữ liệu. |
| **Dòng sự kiện chính** | 1. Quản lý mở giao diện danh sách mã giảm giá và chọn "Tạo mã mới" hoặc nhấn "Chỉnh sửa" tại một mã hiện có.<br>2. Với thao tác Tạo mới: Quản lý nhập chuỗi mã thủ công (ví dụ: BOOK2026) hoặc chọn sinh mã ngẫu nhiên.<br>3. Quản lý nhập/cập nhật loại giảm giá và mức giảm giá (theo phần trăm hoặc số tiền cố định).<br>4. Quản lý quy định hoặc điều chỉnh các điều kiện áp dụng: giá trị đơn hàng tối thiểu, số lần sử dụng tối đa, thời hạn sử dụng và trạng thái hoạt động (Đang hoạt động / Tạm ngừng).<br>5. Quản lý nhấn "Lưu mã giảm giá".<br>6. Hệ thống kiểm tra tính hợp lệ, lưu thông tin vào cơ sở dữ liệu và thông báo thành công. |
| **Dòng sự kiện phụ** | • **Mã đã tồn tại:** Nếu chuỗi mã nhập tay trùng với mã đã có trên hệ thống, hệ thống báo lỗi "Mã voucher đã tồn tại, vui lòng nhập mã khác".<br>• **Điều kiện / thông tin không hợp lệ:** Nếu mức giảm <= 0 (hoặc > 100% đối với giảm phần trăm), số lần sử dụng tối đa <= 0, giá trị đơn tối thiểu < 0 hoặc hạn sử dụng không hợp lệ, hệ thống báo lỗi và không cho lưu.<br>• **Chỉnh sửa mã đã hết hạn hoặc đã ngừng:** Hệ thống chỉ cho phép xem thông tin, không cho phép chỉnh sửa lại các mã đã hết hiệu lực. |

**7. Đặc tả Use Case: Tra cứu lịch sử sử dụng mã giảm giá**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tác nhân** | Quản lý |
| **Tóm tắt** | Cho phép Quản lý theo dõi lịch sử áp dụng của từng mã giảm giá đã phát hành. |
| **Tiền điều kiện** | Quản lý đang ở giao diện danh sách mã giảm giá (Voucher). |
| **Hậu điều kiện** | Bảng danh sách các hóa đơn đã sử dụng mã giảm giá đó được hiển thị chi tiết. |
| **Dòng sự kiện chính** | 1. Quản lý nhấn nút "Xem lịch sử" tại một mã giảm giá cụ thể.<br>2. Hệ thống truy xuất cơ sở dữ liệu các hóa đơn/giao dịch đã áp dụng mã giảm giá đó.<br>3. Hệ thống hiển thị danh sách chi tiết gồm: Mã hóa đơn, Tên khách hàng sử dụng, Ngày sử dụng, Tổng tiền đơn hàng và Số tiền được giảm. |
| **Dòng sự kiện phụ** | • **Chưa có lượt sử dụng:** Hệ thống hiển thị thông báo "Mã giảm giá này chưa được sử dụng lần nào". |
