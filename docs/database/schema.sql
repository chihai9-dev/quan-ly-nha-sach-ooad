-- ==============================================================================
-- HỆ THỐNG QUẢN LÝ NHÀ SÁCH (BOOKSTORE MANAGEMENT SYSTEM)
-- SCRIPT TẠO CƠ SỞ DỮ LIỆU POSTGRESQL TRÊN SUPABASE (DDL & SEED DATA)
-- MÔN HỌC: PHÂN TÍCH VÀ THIẾT KẾ HƯỚNG ĐỐI TƯỢNG (OOAD)
-- ==============================================================================

-- 1. Bật extension tạo UUID tự động
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Xóa bảng cũ nếu tồn tại (để reset khi cần)
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 3. Tạo bảng categories (Danh mục sách)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tạo bảng books (Sách trong kho)
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    isbn VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publisher VARCHAR(255),
    publish_year INT,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    cover_url TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tạo bảng customers (Khách hàng & Thành viên)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    loyalty_points INT NOT NULL DEFAULT 0 CHECK (loyalty_points >= 0),
    tier VARCHAR(50) NOT NULL DEFAULT 'STANDARD', -- STANDARD, SILVER, GOLD, PLATINUM
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tạo bảng orders (Đơn hàng)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, COMPLETED, CANCELLED
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    cashier_name VARCHAR(255) DEFAULT 'Thu ngân 01',
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tạo bảng order_items (Chi tiết từng mục trong đơn hàng)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Tạo bảng invoices (Hóa đơn xuất cho khách hàng)
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_code VARCHAR(50) UNIQUE NOT NULL,
    order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE RESTRICT,
    payment_method VARCHAR(50) NOT NULL, -- CASH, BANK_TRANSFER, MOMO, CARD
    paid_amount NUMERIC(12, 2) NOT NULL CHECK (paid_amount >= 0),
    change_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (change_amount >= 0),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PAID', -- PAID, REFUNDED
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Trigger tự động cập nhật `updated_at`
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_modtime BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_books_modtime BEFORE UPDATE ON books FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_customers_modtime BEFORE UPDATE ON customers FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ==============================================================================
-- DỮ LIỆU MẪU (SEED DATA ĐỂ THỰC HÀNH VÀ DEMO ĐỒ ÁN)
-- ==============================================================================

-- Seed Categories
INSERT INTO categories (id, code, name, description) VALUES
('c1111111-1111-1111-1111-111111111111', 'CNTT', 'Công nghệ thông tin', 'Sách lập trình, thiết kế hệ thống, cơ sở dữ liệu'),
('c2222222-2222-2222-2222-222222222222', 'KINH_TE', 'Kinh tế & Quản trị', 'Sách kinh doanh, marketing, khởi nghiệp, tài chính'),
('c3333333-3333-3333-3333-333333333333', 'VAN_HOC', 'Văn học & Tiểu thuyết', 'Tác phẩm văn học trong nước và quốc tế kinh điển'),
('c4444444-4444-4444-4444-444444444444', 'KY_NANG', 'Kỹ năng sống', 'Phát triển bản thân, giao tiếp, tư duy tích cực');

-- Seed Books
INSERT INTO books (id, isbn, title, author, publisher, publish_year, price, stock_quantity, cover_url, category_id) VALUES
('b1111111-1111-1111-1111-111111111111', '978-0132350884', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', 'Prentice Hall', 2008, 320000, 25, 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=500&q=80', 'c1111111-1111-1111-1111-111111111111'),
('b2222222-2222-2222-2222-222222222222', '978-0201633610', 'Design Patterns: Elements of Reusable Object-Oriented Software', 'Erich Gamma et al. (GoF)', 'Addison-Wesley', 1994, 450000, 15, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80', 'c1111111-1111-1111-1111-111111111111'),
('b3333333-3333-3333-3333-333333333333', '978-0134494166', 'Clean Architecture: A Craftsman''s Guide to Software Structure', 'Robert C. Martin', 'Prentice Hall', 2017, 380000, 18, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80', 'c1111111-1111-1111-1111-111111111111'),
('b4444444-4444-4444-4444-444444444444', '978-0062316097', 'Sapiens: Lược Sử Loài Người', 'Yuval Noah Harari', 'NXB Tri Thức', 2014, 210000, 40, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80', 'c3333333-3333-3333-3333-333333333333'),
('b5555555-5555-5555-5555-555555555555', '978-0743273565', 'Đắc Nhân Tâm (How to Win Friends and Influence People)', 'Dale Carnegie', 'NXB Tổng hợp TP.HCM', 2016, 120000, 50, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80', 'c4444444-4444-4444-4444-444444444444'),
('b6666666-6666-6666-6666-666666666666', '978-0061122415', 'Nhà Giả Kim (The Alchemist)', 'Paulo Coelho', 'NXB Văn Học', 2013, 85000, 35, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80', 'c3333333-3333-3333-3333-333333333333');

-- Seed Customers
INSERT INTO customers (id, full_name, phone_number, email, loyalty_points, tier) VALUES
('u1111111-1111-1111-1111-111111111111', 'Nguyễn Văn An', '0901234567', 'an.nguyen@example.com', 250, 'SILVER'),
('u2222222-2222-2222-2222-222222222222', 'Trần Thị Mai', '0987654321', 'mai.tran@example.com', 750, 'GOLD'),
('u3333333-3333-3333-3333-333333333333', 'Lê Hoàng Nam', '0912345678', 'nam.le@example.com', 40, 'STANDARD');
