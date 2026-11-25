import { bookstoreStore, computeAlertStatus } from '@/lib/mock/bookstoreStore';
import type { FullReportDTO } from '@/types/dtos';

export class ReportService {
  async getFullReport(): Promise<FullReportDTO> {
    const books = bookstoreStore.books;
    const suppliers = bookstoreStore.suppliers;
    const returns = bookstoreStore.returns;

    const bestsellers = [...books]
      .sort((a, b) => b.soldQuantity - a.soldQuantity)
      .map((b) => ({
        bookId: b.id,
        title: b.title,
        categoryName: b.categoryName,
        soldQuantity: b.soldQuantity,
        revenue: b.soldQuantity * b.price,
        stockQuantity: b.stockQuantity,
      }));

    const totalRevenue = bestsellers.reduce((sum, b) => sum + b.revenue, 0);
    const totalRefunds = returns.reduce((sum, r) => sum + Math.max(0, r.refundAmount), 0);
    const netRevenue = Math.max(0, totalRevenue - totalRefunds);
    const totalOrders = Math.max(
      1,
      bookstoreStore.customers.reduce((sum, c) => sum + c.orderCount, 0)
    );

    const revenueByMethod = [
      { method: 'CASH' as const, label: 'Tiền mặt', orderCount: Math.round(totalOrders * 0.45), revenue: Math.round(totalRevenue * 0.42) },
      { method: 'BANK_TRANSFER' as const, label: 'Chuyển khoản', orderCount: Math.round(totalOrders * 0.30), revenue: Math.round(totalRevenue * 0.33) },
      { method: 'MOMO' as const, label: 'Ví MoMo', orderCount: Math.round(totalOrders * 0.15), revenue: Math.round(totalRevenue * 0.14) },
      { method: 'CARD' as const, label: 'Thẻ ngân hàng', orderCount: Math.max(1, totalOrders - Math.round(totalOrders * 0.9)), revenue: Math.max(0, totalRevenue - Math.round(totalRevenue * 0.89)) },
    ];

    const inventoryItems = books.map((b) => ({
      bookId: b.id,
      isbn: b.isbn,
      title: b.title,
      categoryName: b.categoryName,
      price: b.price,
      costPrice: b.costPrice,
      stockQuantity: b.stockQuantity,
      minStockThreshold: b.minStockThreshold,
      maxStockThreshold: b.maxStockThreshold,
      soldQuantity: b.soldQuantity,
      businessStatus: b.businessStatus,
      alertStatus: computeAlertStatus(b.stockQuantity, b.minStockThreshold, b.maxStockThreshold),
    }));

    return {
      generatedAt: new Date().toISOString(),
      totalRevenue,
      totalOrders,
      totalRefunds,
      netRevenue,
      revenueByMethod,
      bestsellers,
      inventory: {
        totalTitles: inventoryItems.length,
        totalUnits: inventoryItems.reduce((sum, i) => sum + i.stockQuantity, 0),
        totalInventoryValue: inventoryItems.reduce((sum, i) => sum + i.stockQuantity * i.costPrice, 0),
        lowStockCount: inventoryItems.filter((i) => i.alertStatus === 'LOW').length,
        overstockCount: inventoryItems.filter((i) => i.alertStatus === 'OVERSTOCK').length,
        items: inventoryItems,
      },
      supplierDebt: {
        totalSuppliers: suppliers.length,
        totalImported: suppliers.reduce((sum, s) => sum + s.totalImported, 0),
        totalPaid: suppliers.reduce((sum, s) => sum + s.totalPaid, 0),
        totalRemainingDebt: suppliers.reduce((sum, s) => sum + s.currentDebt, 0),
        suppliers: [...suppliers],
      },
    };
  }
}
