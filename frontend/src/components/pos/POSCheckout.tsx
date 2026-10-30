'use client';

import React, { useState, useEffect } from 'react';
import { Book } from '@/models/Book';
import { Order } from '@/models/Order';
import { Customer } from '@/models/Customer';
import { Invoice } from '@/models/Invoice';
import { BookService } from '@/services/BookService';
import { OrderService } from '@/services/OrderService';
import { BookList } from '../books/BookList';
import { CartDrawer } from '../cart/CartDrawer';
import { InvoiceModal } from '../invoice/InvoiceModal';
import type { PaymentMethod } from '@/types/dtos';
import { CreditCard, Banknote, QrCode, Smartphone, Barcode, UserCheck, AlertTriangle } from 'lucide-react';

export const POSCheckout: React.FC = () => {
  // Services
  const [bookService] = useState(() => new BookService());
  const [orderService] = useState(() => new OrderService());

  // Data states
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState<Order>(() => orderService.createNewOrder('Thu ngân 01'));
  
  // Checkout Modal states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [paidAmountInput, setPaidAmountInput] = useState<string>('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Success Invoice state
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [generatedInvoice, setGeneratedInvoice] = useState<Invoice | null>(null);

  // Barcode quick input
  const [barcodeInput, setBarcodeInput] = useState('');

  // Sample customers for loyalty simulation
  const [sampleCustomers] = useState<Customer[]>([
    new Customer({ id: 'u1', fullName: 'Khách vãng lai', phoneNumber: '0000000000', tier: 'STANDARD' }),
    new Customer({ id: 'u2', fullName: 'Nguyễn Văn An (Silver - 5%)', phoneNumber: '0901234567', loyaltyPoints: 250, tier: 'SILVER' }),
    new Customer({ id: 'u3', fullName: 'Trần Thị Mai (Gold - 10%)', phoneNumber: '0987654321', loyaltyPoints: 750, tier: 'GOLD' }),
  ]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(sampleCustomers[0]);

  // Load books
  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (err) {
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // Update order state helper
  const triggerOrderUpdate = () => {
    setActiveOrder(Object.assign(Object.create(Object.getPrototypeOf(activeOrder)), activeOrder));
  };

  // Add Book to Cart
  const handleAddToCart = (book: Book) => {
    try {
      activeOrder.addItem(book, 1);
      triggerOrderUpdate();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi thêm vào giỏ hàng');
    }
  };

  // Barcode quick add
  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    try {
      const book = await bookService.findByIsbn(barcodeInput.trim());
      if (book) {
        handleAddToCart(book);
        setBarcodeInput('');
      } else {
        alert(`Không tìm thấy sách với mã ISBN: ${barcodeInput}`);
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi quét barcode');
    }
  };

  // Update quantity
  const handleUpdateQuantity = (bookId: string, quantity: number) => {
    const book = books.find(b => b.getId() === bookId);
    try {
      activeOrder.updateItemQuantity(bookId, quantity, book?.stockQuantity);
      triggerOrderUpdate();
    } catch (err: any) {
      alert(err.message || 'Lỗi điều chỉnh số lượng');
    }
  };

  // Remove Item
  const handleRemoveItem = (bookId: string) => {
    activeOrder.removeItem(bookId);
    triggerOrderUpdate();
  };

  // Clear Cart
  const handleClearCart = () => {
    if (confirm('Bạn có chắc muốn xóa sạch đơn hàng này?')) {
      activeOrder.clear();
      triggerOrderUpdate();
    }
  };

  // Customer selection change
  const handleCustomerChange = (customerId: string) => {
    const customer = sampleCustomers.find(c => c.getId() === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      activeOrder.applyCustomerDiscount(customer);
      triggerOrderUpdate();
    }
  };

  // Open checkout modal
  const handleProceedCheckout = () => {
    setPaidAmountInput(activeOrder.calculateFinalTotal().toString());
    setCheckoutError(null);
    setIsCheckoutOpen(true);
  };

  // Confirm Payment
  const handleConfirmPayment = async () => {
    const paidAmount = parseFloat(paidAmountInput);
    if (isNaN(paidAmount) || paidAmount <= 0) {
      setCheckoutError('Vui lòng nhập số tiền hợp lệ.');
      return;
    }

    try {
      const result = await orderService.checkout(activeOrder, paymentMethod, paidAmount);
      
      // Save for Invoice Modal
      setCompletedOrder(result.order);
      setGeneratedInvoice(result.invoice);
      
      // Close Checkout & Open Invoice
      setIsCheckoutOpen(false);
      setIsInvoiceOpen(true);

      // Reset new order & reload books to reflect stock
      setActiveOrder(orderService.createNewOrder('Thu ngân 01'));
      loadBooks();
    } catch (err: any) {
      setCheckoutError(err.message || 'Thanh toán thất bại.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Top Barcode & Member Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Barcode scanner */}
        <form onSubmit={handleBarcodeSubmit} className="flex gap-2 w-full md:w-auto flex-1 max-w-md">
          <div className="relative flex-1">
            <Barcode className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Quét mã vạch hoặc nhập ISBN rồi nhấn Enter..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors"
          >
            Quét
          </button>
        </form>

        {/* Member Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <UserCheck className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Khách hàng:</span>
          <select
            value={selectedCustomer.getId()}
            onChange={(e) => handleCustomerChange(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {sampleCustomers.map(c => (
              <option key={c.getId()} value={c.getId()}>
                {c.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Books (Left) & Cart Drawer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Đang tải danh mục sách...</div>
          ) : (
            <BookList books={books} onAddToCart={handleAddToCart} />
          )}
        </div>

        <div className="lg:col-span-1">
          <CartDrawer
            order={activeOrder}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onProceedCheckout={handleProceedCheckout}
          />
        </div>
      </div>

      {/* Checkout Payment Dialog */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">
              Xác Nhận Thanh Toán Đơn Hàng
            </h3>

            {checkoutError && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{checkoutError}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Chọn phương thức thanh toán</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'CASH', label: 'Tiền mặt', icon: Banknote },
                  { id: 'BANK_TRANSFER', label: 'Chuyển khoản', icon: QrCode },
                  { id: 'MOMO', label: 'Ví MoMo', icon: Smartphone },
                  { id: 'CARD', label: 'Quẹt thẻ', icon: CreditCard },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id as PaymentMethod)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Tổng tiền hàng:</span>
                <span className="font-semibold text-slate-700">
                  {formatCurrency(activeOrder.calculateSubtotal())}
                </span>
              </div>
              {activeOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Chiết khấu khách hàng:</span>
                  <span className="font-semibold">-{formatCurrency(activeOrder.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Thuế GTGT (VAT 8%):</span>
                <span className="font-semibold text-slate-700">
                  {formatCurrency(activeOrder.calculateTax())}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
                <span>Cần thanh toán:</span>
                <span className="text-indigo-600 text-base">
                  {formatCurrency(activeOrder.calculateFinalTotal())}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Số tiền khách đưa (VNĐ)
              </label>
              <input
                type="number"
                value={paidAmountInput}
                onChange={(e) => setPaidAmountInput(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {parseFloat(paidAmountInput) > activeOrder.calculateFinalTotal() && (
                <p className="text-xs text-emerald-600 font-semibold text-right">
                  Tiền thối lại: {formatCurrency(parseFloat(paidAmountInput) - activeOrder.calculateFinalTotal())}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 shadow-sm"
              >
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Receipt Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        invoice={generatedInvoice}
        order={completedOrder}
      />
    </div>
  );
};
