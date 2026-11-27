**1. Đặc tả Use Case: Tra cứu sách bán**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tác nhân** | Nhân viên bán hàng |
| **Tóm tắt** | Cho phép nhân viên bán hàng tìm kiếm sách theo tên, mã sách / mã vạch (ISBN), thể loại, tác giả hoặc nhà xuất bản để phục vụ bán hàng tại quầy. |
| **Tiền điều kiện** | Nhân viên bán hàng đã đăng nhập hệ thống và truy cập giao diện bán hàng tại quầy. |
| **Hậu điều kiện** | Trả về danh sách sách hoặc thông tin chi tiết của đầu sách cần tìm kèm giá bán và số lượng tồn kho thực tế. |
| **Dòng sự kiện chính** | 1. Nhân viên bán hàng nhập từ khóa tìm kiếm (tên sách, mã sách / mã vạch, thể loại, tác giả hoặc nhà xuất bản) vào ô tra cứu.<br>2. Nhân viên nhấn nút "Tìm kiếm" hoặc quét mã vạch bằng máy quét.<br>3. Hệ thống truy vấn cơ sở dữ liệu theo tiêu chí đã nhập.<br>4. Hệ thống hiển thị kết quả bao gồm: mã sách, tên sách, tác giả, thể loại, giá bán và số lượng tồn kho thực tế. |
| **Dòng sự kiện phụ** | • **Không tìm thấy sách:** Hệ thống hiển thị thông báo "Không tìm thấy sách phù hợp" và gợi ý nhân viên kiểm tra hoặc nhập lại từ khóa. |

**2. Đặc tả Use Case: Lập hóa đơn và Ghi nhận thanh toán**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tác nhân** | Nhân viên bán hàng |
| **Tóm tắt** | Tạo hóa đơn bán hàng chính thức, ghi nhận số tiền khách thanh toán, phương thức thanh toán và hoàn tất giao dịch tại quầy. |
| **Tiền điều kiện** | Nhân viên bán hàng đã đăng nhập, đang ở giao diện bán hàng tại quầy và khách hàng chọn mua ít nhất một đầu sách. |
| **Hậu điều kiện** | Hóa đơn được lưu vào cơ sở dữ liệu, tồn kho sách được trừ tương ứng, doanh thu (và điểm tích lũy khách hàng nếu có) được ghi nhận. |
| **Dòng sự kiện chính** | 1. Nhân viên bán hàng thực hiện Use Case **"Xem chi tiết giỏ hàng / hóa đơn tạm"** (`«include»`) để thêm sách, rà soát danh sách sách, số lượng và tổng tiền tạm tính.<br>2. *(Mở rộng – `«extend»`)* Nếu có chương trình khuyến mãi đang áp dụng hoặc khách hàng cung cấp mã giảm giá, hệ thống/nhân viên thực hiện Use Case **"Áp dụng khuyến mãi vào hóa đơn"** để tính mức chiết khấu.<br>3. Nhân viên xác nhận danh sách mua, chọn khách hàng thành viên (nếu có) và nhấn nút "Thanh toán".<br>4. Hệ thống tổng hợp thông tin hóa đơn dựa trên các đầu sách đã chọn, số lượng, đơn giá, chiết khấu khuyến mãi (nếu có) và hiển thị tổng số tiền phải thanh toán.<br>5. Nhân viên chọn phương thức thanh toán (Tiền mặt, Chuyển khoản, Thẻ, Ví MoMo) và nhập số tiền khách đưa (nếu thanh toán tiền mặt).<br>6. Hệ thống tự động tính toán tiền thừa trả khách (nếu có).<br>7. Nhân viên nhấn "Hoàn tất".<br>8. Hệ thống lưu hóa đơn vào cơ sở dữ liệu, tự động trừ số lượng tồn kho của các đầu sách đã bán, ghi nhận doanh thu và cập nhật điểm tích lũy khách hàng (nếu có).<br>9. Hệ thống gửi lệnh in hóa đơn ra máy in. |
| **Dòng sự kiện phụ** | • **Hủy thanh toán:** Nhân viên nhấn "Hủy", hệ thống không lưu hóa đơn, giữ nguyên tồn kho và quay lại màn hình giỏ hàng tạm.<br>• **Tiền khách đưa không đủ (Tiền mặt):** Hệ thống cảnh báo "Số tiền khách đưa nhỏ hơn tổng tiền cần thanh toán" và không cho phép hoàn tất giao dịch.<br>• **Thanh toán Chuyển khoản / Thẻ / Ví thất bại:** Hệ thống thông báo giao dịch chưa thành công, cho phép thử lại hoặc đổi phương thức thanh toán khác.<br>• **Lỗi máy in hóa đơn:** Hóa đơn vẫn được lưu thành công vào hệ thống; hệ thống thông báo lỗi kết nối máy in và cho phép nhân viên in lại hóa đơn sau. |

