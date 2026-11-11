/* Bookstore Management System – UI prototype (mock data, no backend).
   Thuật ngữ theo docs/ubiquitous-language.md: Book, Category, Customer, Order, Invoice, POS, MembershipTier, PaymentMethod. */
(function () {
  'use strict';

  var ICONS = {
    dashboard: '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
    pos: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
    invoice: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>',
    book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
    box: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    tag: '<path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.42 0l8.58-8.58a1 1 0 0 0 0-1.42Z"/><circle cx="7" cy="7" r="1"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    chart: '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    print: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>'
  };
  function icon(name) { return '<svg class="i" viewBox="0 0 24 24">' + ICONS[name] + '</svg>'; }

  var COLORS = ['#4f46e5', '#0891b2', '#be185d', '#b45309', '#15803d', '#7c3aed', '#be123c', '#0f766e'];
  var BOOKS = [
    { id: 'S001', isbn: '978-604-2-12345-1', title: 'Nhà Giả Kim', author: 'Paulo Coelho', publisher: 'NXB Hội Nhà Văn', category: 'Văn học', price: 79000, stock: 42, min: 10 },
    { id: 'S002', isbn: '978-604-1-23456-2', title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', publisher: 'NXB Tổng hợp TP.HCM', category: 'Kỹ năng', price: 86000, stock: 8, min: 15 },
    { id: 'S003', isbn: '978-604-5-34567-3', title: 'Sapiens: Lược Sử Loài Người', author: 'Yuval Noah Harari', publisher: 'NXB Thế Giới', category: 'Khoa học', price: 189000, stock: 25, min: 10 },
    { id: 'S004', isbn: '978-604-2-45678-4', title: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', author: 'Nguyễn Nhật Ánh', publisher: 'NXB Trẻ', category: 'Văn học', price: 98000, stock: 60, min: 20 },
    { id: 'S005', isbn: '978-604-1-56789-5', title: 'Cấu Trúc Dữ Liệu và Giải Thuật', author: 'Nguyễn Đức Nghĩa', publisher: 'NXB Giáo Dục', category: 'Giáo trình', price: 135000, stock: 0, min: 5 },
    { id: 'S006', isbn: '978-604-5-67890-6', title: 'Atomic Habits', author: 'James Clear', publisher: 'NXB Thế Giới', category: 'Kỹ năng', price: 149000, stock: 33, min: 10 },
    { id: 'S007', isbn: '978-604-2-78901-7', title: 'Dế Mèn Phiêu Lưu Ký', author: 'Tô Hoài', publisher: 'NXB Kim Đồng', category: 'Thiếu nhi', price: 62000, stock: 5, min: 12 },
    { id: 'S008', isbn: '978-604-1-89012-8', title: 'Tư Duy Nhanh Và Chậm', author: 'Daniel Kahneman', publisher: 'NXB Thế Giới', category: 'Khoa học', price: 169000, stock: 18, min: 8 }
  ];
  var CUSTOMERS = [
    { id: 'KH001', name: 'Nguyễn Văn An', phone: '0901 234 567', tier: 'GOLD', points: 1280, discount: 0.05 },
    { id: 'KH002', name: 'Trần Thị Bình', phone: '0912 345 678', tier: 'SILVER', points: 540, discount: 0.03 },
    { id: 'KH003', name: 'Lê Hoàng Cường', phone: '0987 654 321', tier: 'STANDARD', points: 90, discount: 0 }
  ];
  var INVOICES = [
    { id: 'HD-240915', date: '09/11/2026 14:32', customer: 'Nguyễn Văn An', cashier: 'Thu ngân Lan', method: 'CASH', status: 'PAID', total: 312550, items: [['S001', 2], ['S006', 1]] },
    { id: 'HD-240914', date: '09/11/2026 13:05', customer: 'Khách lẻ', cashier: 'Thu ngân Lan', method: 'MOMO', status: 'PAID', total: 189000, items: [['S003', 1]] },
    { id: 'HD-240913', date: '09/11/2026 11:48', customer: 'Trần Thị Bình', cashier: 'Thu ngân Minh', method: 'CARD', status: 'RETURNED', total: 172000, items: [['S002', 2]] },
    { id: 'HD-240912', date: '08/11/2026 19:20', customer: 'Lê Hoàng Cường', cashier: 'Thu ngân Minh', method: 'BANK_TRANSFER', status: 'PAID', total: 445000, items: [['S004', 3], ['S008', 1]] },
    { id: 'HD-240911', date: '08/11/2026 16:02', customer: 'Khách lẻ', cashier: 'Thu ngân Lan', method: 'CASH', status: 'PAID', total: 62000, items: [['S007', 1]] }
  ];
  var METHOD = { CASH: 'Tiền mặt', BANK_TRANSFER: 'Chuyển khoản', MOMO: 'MoMo', CARD: 'Thẻ' };
  var TIER_CLASS = { STANDARD: 'gray', SILVER: 'info', GOLD: 'warn', PLATINUM: 'ok' };
  var VAT_RATE = 0.08;

  function money(n) { return n.toLocaleString('vi-VN') + ' ₫'; }
  function bookById(id) { return BOOKS.find(function (b) { return b.id === id; }); }
  function colorOf(id) { return COLORS[BOOKS.findIndex(function (b) { return b.id === id; }) % COLORS.length]; }
  function cover(b, big) {
    return '<div class="cover' + (big ? ' big' : '') + '" style="background:' + colorOf(b.id) + '">' + b.title.split(' ').slice(0, 2).join(' ') + '</div>';
  }
  function stockBadge(b) {
    if (b.stock <= 0) return '<span class="badge bad">Hết hàng</span>';
    if (b.stock <= b.min) return '<span class="badge warn">Sắp hết (' + b.stock + ')</span>';
    return '<span class="badge ok">Còn ' + b.stock + '</span>';
  }

  /* ---------- Shell ---------- */
  var NAV = [
    ['Tổng quan', [['dashboard', 'dashboard', 'Dashboard'], ['pos', 'pos', 'Bán hàng (POS)'], ['invoice', 'invoices', 'Hóa đơn']]],
    ['Danh mục', [['book', 'books', 'Sách'], ['box', 'inventory', 'Kho', 1], ['truck', 'receipts', 'Nhập hàng', 1], ['users', 'customers', 'Khách hàng', 1], ['tag', 'promotions', 'Khuyến mãi', 1]]],
    ['Hệ thống', [['chart', 'reports', 'Báo cáo', 1], ['settings', 'staff', 'Nhân viên & Phân quyền', 1]]]
  ];
  function shell(active, title, body, actions) {
    var nav = NAV.map(function (g) {
      return '<div class="nav-label">' + g[0] + '</div>' + g[1].map(function (n) {
        return '<a href="#/' + (n[3] ? active : n[1]) + '" class="' + (n[1] === active ? 'active ' : '') + (n[3] ? 'soon' : '') + '">' + icon(n[0]) + n[2] + '</a>';
      }).join('');
    }).join('');
    return '<div class="app"><aside class="sidebar"><div class="brand"><div class="logo">' + icon('book') + '</div>Nhà Sách An Bình</div><nav class="nav">' + nav +
      '</nav><div class="me"><div class="avatar">L</div><div class="grow"><b>Thu ngân Lan</b><div style="color:#64748b;font-size:12px">Thu ngân</div></div><a href="#/login" title="Đăng xuất">' + icon('logout') + '</a></div></aside>' +
      '<div class="main"><div class="topbar"><h1>' + title + '</h1><div class="row">' + (actions || '') + '<span style="color:#94a3b8">' + icon('bell') + '</span></div></div><div class="content">' + body + '</div></div></div>';
  }

  /* ---------- Screens ---------- */
  function login() {
    return '<div class="login"><div class="hero"><div class="brand" style="color:#fff;padding:0"><div class="logo" style="background:#fff;color:#4338ca">' + icon('book') + '</div>Nhà Sách An Bình</div>' +
      '<div><h2>Quản lý nhà sách gọn gàng, bán hàng nhanh hơn.</h2><p>Bán hàng tại quầy, kiểm soát tồn kho theo thời gian thực và theo dõi công nợ nhà cung cấp trong một hệ thống.</p></div><small>© 2026 Bookstore Management System</small></div>' +
      '<div class="form"><form onsubmit="location.hash=\'#/dashboard\';return false"><div><h1>Đăng nhập</h1><p style="color:#64748b;margin-top:6px">Nhập tài khoản nhân viên để bắt đầu ca làm việc.</p></div>' +
      '<div class="field"><label>Tên đăng nhập</label><input class="input" value="thungan.lan" /></div>' +
      '<div class="field"><label>Mật khẩu</label><input class="input" type="password" value="••••••••" /></div>' +
      '<div class="row"><label class="row" style="gap:8px"><input type="checkbox" checked /> Ghi nhớ đăng nhập</label><span class="grow"></span><a class="link" href="#/login">Quên mật khẩu?</a></div>' +
      '<button class="btn primary lg" type="submit">Đăng nhập</button></form></div></div>';
  }

  function dashboard() {
    var rev = [['T2', 62], ['T3', 48], ['T4', 71], ['T5', 55], ['T6', 90], ['T7', 100], ['CN', 78]];
    var bars = rev.map(function (r) { return '<div class="b' + (r[0] === 'T7' ? ' hi' : '') + '"><i style="height:' + r[1] + '%"></i>' + r[0] + '</div>'; }).join('');
    var top = BOOKS.slice().sort(function (a, b) { return a.stock - b.stock; }).slice(0, 0);
    var best = [['S004', 128], ['S001', 96], ['S006', 81], ['S003', 64]].map(function (x, i) {
      var b = bookById(x[0]);
      return '<div class="list-line"><div class="row">' + '<b style="color:#94a3b8;width:16px">' + (i + 1) + '</b>' + cover(b) + '<div><b>' + b.title + '</b><div style="color:#64748b;font-size:12px">' + b.author + '</div></div></div><b>' + x[1] + ' cuốn</b></div>';
    }).join('');
    var low = BOOKS.filter(function (b) { return b.stock <= b.min; }).map(function (b) {
      return '<div class="list-line"><div><b>' + b.title + '</b><div style="color:#64748b;font-size:12px">Tối thiểu ' + b.min + '</div></div>' + stockBadge(b) + '</div>';
    }).join('');
    var stats = [['Doanh thu hôm nay', '12.450.000 ₫', '▲ 12% so với hôm qua', 'up'], ['Số hóa đơn', '38', '▲ 5 so với hôm qua', 'up'], ['Sách sắp hết hàng', String(BOOKS.filter(function (b) { return b.stock <= b.min; }).length), 'Cần nhập thêm', 'down'], ['Công nợ NCC sắp đến hạn', '3 khoản', '48.200.000 ₫ trong 7 ngày', 'down']]
      .map(function (s) { return '<div class="card stat"><div class="label">' + s[0] + '</div><div class="value">' + s[1] + '</div><div class="delta ' + s[3] + '">' + s[2] + '</div></div>'; }).join('');
    void top;
    return shell('dashboard', 'Dashboard', '<div class="stat-grid">' + stats + '</div>' +
      '<div class="cols-2"><div class="card"><h3>Doanh thu 7 ngày gần nhất (triệu ₫)</h3><div class="bars">' + bars + '</div></div><div class="card"><h3>Cảnh báo tồn kho</h3>' + low + '</div></div>' +
      '<div class="card"><h3>Sách bán chạy trong tháng</h3>' + best + '</div>');
  }

  /* POS state */
  var pos = { cart: {}, q: '', cat: 'Tất cả', customer: null, voucher: '', method: 'CASH', receipt: null, voucherOk: false };
  function posTotals() {
    var sub = 0;
    Object.keys(pos.cart).forEach(function (id) { sub += bookById(id).price * pos.cart[id]; });
    var tier = pos.customer ? Math.round(sub * pos.customer.discount) : 0;
    var vch = pos.voucherOk ? Math.round(sub * 0.1) : 0;
    var vat = Math.round((sub - tier - vch) * VAT_RATE);
    return { sub: sub, tier: tier, vch: vch, vat: vat, total: sub - tier - vch + vat };
  }
  function posView() {
    var cats = ['Tất cả'].concat(BOOKS.map(function (b) { return b.category; }).filter(function (c, i, a) { return a.indexOf(c) === i; }));
    var chips = cats.map(function (c) { return '<button class="chip' + (c === pos.cat ? ' on' : '') + '" data-act="cat" data-v="' + c + '">' + c + '</button>'; }).join('');
    var q = pos.q.trim().toLowerCase();
    var list = BOOKS.filter(function (b) {
      return (pos.cat === 'Tất cả' || b.category === pos.cat) && (!q || (b.title + b.author + b.id + b.isbn + b.publisher).toLowerCase().indexOf(q) >= 0);
    });
    var tiles = list.map(function (b) {
      return '<button class="book-tile' + (b.stock <= 0 ? ' out' : '') + '" data-act="add" data-v="' + b.id + '">' + cover(b) + '<div><div class="t">' + b.title + '</div><div class="meta">' + b.author + '</div><b style="color:#4338ca">' + money(b.price) + '</b><div style="margin-top:6px">' + stockBadge(b) + '</div></div></button>';
    }).join('') || '<div class="empty" style="grid-column:1/-1">Không tìm thấy sách phù hợp.</div>';
    var ids = Object.keys(pos.cart);
    var items = ids.map(function (id) {
      var b = bookById(id), n = pos.cart[id];
      return '<div class="cart-item">' + cover(b) + '<div class="grow"><b>' + b.title + '</b><div style="color:#64748b;font-size:12px">' + money(b.price) + '</div></div><div class="qty"><button data-act="dec" data-v="' + id + '">−</button><span>' + n + '</span><button data-act="inc" data-v="' + id + '">+</button></div><button class="btn danger" style="padding:6px" data-act="rm" data-v="' + id + '">' + icon('trash') + '</button></div>';
    }).join('') || '<div class="empty">Chưa có sách trong đơn hàng.<br/>Chọn sách bên trái để thêm.</div>';
    var t = posTotals();
    var cust = pos.customer
      ? '<div class="row"><div class="avatar">' + pos.customer.name[0] + '</div><div class="grow"><b>' + pos.customer.name + '</b><div style="color:#64748b;font-size:12px">' + pos.customer.phone + ' · ' + pos.customer.points + ' điểm</div></div><span class="badge ' + TIER_CLASS[pos.customer.tier] + '">' + pos.customer.tier + '</span><button class="btn" style="padding:6px 10px" data-act="nocust">Bỏ</button></div>'
      : '<div class="row"><div class="search">' + icon('search') + '<input class="input" id="custq" placeholder="SĐT hoặc tên khách hàng…" /></div><button class="btn" data-act="cust">Tìm</button></div>';
    var pay = Object.keys(METHOD).map(function (m) { return '<button class="pay' + (m === pos.method ? ' on' : '') + '" data-act="method" data-v="' + m + '">' + METHOD[m] + '</button>'; }).join('');
    var left = '<div style="display:flex;flex-direction:column;gap:16px"><div class="row"><div class="search">' + icon('search') + '<input class="input" id="posq" placeholder="Tìm theo tên, mã sách, ISBN, tác giả, NXB…" value="' + pos.q.replace(/"/g, '&quot;') + '" /></div></div><div class="chips">' + chips + '</div><div class="book-grid">' + tiles + '</div></div>';
    var right = '<div class="cart"><div class="card"><h3>Khách hàng</h3>' + cust + '</div><div class="card"><h3>Đơn hàng (' + ids.length + ' đầu sách)</h3>' + items +
      '<div class="row" style="margin:14px 0"><input class="input" id="vch" placeholder="Mã giảm giá (thử: SACH10)" value="' + pos.voucher + '" /><button class="btn" data-act="voucher">Áp dụng</button></div>' +
      (pos.voucher && !pos.voucherOk ? '<div class="field"><span class="hint">Mã không hợp lệ hoặc hết hạn.</span></div>' : '') +
      '<div class="sum"><span>Tạm tính</span><span>' + money(t.sub) + '</span></div>' +
      (t.tier ? '<div class="sum"><span>Ưu đãi hạng thành viên</span><span class="up">−' + money(t.tier) + '</span></div>' : '') +
      (t.vch ? '<div class="sum"><span>Voucher SACH10</span><span class="up">−' + money(t.vch) + '</span></div>' : '') +
      '<div class="sum"><span>VAT (8%)</span><span>' + money(t.vat) + '</span></div><div class="sum total"><span>Tổng thanh toán</span><span>' + money(t.total) + '</span></div></div>' +
      '<div class="card"><h3>Phương thức thanh toán</h3><div class="pay-methods">' + pay + '</div></div>' +
      '<button class="btn primary lg" data-act="checkout"' + (ids.length ? '' : ' disabled style="opacity:.5"') + '>Thanh toán ' + (ids.length ? money(t.total) : '') + '</button></div>';
    var modal = '';
    if (pos.receipt) {
      var r = pos.receipt;
      modal = '<div class="modal-bg"><div class="modal"><div style="text-align:center"><div class="badge ok" style="font-size:14px">✓ Thanh toán thành công</div><h2 style="margin-top:12px">' + r.id + '</h2></div><div class="invoice-paper">' +
        r.lines.map(function (l) { return '<div class="ln"><span>' + l[1] + ' × ' + l[0] + '</span><span>' + money(l[2]) + '</span></div>'; }).join('') +
        '<hr style="border:0;border-top:1px dashed #cbd5e1;margin:8px 0"/><div class="ln"><b>TỔNG</b><b>' + money(r.total) + '</b></div><div class="ln"><span>' + METHOD[r.method] + '</span><span>' + r.time + '</span></div></div>' +
        '<div class="row"><button class="btn grow" style="justify-content:center">' + icon('print') + 'In hóa đơn</button><button class="btn primary grow" style="justify-content:center" data-act="newOrder">Đơn mới</button></div></div></div>';
    }
    return shell('pos', 'Bán hàng (POS)', '<div class="pos">' + left + right + '</div>' + modal);
  }

  function invoices() {
    var rows = INVOICES.map(function (v) {
      var st = v.status === 'PAID' ? '<span class="badge ok">Đã thanh toán</span>' : '<span class="badge warn">Đã trả hàng</span>';
      return '<tr class="click" onclick="location.hash=\'#/invoices/' + v.id + '\'"><td><b>' + v.id + '</b></td><td>' + v.date + '</td><td>' + v.customer + '</td><td>' + v.cashier + '</td><td>' + METHOD[v.method] + '</td><td class="num"><b>' + money(v.total) + '</b></td><td>' + st + '</td></tr>';
    }).join('');
    return shell('invoices', 'Hóa đơn', '<div class="row"><div class="search">' + icon('search') + '<input class="input" placeholder="Tìm theo mã hóa đơn, khách hàng, thu ngân…" /></div><select class="select" style="width:180px"><option>Hôm nay</option><option>7 ngày</option><option>Tháng này</option></select><select class="select" style="width:180px"><option>Mọi trạng thái</option></select></div>' +
      '<div class="table-wrap"><table><thead><tr><th>Mã hóa đơn</th><th>Thời gian</th><th>Khách hàng</th><th>Thu ngân</th><th>Thanh toán</th><th class="num">Tổng tiền</th><th>Trạng thái</th></tr></thead><tbody>' + rows + '</tbody></table><div class="pager"><span>Hiển thị 5 / 38 hóa đơn</span><div class="row"><button class="btn">Trước</button><button class="btn primary">1</button><button class="btn">2</button><button class="btn">Sau</button></div></div></div>');
  }
  function invoiceDetail(id) {
    var v = INVOICES.find(function (x) { return x.id === id; });
    if (!v) return shell('invoices', 'Hóa đơn', '<div class="empty">Không tìm thấy hóa đơn.</div>');
    var rows = v.items.map(function (it) {
      var b = bookById(it[0]);
      return '<tr><td><div class="row">' + cover(b) + '<div><b>' + b.title + '</b><div style="color:#64748b;font-size:12px">' + b.id + '</div></div></div></td><td class="num">' + money(b.price) + '</td><td class="num">' + it[1] + '</td><td class="num"><b>' + money(b.price * it[1]) + '</b></td></tr>';
    }).join('');
    var actions = '<a class="btn" href="#/invoices">' + icon('back') + 'Quay lại</a><button class="btn">' + icon('print') + 'In</button><button class="btn danger">' + icon('undo') + 'Trả / đổi hàng</button>';
    return shell('invoices', 'Hóa đơn ' + v.id, '<div class="cols-2"><div class="table-wrap"><table><thead><tr><th>Sách (OrderItem)</th><th class="num">Đơn giá</th><th class="num">SL</th><th class="num">Thành tiền</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div class="card"><h3>Thông tin</h3><dl class="kv"><dt>Thời gian</dt><dd>' + v.date + '</dd><dt>Khách hàng</dt><dd>' + v.customer + '</dd><dt>Thu ngân</dt><dd>' + v.cashier + '</dd><dt>Thanh toán</dt><dd>' + METHOD[v.method] + '</dd><dt>Trạng thái</dt><dd>' + (v.status === 'PAID' ? '<span class="badge ok">Đã thanh toán</span>' : '<span class="badge warn">Đã trả hàng</span>') + '</dd><dt>Tổng tiền</dt><dd><b style="font-size:18px">' + money(v.total) + '</b></dd></dl></div></div>', actions);
  }

  var books = { q: '', cat: 'Tất cả' };
  function booksList() {
    var cats = ['Tất cả'].concat(BOOKS.map(function (b) { return b.category; }).filter(function (c, i, a) { return a.indexOf(c) === i; }));
    var chips = cats.map(function (c) { return '<button class="chip' + (c === books.cat ? ' on' : '') + '" data-act="bcat" data-v="' + c + '">' + c + '</button>'; }).join('');
    var q = books.q.trim().toLowerCase();
    var list = BOOKS.filter(function (b) { return (books.cat === 'Tất cả' || b.category === books.cat) && (!q || (b.title + b.author + b.id + b.isbn).toLowerCase().indexOf(q) >= 0); });
    var rows = list.map(function (b) {
      return '<tr class="click" onclick="location.hash=\'#/books/' + b.id + '\'"><td><div class="row">' + cover(b) + '<div><b>' + b.title + '</b><div style="color:#64748b;font-size:12px">' + b.id + ' · ' + b.isbn + '</div></div></div></td><td>' + b.author + '</td><td>' + b.publisher + '</td><td><span class="badge gray">' + b.category + '</span></td><td class="num"><b>' + money(b.price) + '</b></td><td>' + stockBadge(b) + '</td></tr>';
    }).join('') || '<tr><td colspan="6" class="empty">Không có sách phù hợp.</td></tr>';
    return shell('books', 'Sách', '<div class="row"><div class="search">' + icon('search') + '<input class="input" id="bq" placeholder="Tìm theo tên, mã sách, ISBN, tác giả…" value="' + books.q + '" /></div></div><div class="chips">' + chips + '</div>' +
      '<div class="table-wrap"><table><thead><tr><th>Sách</th><th>Tác giả</th><th>Nhà xuất bản</th><th>Thể loại</th><th class="num">Giá bán</th><th>Tồn kho</th></tr></thead><tbody>' + rows + '</tbody></table><div class="pager"><span>' + list.length + ' đầu sách</span></div></div>',
      '<a class="btn primary" href="#/books/new">' + icon('plus') + 'Thêm sách</a>');
  }
  function bookDetail(id) {
    var b = bookById(id);
    if (!b) return shell('books', 'Sách', '<div class="empty">Không tìm thấy sách.</div>');
    return shell('books', b.title, '<div class="cols-2"><div class="card"><div class="detail-head">' + cover(b, true) + '<dl class="kv grow"><dt>Mã sách</dt><dd>' + b.id + '</dd><dt>ISBN</dt><dd>' + b.isbn + '</dd><dt>Tác giả</dt><dd>' + b.author + '</dd><dt>Nhà xuất bản</dt><dd>' + b.publisher + '</dd><dt>Thể loại</dt><dd>' + b.category + '</dd><dt>Giá bán</dt><dd><b style="font-size:18px">' + money(b.price) + '</b></dd></dl></div></div>' +
      '<div class="card"><h3>Tồn kho</h3><div class="value" style="font-size:32px;font-weight:700">' + b.stock + ' <span style="font-size:14px;color:#64748b;font-weight:500">cuốn</span></div><div style="margin:8px 0 14px">' + stockBadge(b) + '</div><dl class="kv"><dt>Ngưỡng tối thiểu</dt><dd>' + b.min + '</dd></dl></div></div>',
      '<a class="btn" href="#/books">' + icon('back') + 'Quay lại</a><a class="btn primary" href="#/books/new">Chỉnh sửa</a>');
  }
  function bookForm() {
    var cats = ['Văn học', 'Kỹ năng', 'Khoa học', 'Giáo trình', 'Thiếu nhi'].map(function (c) { return '<option>' + c + '</option>'; }).join('');
    return shell('books', 'Thêm sách mới', '<div class="card" style="max-width:860px"><div class="form-grid">' +
      '<div class="field full"><label>Tên sách *</label><input class="input" placeholder="VD: Nhà Giả Kim" /></div>' +
      '<div class="field"><label>Mã sách / ISBN *</label><input class="input" placeholder="978-…" /></div>' +
      '<div class="field"><label>Giá bán (₫) *</label><input class="input" value="-5000" /><span class="hint">Giá bán không được âm.</span></div>' +
      '<div class="field"><label>Tác giả *</label><input class="input" placeholder="Chọn hoặc nhập tác giả" /></div>' +
      '<div class="field"><label>Nhà xuất bản *</label><select class="select"><option>NXB Trẻ</option><option>NXB Kim Đồng</option><option>NXB Thế Giới</option></select></div>' +
      '<div class="field"><label>Thể loại *</label><select class="select">' + cats + '</select></div>' +
      '<div class="field"><label>Ngưỡng tồn tối thiểu</label><input class="input" value="10" /></div></div>' +
      '<div class="row" style="justify-content:flex-end;margin-top:24px"><a class="btn" href="#/books">Hủy</a><a class="btn primary" href="#/books">Lưu sách</a></div></div>');
  }

  /* ---------- Router & events ---------- */
  var root = document.getElementById('root');
  function render() {
    var h = (location.hash || '#/login').replace(/^#\//, '').split('/');
    var html;
    if (h[0] === 'login') html = login();
    else if (h[0] === 'dashboard') html = dashboard();
    else if (h[0] === 'pos') html = posView();
    else if (h[0] === 'invoices') html = h[1] ? invoiceDetail(h[1]) : invoices();
    else if (h[0] === 'books') html = h[1] === 'new' ? bookForm() : h[1] ? bookDetail(h[1]) : booksList();
    else html = dashboard();
    root.innerHTML = html;
    var pq = document.getElementById('posq');
    if (pq) pq.addEventListener('input', function () { pos.q = pq.value; render(); var e = document.getElementById('posq'); e.focus(); e.setSelectionRange(e.value.length, e.value.length); });
    var bq = document.getElementById('bq');
    if (bq) bq.addEventListener('input', function () { books.q = bq.value; render(); var e = document.getElementById('bq'); e.focus(); e.setSelectionRange(e.value.length, e.value.length); });
  }
  root.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-act]');
    if (!el) return;
    var act = el.dataset.act, v = el.dataset.v;
    if (act === 'cat') pos.cat = v;
    else if (act === 'bcat') books.cat = v;
    else if (act === 'add') { var b = bookById(v); if (b.stock > 0) pos.cart[v] = Math.min((pos.cart[v] || 0) + 1, b.stock); }
    else if (act === 'inc') pos.cart[v] = Math.min(pos.cart[v] + 1, bookById(v).stock);
    else if (act === 'dec') { pos.cart[v] -= 1; if (pos.cart[v] <= 0) delete pos.cart[v]; }
    else if (act === 'rm') delete pos.cart[v];
    else if (act === 'method') pos.method = v;
    else if (act === 'nocust') pos.customer = null;
    else if (act === 'cust') {
      var qv = (document.getElementById('custq').value || '').replace(/\s/g, '').toLowerCase();
      pos.customer = CUSTOMERS.find(function (c) { return qv && (c.phone.replace(/\s/g, '').indexOf(qv) >= 0 || c.name.toLowerCase().indexOf(qv) >= 0); }) || CUSTOMERS[0];
    } else if (act === 'voucher') {
      pos.voucher = document.getElementById('vch').value.trim().toUpperCase();
      pos.voucherOk = pos.voucher === 'SACH10';
    } else if (act === 'checkout') {
      var t = posTotals();
      pos.receipt = { id: 'HD-240916', total: t.total, method: pos.method, time: '09/11/2026 15:20', lines: Object.keys(pos.cart).map(function (id) { return [bookById(id).title, pos.cart[id], bookById(id).price * pos.cart[id]]; }) };
    } else if (act === 'newOrder') pos = { cart: {}, q: '', cat: 'Tất cả', customer: null, voucher: '', method: 'CASH', receipt: null, voucherOk: false };
    render();
  });
  window.addEventListener('hashchange', render);
  render();
})();