**3. Đặc tả Use Case: Xem chi tiết giỏ hàng / hóa đơn tạm (Include Sub-usecase)**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tác nhân** | Nhân viên bán hàng (được gọi bắt buộc từ Use Case "Lập hóa đơn và Ghi nhận thanh toán") |
| **Tóm tắt** | Hiển thị và cho phép rà soát, cập nhật danh sách các đầu sách đã chọn/quét trong hóa đơn tạm trước khi thanh toán. |
| **Tiền điều kiện** | Nhân viên bán hàng đang thực hiện giao dịch trên giao diện bán hàng tại quầy. |
| **Hậu điều kiện** | Danh sách đầu sách, số lượng mua, đơn giá và tổng tiền tạm tính được cập nhật và hiển thị chính xác. |
| **Dòng sự kiện chính** | 1. Nhân viên bán hàng quét mã vạch hoặc chọn sách từ kết quả tra cứu để thêm vào giỏ hàng / hóa đơn tạm.<br>2. Hệ thống kiểm tra tồn kho và cập nhật danh sách sách hiển thị trong hóa đơn tạm.<br>3. Nhân viên rà soát danh sách, có thể điều chỉnh số lượng mua (+ / -) hoặc xóa đầu sách khỏi giỏ hàng.<br>4. Hệ thống tự động tính toán lại thành tiền từng dòng và tổng tiền tạm tính mỗi khi có thay đổi. |
| **Dòng sự kiện phụ** | • **Sách đã hết hàng (tồn kho = 0):** Hệ thống thông báo "Sách hiện đã hết hàng" và không thêm vào giỏ hàng.<br>• **Số lượng mua vượt tồn kho:** Nếu nhân viên tăng số lượng mua lớn hơn tồn kho thực tế, hệ thống cảnh báo "Số lượng tồn kho không đủ" và tự động giới hạn về số lượng tối đa có thể bán.<br>• **Xóa hết sách trong giỏ hàng:** Hệ thống hiển thị giỏ hàng trống và vô hiệu hóa nút "Thanh toán". |

**4. Đặc tả Use Case: Áp dụng khuyến mãi vào hóa đơn (Extend Sub-usecase)**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tác nhân** | Nhân viên bán hàng (mở rộng từ Use Case "Lập hóa đơn và Ghi nhận thanh toán") |
| **Tóm tắt** | Cho phép áp dụng các chương trình khuyến mãi hiện hành hoặc mã giảm giá (Voucher) hợp lệ vào hóa đơn tạm trước khi thanh toán. |
| **Tiền điều kiện** | Giỏ hàng / hóa đơn tạm đã có ít nhất một đầu sách và đang ở bước trước khi hoàn tất thanh toán. |
| **Hậu điều kiện** | Mức chiết khấu được tính toán chính xác và trừ vào tổng tiền phải thanh toán của hóa đơn. |
| **Dòng sự kiện chính** | 1. Hệ thống quét danh sách sách, số lượng, đơn giá trong giỏ hàng và đối chiếu với các chương trình khuyến mãi đang ở trạng thái "Đang diễn ra".<br>2. Hệ thống tính toán mức giảm trừ tương ứng cho từng đầu sách, nhóm combo hoặc tổng hóa đơn theo quy tắc khuyến mãi hiện hành.<br>3. *(Tùy chọn)* Nếu khách hàng cung cấp mã giảm giá (Voucher), nhân viên nhập mã vào ô áp dụng; hệ thống kiểm tra hiệu lực, hạn sử dụng, số lượt dùng còn lại và giá trị đơn hàng tối thiểu.<br>4. Hệ thống hiển thị rõ dòng "Chiết khấu khuyến mãi / Mã giảm giá" và cập nhật lại tổng số tiền phải thanh toán. |
| **Dòng sự kiện phụ** | • **Không có khuyến mãi phù hợp:** Không có chương trình nào khớp với giỏ hàng, mức chiết khấu giữ nguyên là 0đ.<br>• **Mã giảm giá không hợp lệ hoặc đã hết hạn:** Hệ thống báo lỗi "Mã giảm giá không hợp lệ hoặc đã hết hạn" và không áp dụng mã.<br>• **Đơn hàng chưa đạt điều kiện mã giảm giá:** Hệ thống thông báo "Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã" và giữ nguyên tổng tiền cũ. |

**5. Đặc tả Use Case: Tra cứu hóa đơn**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tác nhân** | Nhân viên bán hàng |
| **Tóm tắt** | Cho phép tìm kiếm và xem lại thông tin chi tiết các hóa đơn bán hàng đã lập trong hệ thống. |
| **Tiền điều kiện** | Nhân viên bán hàng đã đăng nhập và truy cập chức năng Tra cứu hóa đơn trong phân hệ Quản lý bán hàng. |
| **Hậu điều kiện** | Danh sách hóa đơn phù hợp hoặc thông tin chi tiết của một hóa đơn cụ thể được hiển thị. |
| **Dòng sự kiện chính** | 1. Nhân viên bán hàng chọn chức năng "Tra cứu hóa đơn".<br>2. Nhân viên nhập hoặc chọn các tiêu chí tìm kiếm/lọc: mã hóa đơn, khoảng ngày tạo, tên nhân viên lập hoặc số điện thoại khách hàng.<br>3. Hệ thống truy vấn cơ sở dữ liệu và trả về danh sách các hóa đơn phù hợp.<br>4. Nhân viên chọn một hóa đơn trong danh sách để xem chi tiết: danh mục sách đã bán, số lượng, đơn giá, chiết khấu, tổng thanh toán và phương thức thanh toán. |
| **Dòng sự kiện phụ** | • **Không tìm thấy hóa đơn:** Hệ thống hiển thị thông báo "Không tìm thấy hóa đơn phù hợp với điều kiện tìm kiếm".<br>• **Lỗi kết nối dữ liệu:** Hệ thống báo lỗi không thể truy xuất dữ liệu do mất kết nối mạng và yêu cầu thử lại. |

**6. Đặc tả Use Case: Quản lý trả hàng / đổi hàng**

| Thành phần | Nội dung chi tiết |
| :---- | :---- |
| **Tác nhân** | Nhân viên bán hàng |
| **Tóm tắt** | Xử lý nghiệp vụ khách hàng trả lại sách (hoàn tiền) hoặc đổi sang sách khác dựa trên hóa đơn đã mua, đồng thời cập nhật tồn kho và thông tin giao dịch liên quan. |
| **Tiền điều kiện** | Nhân viên bán hàng đã tra cứu và mở chi tiết hóa đơn gốc cần xử lý đổi/trả. |
| **Hậu điều kiện** | Phiếu đổi/trả hàng được lưu trữ, số tiền hoàn lại hoặc thu thêm được ghi nhận và số lượng tồn kho của các đầu sách liên quan được cập nhật chính xác. |
| **Dòng sự kiện chính** | 1. Từ giao diện chi tiết hóa đơn gốc, nhân viên bán hàng chọn "Tạo phiếu Đổi / Trả hàng".<br>2. Hệ thống kiểm tra thời hạn cho phép đổi/trả (ví dụ: trong vòng 7 ngày kể từ ngày lập hóa đơn) và hiển thị danh sách sách thuộc hóa đơn gốc.<br>3. Nhân viên chọn các đầu sách khách muốn trả/đổi, nhập số lượng trả, ghi nhận tình trạng sách và lý do đổi/trả.<br>4. Nếu là **Trả hàng**: Hệ thống tính toán số tiền cần hoàn lại cho khách dựa trên đơn giá thực bán (đã trừ chiết khấu tương ứng trên hóa đơn gốc).<br>5. Nếu là **Đổi hàng**: Nhân viên quét mã hoặc chọn đầu sách mới khách muốn đổi; hệ thống tính toán chênh lệch giá tiền (số tiền khách cần bù thêm hoặc cửa hàng hoàn lại).<br>6. Nhân viên kiểm tra lại thông tin phiếu và nhấn "Xác nhận hoàn tất".<br>7. Hệ thống lưu phiếu đổi/trả hàng, ghi nhận giao dịch hoàn tiền/thu bù và tự động cập nhật lại tồn kho (cộng lại số lượng sách cũ trả về, trừ số lượng sách mới đổi ra). |
| **Dòng sự kiện phụ** | • **Hóa đơn quá thời hạn đổi/trả:** Hệ thống cảnh báo "Hóa đơn đã quá thời hạn đổi/trả cho phép" và khóa thao tác tạo phiếu.<br>• **Sách không đủ điều kiện vật lý (rách, ướt, hư hỏng):** Nhân viên từ chối tiếp nhận và nhấn "Hủy", hệ thống đóng quy trình mà không thay đổi dữ liệu.<br>• **Số lượng trả vượt quá số lượng đã mua:** Hệ thống cảnh báo và không cho phép nhập số lượng trả lớn hơn số lượng còn lại trên hóa đơn gốc.<br>• **Sách mới muốn đổi đã hết tồn kho:** Hệ thống cảnh báo "Sách muốn đổi hiện không đủ tồn kho" và yêu cầu chọn đầu sách khác hoặc chuyển sang hình thức trả hàng. |
