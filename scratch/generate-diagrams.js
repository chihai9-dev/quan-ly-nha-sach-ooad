const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function encodeDrawioUrl(xml) {
  const compressed = zlib.deflateRawSync(encodeURIComponent(xml)).toString('base64');
  return `https://app.diagrams.net/?grid=1&pv=0&border=10&edit=_blank#R${encodeURIComponent(compressed)}`;
}

// -------------------------------------------------------------------------------------------------
// Helper: build a UML class cell in draw.io
// -------------------------------------------------------------------------------------------------
function createUmlClass({ id, name, stereotype, attributes = [], methods = [], x, y, width, height, fillColor = '#dae8fc', strokeColor = '#6c8ebf' }) {
  let headerHtml = '';
  if (stereotype) {
    headerHtml += `&lt;p style=&quot;margin:0px;text-align:center;font-size:11px;font-style:italic;&quot;&gt;&amp;laquo;${stereotype}&amp;raquo;&lt;/p&gt;`;
  }
  headerHtml += `&lt;p style=&quot;margin:0px;text-align:center;&quot;&gt;&lt;b&gt;${name}&lt;/b&gt;&lt;/p&gt;`;

  let attrHtml = attributes.map(a => `${a.replace(/</g, '&lt;').replace(/>/g, '&gt;')}`).join('&lt;br/&gt;');
  let methHtml = methods.map(m => `${m.replace(/</g, '&lt;').replace(/>/g, '&gt;')}`).join('&lt;br/&gt;');

  let val = `${headerHtml}&lt;hr size=&quot;1&quot;/&gt;&lt;p style=&quot;margin:0px;text-align:left;font-size:11px;&quot;&gt;${attrHtml}&lt;/p&gt;`;
  if (methods.length > 0) {
    val += `&lt;hr size=&quot;1&quot;/&gt;&lt;p style=&quot;margin:0px;text-align:left;font-size:11px;&quot;&gt;${methHtml}&lt;/p&gt;`;
  }

  const style = `rounded=0;whiteSpace=wrap;html=1;align=left;verticalAlign=top;fillColor=${fillColor};strokeColor=${strokeColor};fontFamily=Consolas,monospace;spacing=6;`;
  return `    <mxCell id="${id}" value="${val}" style="${style}" vertex="1" parent="1">\n      <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/>\n    </mxCell>`;
}

function createConnector({ id, source, target, label = '', type = 'association', styleExtra = '' }) {
  let style = 'edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;fontFamily=Arial;fontSize=11;';
  if (type === 'inheritance') {
    style += 'endArrow=block;endSize=14;endFill=0;strokeWidth=1.5;';
  } else if (type === 'realization') {
    style += 'dashed=1;endArrow=block;endSize=14;endFill=0;strokeWidth=1.5;';
  } else if (type === 'composition') {
    style += 'startArrow=diamond;startSize=14;startFill=1;endArrow=none;strokeWidth=1.5;';
  } else if (type === 'aggregation') {
    style += 'startArrow=diamond;startSize=14;startFill=0;endArrow=none;strokeWidth=1.5;';
  } else if (type === 'dependency') {
    style += 'dashed=1;endArrow=open;endSize=10;strokeWidth=1.2;';
  } else {
    style += 'endArrow=open;endSize=10;strokeWidth=1.2;';
  }
  if (styleExtra) {
    style += styleExtra;
  }
  return `    <mxCell id="${id}" value="${label}" style="${style}" edge="1" source="${source}" target="${target}" parent="1">\n      <mxGeometry relative="1" as="geometry"/>\n    </mxCell>`;
}

// -------------------------------------------------------------------------------------------------
// 1. CLASS DIAGRAM QUẢN LÝ BÁN HÀNG
// -------------------------------------------------------------------------------------------------
function generateSalesDiagram() {
  const cells = [];

  // Group Box / Layer header
  cells.push(`    <mxCell id="bg_domain" value="&lt;b&gt;DOMAIN MODEL LAYER&lt;/b&gt;" style="swimlane;startSize=24;fillColor=#f5f5f5;fontColor=#333333;strokeColor=#cccccc;rounded=1;fontStyle=1;align=left;spacingLeft=10;" vertex="1" parent="1">\n      <mxGeometry x="20" y="20" width="1240" height="740" as="geometry"/>\n    </mxCell>`);
  cells.push(`    <mxCell id="bg_service" value="&lt;b&gt;APPLICATION SERVICES &amp; REPOSITORIES LAYER&lt;/b&gt;" style="swimlane;startSize=24;fillColor=#f8f9fa;fontColor=#333333;strokeColor=#b3b3b3;rounded=1;fontStyle=1;align=left;spacingLeft=10;" vertex="1" parent="1">\n      <mxGeometry x="20" y="780" width="1240" height="380" as="geometry"/>\n    </mxCell>`);

  // Domain Classes
  cells.push(createUmlClass({
    id: 'c_BaseEntity',
    name: 'BaseEntity',
    stereotype: 'abstract',
    attributes: [
      '# id: string',
      '# createdAt: Date',
      '# updatedAt: Date'
    ],
    methods: [
      '+ getId(): string',
      '+ getCreatedAt(): Date',
      '+ getUpdatedAt(): Date',
      '# touch(): void'
    ],
    x: 520, y: 50, width: 220, height: 140,
    fillColor: '#fff2cc', strokeColor: '#d6b656'
  }));

  cells.push(createUmlClass({
    id: 'c_Order',
    name: 'Order',
    stereotype: 'Aggregate Root',
    attributes: [
      '- orderCode: string',
      '- customerId: string | null',
      '- cashierName: string',
      '- items: List&lt;OrderItem&gt;',
      '- status: OrderStatus',
      '- discountAmount: number',
      '- taxRate: number = 0.08',
      '- note: string'
    ],
    methods: [
      '+ addItem(book: Book, quantity: number): void',
      '+ removeItem(bookId: string): void',
      '+ updateItemQuantity(bookId: string, qty: number): void',
      '+ clear(): void',
      '+ calculateSubtotal(): number',
      '+ applyCustomerDiscount(customer: Customer): void',
      '+ setDiscountAmount(amount: number): void',
      '+ calculateTax(): number',
      '+ calculateFinalTotal(): number',
      '+ complete(): void',
      '+ cancel(reason: string): void'
    ],
    x: 480, y: 240, width: 310, height: 260,
    fillColor: '#dae8fc', strokeColor: '#6c8ebf'
  }));

  cells.push(createUmlClass({
    id: 'c_OrderItem',
    name: 'OrderItem',
    attributes: [
      '- id: string',
      '- bookId: string',
      '- bookTitle: string',
      '- bookIsbn: string',
      '- unitPrice: number',
      '- quantity: number',
      '- coverUrl: string'
    ],
    methods: [
      '+ getSubtotal(): number',
      '+ increaseQuantity(amount: number): void',
      '+ decreaseQuantity(amount: number): void',
      '+ setQuantity(qty: number): void'
    ],
    x: 80, y: 250, width: 260, height: 210,
    fillColor: '#dae8fc', strokeColor: '#6c8ebf'
  }));

  cells.push(createUmlClass({
    id: 'c_Book',
    name: 'Book',
    attributes: [
      '- isbn: string',
      '- title: string',
      '- author: string',
      '- publisher: string',
      '- publishYear: number',
      '- price: number',
      '- stockQuantity: number',
      '- coverUrl: string'
    ],
    methods: [
      '+ isAvailable(requestedQty: number): boolean',
      '+ reduceStock(quantity: number): void',
      '+ increaseStock(quantity: number): void'
    ],
    x: 80, y: 520, width: 260, height: 210,
    fillColor: '#d5e8d4', strokeColor: '#82b366'
  }));

  cells.push(createUmlClass({
    id: 'c_Customer',
    name: 'Customer',
    attributes: [
      '- fullName: string',
      '- phoneNumber: string',
      '- email: string',
      '- loyaltyPoints: number',
      '- tier: MembershipTier'
    ],
    methods: [
      '+ getDiscountRate(): number',
      '+ addLoyaltyPoints(amount: number): void',
      '+ updateTier(): void'
    ],
    x: 900, y: 240, width: 240, height: 180,
    fillColor: '#e1d5e7', strokeColor: '#9673a6'
  }));

  cells.push(createUmlClass({
    id: 'c_Invoice',
    name: 'Invoice',
    attributes: [
      '- invoiceCode: string',
      '- orderId: string',
      '- paymentMethod: PaymentMethod',
      '- paidAmount: number',
      '- changeAmount: number',
      '- paymentStatus: PaymentStatus',
      '- issuedAt: Date'
    ],
    methods: [
      '+ processPayment(totalDue: number): void',
      '+ markAsRefunded(): void'
    ],
    x: 510, y: 540, width: 260, height: 190,
    fillColor: '#ffe6cc', strokeColor: '#d79b00'
  }));

  cells.push(createUmlClass({
    id: 'c_ReturnExchangeNote',
    name: 'ReturnExchangeNote',
    attributes: [
      '- returnCode: string',
      '- invoiceId: string',
      '- returnReason: string',
      '- returnDate: Date',
      '- totalRefundAmount: number',
      '- totalAdditionalAmount: number',
      '- netAdjustmentAmount: number',
      '- status: ReturnStatus',
      '- items: List&lt;ReturnExchangeItem&gt;'
    ],
    methods: [
      '+ addReturnItem(book: Book, qty: number): void',
      '+ addExchangeItem(book: Book, qty: number): void',
      '+ calculateDifference(): number',
      '+ confirm(): void'
    ],
    x: 880, y: 460, width: 280, height: 250,
    fillColor: '#f8cecc', strokeColor: '#b85450'
  }));

  // Service & Repository Layer
  cells.push(createUmlClass({
    id: 'c_OrderService',
    name: 'OrderService',
    stereotype: 'Application Service',
    attributes: [
      '- orderRepository: IOrderRepository',
      '- invoiceRepository: IInvoiceRepository',
      '- bookRepository: IBookRepository',
      '- promotionService: PromotionService'
    ],
    methods: [
      '+ createNewOrder(cashierName: string): Order',
      '+ addItemToOrder(order: Order, bookId: string, qty: number): Promise&lt;void&gt;',
      '+ applyPromotion(order: Order, campaignId: string): Promise&lt;void&gt;',
      '+ applyCoupon(order: Order, couponCode: string): Promise&lt;void&gt;',
      '+ checkout(order: Order, method: PaymentMethod, paid: number): Promise&lt;CheckoutResult&gt;',
      '+ searchOrders(criteria: OrderSearchCriteria): Promise&lt;List&lt;Order&gt;&gt;'
    ],
    x: 460, y: 820, width: 360, height: 200,
    fillColor: '#d0e0e3', strokeColor: '#76a5af'
  }));

  cells.push(createUmlClass({
    id: 'c_IOrderRepository',
    name: 'IOrderRepository',
    stereotype: 'interface',
    attributes: [],
    methods: [
      '+ findById(id: string): Promise&lt;Order | null&gt;',
      '+ findByCode(code: string): Promise&lt;Order | null&gt;',
      '+ saveOrder(order: Order): Promise&lt;void&gt;',
      '+ searchOrders(criteria: Criteria): Promise&lt;List&lt;Order&gt;&gt;'
    ],
    x: 80, y: 820, width: 280, height: 130,
    fillColor: '#f5f5f5', strokeColor: '#666666'
  }));

  cells.push(createUmlClass({
    id: 'c_OrderRepository',
    name: 'OrderRepository',
    attributes: [
      '- supabase: SupabaseClient'
    ],
    methods: [
      '+ findById(id: string): Promise&lt;Order | null&gt;',
      '+ findByCode(code: string): Promise&lt;Order | null&gt;',
      '+ saveOrder(order: Order): Promise&lt;void&gt;',
      '+ searchOrders(criteria: Criteria): Promise&lt;List&lt;Order&gt;&gt;'
    ],
    x: 80, y: 990, width: 280, height: 130,
    fillColor: '#ffffff', strokeColor: '#666666'
  }));

  cells.push(createUmlClass({
    id: 'c_IPaymentStrategy',
    name: 'PaymentStrategy',
    stereotype: 'interface (Strategy)',
    attributes: [],
    methods: [
      '+ pay(amount: number, metadata: Object): PaymentResult'
    ],
    x: 910, y: 820, width: 270, height: 80,
    fillColor: '#e1d5e7', strokeColor: '#9673a6'
  }));

  cells.push(createUmlClass({
    id: 'c_PaymentImplementations',
    name: 'Payment Implementations',
    stereotype: 'Strategies',
    attributes: [],
    methods: [
      'CashPaymentStrategy::pay()',
      'BankTransferPaymentStrategy::pay()',
      'MomoPaymentStrategy::pay()',
      'CardPaymentStrategy::pay()'
    ],
    x: 910, y: 940, width: 270, height: 130,
    fillColor: '#ffffff', strokeColor: '#9673a6'
  }));

  // Connectors
  cells.push(createConnector({ id: 'rel_order_base', source: 'c_Order', target: 'c_BaseEntity', type: 'inheritance' }));
  cells.push(createConnector({ id: 'rel_invoice_base', source: 'c_Invoice', target: 'c_BaseEntity', type: 'inheritance' }));
  cells.push(createConnector({ id: 'rel_customer_base', source: 'c_Customer', target: 'c_BaseEntity', type: 'inheritance' }));
  cells.push(createConnector({ id: 'rel_book_base', source: 'c_Book', target: 'c_BaseEntity', type: 'inheritance' }));
  cells.push(createConnector({ id: 'rel_return_base', source: 'c_ReturnExchangeNote', target: 'c_BaseEntity', type: 'inheritance' }));

  cells.push(createConnector({ id: 'rel_order_items', source: 'c_Order', target: 'c_OrderItem', label: '1   contains   1..*', type: 'composition' }));
  cells.push(createConnector({ id: 'rel_item_book', source: 'c_OrderItem', target: 'c_Book', label: '*   refers to   1', type: 'association' }));
  cells.push(createConnector({ id: 'rel_order_customer', source: 'c_Order', target: 'c_Customer', label: '*   placed by   0..1', type: 'aggregation' }));
  cells.push(createConnector({ id: 'rel_order_invoice', source: 'c_Order', target: 'c_Invoice', label: '1   generates   1', type: 'association' }));
  cells.push(createConnector({ id: 'rel_return_invoice', source: 'c_ReturnExchangeNote', target: 'c_Invoice', label: '*   refunds   1', type: 'association' }));

  cells.push(createConnector({ id: 'rel_service_order_repo', source: 'c_OrderService', target: 'c_IOrderRepository', label: 'uses', type: 'association' }));
  cells.push(createConnector({ id: 'rel_repo_impl', source: 'c_OrderRepository', target: 'c_IOrderRepository', type: 'realization' }));
  cells.push(createConnector({ id: 'rel_service_order', source: 'c_OrderService', target: 'c_Order', label: 'manages', type: 'dependency' }));
  cells.push(createConnector({ id: 'rel_service_strategy', source: 'c_OrderService', target: 'c_IPaymentStrategy', label: 'delegates', type: 'dependency' }));
  cells.push(createConnector({ id: 'rel_strategy_impl', source: 'c_PaymentImplementations', target: 'c_IPaymentStrategy', type: 'realization' }));

  const xml = `<mxGraphModel adaptiveColors="auto">\n  <root>\n    <mxCell id="0"/>\n    <mxCell id="1" parent="0"/>\n${cells.join('\n')}\n  </root>\n</mxGraphModel>`;
  return xml;
}

// -------------------------------------------------------------------------------------------------
// 2. CLASS DIAGRAM QUẢN LÝ KHUYẾN MÃI
// -------------------------------------------------------------------------------------------------
function generatePromotionDiagram() {
  const cells = [];

  cells.push(`    <mxCell id="bg_domain" value="&lt;b&gt;DOMAIN LAYER - QUẢN LÝ KHUYẾN MÃI&lt;/b&gt;" style="swimlane;startSize=24;fillColor=#f5f5f5;fontColor=#333333;strokeColor=#cccccc;rounded=1;fontStyle=1;align=left;spacingLeft=10;" vertex="1" parent="1">\n      <mxGeometry x="20" y="20" width="1240" height="740" as="geometry"/>\n    </mxCell>`);
  cells.push(`    <mxCell id="bg_service" value="&lt;b&gt;APPLICATION SERVICES &amp; REPOSITORIES&lt;/b&gt;" style="swimlane;startSize=24;fillColor=#f8f9fa;fontColor=#333333;strokeColor=#b3b3b3;rounded=1;fontStyle=1;align=left;spacingLeft=10;" vertex="1" parent="1">\n      <mxGeometry x="20" y="780" width="1240" height="380" as="geometry"/>\n    </mxCell>`);

  // Base Entity
  cells.push(createUmlClass({
    id: 'p_BaseEntity',
    name: 'BaseEntity',
    stereotype: 'abstract',
    attributes: [
      '# id: string',
      '# createdAt: Date',
      '# updatedAt: Date'
    ],
    methods: [
      '+ getId(): string',
      '+ getCreatedAt(): Date',
      '+ getUpdatedAt(): Date',
      '# touch(): void'
    ],
    x: 520, y: 50, width: 220, height: 140,
    fillColor: '#fff2cc', strokeColor: '#d6b656'
  }));

  // PromotionCampaign
  cells.push(createUmlClass({
    id: 'p_PromotionCampaign',
    name: 'PromotionCampaign',
    stereotype: 'Aggregate Root',
    attributes: [
      '- campaignCode: string',
      '- title: string',
      '- description: string',
      '- promotionType: PromotionType',
      '- discountValue: number',
      '- scope: PromotionScope',
      '- startDate: Date',
      '- endDate: Date',
      '- status: PromotionStatus',
      '- minOrderAmount: number = 0',
      '- applicableBookIds: List&lt;string&gt;',
      '- applicableCategoryIds: List&lt;string&gt;'
    ],
    methods: [
      '+ isValid(currentDate: Date): boolean',
      '+ isApplicableToBook(bookId: string, categoryId: string): boolean',
      '+ calculateDiscount(orderSubtotal: number, items: List&lt;OrderItem&gt;): number',
      '+ cancel(): void',
      '+ updateDetails(props: UpdatePromotionProps): void',
      '+ validateRules(): ValidationResult'
    ],
    x: 140, y: 240, width: 360, height: 280,
    fillColor: '#d5e8d4', strokeColor: '#82b366'
  }));

  // DiscountCoupon
  cells.push(createUmlClass({
    id: 'p_DiscountCoupon',
    name: 'DiscountCoupon',
    stereotype: 'Entity (Voucher)',
    attributes: [
      '- code: string',
      '- discountType: CouponDiscountType',
      '- discountValue: number',
      '- maxDiscountAmount: number | null',
      '- minOrderAmount: number',
      '- maxUsageCount: number',
      '- currentUsageCount: number',
      '- startDate: Date',
      '- expiryDate: Date',
      '- status: CouponStatus'
    ],
    methods: [
      '+ isValid(orderTotal: number, currentDate: Date): boolean',
      '+ calculateDiscount(orderTotal: number): number',
      '+ recordUsage(): void',
      '+ isExpired(currentDate: Date): boolean',
      '+ isExhausted(): boolean'
    ],
    x: 570, y: 240, width: 320, height: 260,
    fillColor: '#ffe6cc', strokeColor: '#d79b00'
  }));

  // CouponUsageHistory
  cells.push(createUmlClass({
    id: 'p_CouponUsageHistory',
    name: 'CouponUsageHistory',
    stereotype: 'Audit Entity',
    attributes: [
      '- couponId: string',
      '- orderId: string',
      '- invoiceId: string',
      '- customerId: string | null',
      '- customerName: string',
      '- usedAt: Date',
      '- discountAmount: number',
      '- orderTotalBeforeDiscount: number'
    ],
    methods: [
      '+ getSummary(): string'
    ],
    x: 950, y: 260, width: 270, height: 200,
    fillColor: '#e1d5e7', strokeColor: '#9673a6'
  }));

  // Strategy Pattern for Promotion
  cells.push(createUmlClass({
    id: 'p_IPromotionStrategy',
    name: 'PromotionStrategy',
    stereotype: 'interface (Strategy)',
    attributes: [],
    methods: [
      '+ calculateDiscount(campaign: PromotionCampaign, context: EvalContext): number'
    ],
    x: 180, y: 560, width: 330, height: 80,
    fillColor: '#fff2cc', strokeColor: '#d6b656'
  }));

  cells.push(createUmlClass({
    id: 'p_PromotionStrategiesImpl',
    name: 'Promotion Calculation Strategies',
    stereotype: 'Implementations',
    attributes: [],
    methods: [
      'PercentageDiscountStrategy::calculateDiscount()',
      'FixedAmountDiscountStrategy::calculateDiscount()',
      'ComboBundleDiscountStrategy::calculateDiscount()'
    ],
    x: 180, y: 660, width: 330, height: 90,
    fillColor: '#ffffff', strokeColor: '#d6b656'
  }));

  // Service Layer
  cells.push(createUmlClass({
    id: 'p_PromotionService',
    name: 'PromotionService',
    stereotype: 'Application Service',
    attributes: [
      '- promotionRepository: IPromotionRepository',
      '- couponRepository: IDiscountCouponRepository',
      '- bookRepository: IBookRepository'
    ],
    methods: [
      '+ getActivePromotions(date: Date): Promise&lt;List&lt;PromotionCampaign&gt;&gt;',
      '+ createPromotion(dto: CreatePromotionDTO): Promise&lt;PromotionCampaign&gt;',
      '+ updatePromotion(id: string, dto: UpdatePromotionDTO): Promise&lt;PromotionCampaign&gt;',
      '+ cancelPromotion(id: string): Promise&lt;void&gt;',
      '+ checkProductConflict(bookIds: List&lt;string&gt;, start: Date, end: Date): Promise&lt;boolean&gt;',
      '+ issueCoupon(dto: CreateCouponDTO): Promise&lt;DiscountCoupon&gt;',
      '+ validateAndApplyCoupon(code: string, subtotal: number): Promise&lt;CouponResult&gt;',
      '+ getCouponUsageHistory(couponId: string): Promise&lt;List&lt;CouponUsageHistory&gt;&gt;',
      '+ evaluateOrderPromotions(order: Order): Promise&lt;PromotionEvaluationResult&gt;'
    ],
    x: 560, y: 820, width: 380, height: 230,
    fillColor: '#d0e0e3', strokeColor: '#76a5af'
  }));

  // Repositories
  cells.push(createUmlClass({
    id: 'p_IPromotionRepository',
    name: 'IPromotionRepository',
    stereotype: 'interface',
    attributes: [],
    methods: [
      '+ findById(id: string): Promise&lt;PromotionCampaign | null&gt;',
      '+ findActive(date: Date): Promise&lt;List&lt;PromotionCampaign&gt;&gt;',
      '+ save(campaign: PromotionCampaign): Promise&lt;void&gt;',
      '+ checkOverlap(bookIds: List&lt;string&gt;, start: Date, end: Date): Promise&lt;List&lt;PromotionCampaign&gt;&gt;'
    ],
    x: 100, y: 820, width: 360, height: 130,
    fillColor: '#f5f5f5', strokeColor: '#666666'
  }));

  cells.push(createUmlClass({
    id: 'p_IDiscountCouponRepository',
    name: 'IDiscountCouponRepository',
    stereotype: 'interface',
    attributes: [],
    methods: [
      '+ findByCode(code: string): Promise&lt;DiscountCoupon | null&gt;',
      '+ save(coupon: DiscountCoupon): Promise&lt;void&gt;',
      '+ recordUsage(history: CouponUsageHistory): Promise&lt;void&gt;',
      '+ getUsageHistory(couponId: string): Promise&lt;List&lt;CouponUsageHistory&gt;&gt;'
    ],
    x: 100, y: 970, width: 360, height: 130,
    fillColor: '#f5f5f5', strokeColor: '#666666'
  }));

  // Connectors
  cells.push(createConnector({ id: 'rel_p_campaign_base', source: 'p_PromotionCampaign', target: 'p_BaseEntity', type: 'inheritance' }));
  cells.push(createConnector({ id: 'rel_p_coupon_base', source: 'p_DiscountCoupon', target: 'p_BaseEntity', type: 'inheritance' }));
  cells.push(createConnector({ id: 'rel_p_history_base', source: 'p_CouponUsageHistory', target: 'p_BaseEntity', type: 'inheritance' }));

  cells.push(createConnector({ id: 'rel_p_coupon_history', source: 'p_DiscountCoupon', target: 'p_CouponUsageHistory', label: '1   tracks   0..*', type: 'aggregation' }));
  cells.push(createConnector({ id: 'rel_p_strategy_impl', source: 'p_PromotionStrategiesImpl', target: 'p_IPromotionStrategy', type: 'realization' }));
  cells.push(createConnector({ id: 'rel_p_campaign_strategy', source: 'p_PromotionCampaign', target: 'p_IPromotionStrategy', label: 'uses', type: 'association' }));

  cells.push(createConnector({ id: 'rel_p_service_promorepo', source: 'p_PromotionService', target: 'p_IPromotionRepository', label: 'uses', type: 'association' }));
  cells.push(createConnector({ id: 'rel_p_service_couponrepo', source: 'p_PromotionService', target: 'p_IDiscountCouponRepository', label: 'uses', type: 'association' }));
  cells.push(createConnector({ id: 'rel_p_service_domain', source: 'p_PromotionService', target: 'p_PromotionCampaign', label: 'manages', type: 'dependency' }));
  cells.push(createConnector({ id: 'rel_p_service_coupon', source: 'p_PromotionService', target: 'p_DiscountCoupon', label: 'manages', type: 'dependency' }));

  const xml = `<mxGraphModel adaptiveColors="auto">\n  <root>\n    <mxCell id="0"/>\n    <mxCell id="1" parent="0"/>\n${cells.join('\n')}\n  </root>\n</mxGraphModel>`;
  return xml;
}

// -------------------------------------------------------------------------------------------------
// 3. CLASS DIAGRAM TỔNG HỢP (BÁN HÀNG & KHUYẾN MÃI TƯƠNG TÁC)
// -------------------------------------------------------------------------------------------------
function generateIntegratedDiagram() {
  const cells = [];

  cells.push(`    <mxCell id="bg_sales" value="&lt;b&gt;PHÂN HỆ QUẢN LÝ BÁN HÀNG (SALES MANAGEMENT)&lt;/b&gt;" style="swimlane;startSize=24;fillColor=#ebf1f5;fontColor=#1f497d;strokeColor=#4f81bd;rounded=1;fontStyle=1;align=left;spacingLeft=10;" vertex="1" parent="1">\n      <mxGeometry x="20" y="20" width="760" height="980" as="geometry"/>\n    </mxCell>`);
  cells.push(`    <mxCell id="bg_promo" value="&lt;b&gt;PHÂN HỆ QUẢN LÝ KHUYẾN MÃI (PROMOTION MANAGEMENT)&lt;/b&gt;" style="swimlane;startSize=24;fillColor=#f2f8eb;fontColor=#385723;strokeColor=#77933c;rounded=1;fontStyle=1;align=left;spacingLeft=10;" vertex="1" parent="1">\n      <mxGeometry x="820" y="20" width="680" height="980" as="geometry"/>\n    </mxCell>`);

  // Sales domain
  cells.push(createUmlClass({
    id: 'int_Order',
    name: 'Order',
    stereotype: 'Aggregate Root',
    attributes: [
      '- orderCode: string',
      '- customerId: string | null',
      '- cashierName: string',
      '- status: OrderStatus',
      '- discountAmount: number',
      '- taxRate: number',
      '- appliedCouponCode: string | null'
    ],
    methods: [
      '+ addItem(book: Book, qty: number): void',
      '+ calculateSubtotal(): number',
      '+ applyPromotion(campaign: PromotionCampaign): void',
      '+ applyCoupon(coupon: DiscountCoupon): void',
      '+ calculateFinalTotal(): number',
      '+ complete(): void'
    ],
    x: 400, y: 160, width: 330, height: 230,
    fillColor: '#dae8fc', strokeColor: '#6c8ebf'
  }));

  cells.push(createUmlClass({
    id: 'int_OrderItem',
    name: 'OrderItem',
    attributes: [
      '- bookId: string',
      '- unitPrice: number',
      '- quantity: number'
    ],
    methods: [
      '+ getSubtotal(): number',
      '+ setQuantity(qty: number): void'
    ],
    x: 60, y: 180, width: 220, height: 140,
    fillColor: '#dae8fc', strokeColor: '#6c8ebf'
  }));

  cells.push(createUmlClass({
    id: 'int_Book',
    name: 'Book',
    attributes: [
      '- isbn: string',
      '- title: string',
      '- price: number',
      '- stockQuantity: number'
    ],
    methods: [
      '+ isAvailable(qty: number): boolean',
      '+ reduceStock(qty: number): void'
    ],
    x: 60, y: 400, width: 220, height: 160,
    fillColor: '#d5e8d4', strokeColor: '#82b366'
  }));

  cells.push(createUmlClass({
    id: 'int_Invoice',
    name: 'Invoice',
    attributes: [
      '- invoiceCode: string',
      '- orderId: string',
      '- paymentMethod: PaymentMethod',
      '- paidAmount: number',
      '- changeAmount: number'
    ],
    methods: [
      '+ processPayment(totalDue: number): void'
    ],
    x: 430, y: 460, width: 270, height: 150,
    fillColor: '#ffe6cc', strokeColor: '#d79b00'
  }));

  // Sales Service
  cells.push(createUmlClass({
    id: 'int_OrderService',
    name: 'OrderService',
    stereotype: 'Application Service',
    attributes: [
      '- orderRepository: IOrderRepository',
      '- bookRepository: IBookRepository',
      '- promotionService: PromotionService'
    ],
    methods: [
      '+ createNewOrder(cashier: string): Order',
      '+ applyAutoPromotions(order: Order): Promise&lt;void&gt;',
      '+ applyCoupon(order: Order, code: string): Promise&lt;void&gt;',
      '+ checkout(order: Order, method: PaymentMethod, paid: number): Promise&lt;CheckoutResult&gt;'
    ],
    x: 390, y: 730, width: 350, height: 180,
    fillColor: '#d0e0e3', strokeColor: '#76a5af'
  }));

  // Promotion Domain
  cells.push(createUmlClass({
    id: 'int_PromotionCampaign',
    name: 'PromotionCampaign',
    stereotype: 'Aggregate Root',
    attributes: [
      '- campaignCode: string',
      '- title: string',
      '- promotionType: PromotionType',
      '- discountValue: number',
      '- scope: PromotionScope',
      '- startDate: Date',
      '- endDate: Date'
    ],
    methods: [
      '+ isValid(currentDate: Date): boolean',
      '+ isApplicableToBook(bookId: string, categoryId: string): boolean',
      '+ calculateDiscount(orderSubtotal: number, items: List&lt;OrderItem&gt;): number'
    ],
    x: 870, y: 160, width: 330, height: 210,
    fillColor: '#d5e8d4', strokeColor: '#82b366'
  }));

  cells.push(createUmlClass({
    id: 'int_DiscountCoupon',
    name: 'DiscountCoupon',
    stereotype: 'Entity',
    attributes: [
      '- code: string',
      '- discountType: CouponDiscountType',
      '- discountValue: number',
      '- minOrderAmount: number',
      '- maxUsageCount: number',
      '- currentUsageCount: number'
    ],
    methods: [
      '+ isValid(orderTotal: number, currentDate: Date): boolean',
      '+ calculateDiscount(orderTotal: number): number',
      '+ recordUsage(): void'
    ],
    x: 1220, y: 160, width: 260, height: 210,
    fillColor: '#ffe6cc', strokeColor: '#d79b00'
  }));

  cells.push(createUmlClass({
    id: 'int_CouponUsageHistory',
    name: 'CouponUsageHistory',
    stereotype: 'Audit Entity',
    attributes: [
      '- couponId: string',
      '- orderId: string',
      '- invoiceId: string',
      '- usedAt: Date',
      '- discountAmount: number'
    ],
    methods: [
      '+ getSummary(): string'
    ],
    x: 1220, y: 460, width: 250, height: 150,
    fillColor: '#e1d5e7', strokeColor: '#9673a6'
  }));

  // Promotion Service
  cells.push(createUmlClass({
    id: 'int_PromotionService',
    name: 'PromotionService',
    stereotype: 'Application Service',
    attributes: [
      '- promotionRepository: IPromotionRepository',
      '- couponRepository: IDiscountCouponRepository'
    ],
    methods: [
      '+ getActivePromotions(date: Date): Promise&lt;List&lt;PromotionCampaign&gt;&gt;',
      '+ validateAndApplyCoupon(code: string, subtotal: number): Promise&lt;CouponResult&gt;',
      '+ evaluateOrderPromotions(order: Order): Promise&lt;EvaluationResult&gt;'
    ],
    x: 910, y: 730, width: 350, height: 180,
    fillColor: '#d0e0e3', strokeColor: '#76a5af'
  }));

  // Cross-module and internal connectors
  cells.push(createConnector({ id: 'rel_int_order_items', source: 'int_Order', target: 'int_OrderItem', label: '1   contains   1..*', type: 'composition' }));
  cells.push(createConnector({ id: 'rel_int_item_book', source: 'int_OrderItem', target: 'int_Book', label: '*   refers to   1', type: 'association' }));
  cells.push(createConnector({ id: 'rel_int_order_invoice', source: 'int_Order', target: 'int_Invoice', label: '1   generates   1', type: 'association' }));

  // Cross module links!
  cells.push(createConnector({ id: 'rel_cross_order_promo', source: 'int_Order', target: 'int_PromotionCampaign', label: '*   evaluates   0..*', type: 'association', styleExtra: 'strokeColor=#2e7d32;strokeWidth=1.8;' }));
  cells.push(createConnector({ id: 'rel_cross_order_coupon', source: 'int_Order', target: 'int_DiscountCoupon', label: '*   applies   0..1', type: 'association', styleExtra: 'strokeColor=#ef6c00;strokeWidth=1.8;' }));
  cells.push(createConnector({ id: 'rel_cross_service_service', source: 'int_OrderService', target: 'int_PromotionService', label: 'calls for discounts', type: 'dependency', styleExtra: 'strokeColor=#0277bd;strokeWidth=2;' }));
  cells.push(createConnector({ id: 'rel_cross_coupon_history', source: 'int_DiscountCoupon', target: 'int_CouponUsageHistory', label: '1   tracks   0..*', type: 'composition' }));
  cells.push(createConnector({ id: 'rel_cross_invoice_history', source: 'int_Invoice', target: 'int_CouponUsageHistory', label: '1   recorded in   0..1', type: 'association' }));

  cells.push(createConnector({ id: 'rel_int_ordersvc_order', source: 'int_OrderService', target: 'int_Order', label: 'manages', type: 'dependency' }));
  cells.push(createConnector({ id: 'rel_int_promosvc_promo', source: 'int_PromotionService', target: 'int_PromotionCampaign', label: 'manages', type: 'dependency' }));

  const xml = `<mxGraphModel adaptiveColors="auto">\n  <root>\n    <mxCell id="0"/>\n    <mxCell id="1" parent="0"/>\n${cells.join('\n')}\n  </root>\n</mxGraphModel>`;
  return xml;
}

// -------------------------------------------------------------------------------------------------
// Main Runner
// -------------------------------------------------------------------------------------------------
const outputDir = path.resolve('docs/diagrams/Class diagram');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const salesXml = generateSalesDiagram();
const salesPath = path.join(outputDir, 'class-diagram-quan-ly-ban-hang.drawio');
fs.writeFileSync(salesPath, salesXml, 'utf8');
const salesUrl = encodeDrawioUrl(salesXml);

const promoXml = generatePromotionDiagram();
const promoPath = path.join(outputDir, 'class-diagram-quan-ly-khuyen-mai.drawio');
fs.writeFileSync(promoPath, promoXml, 'utf8');
const promoUrl = encodeDrawioUrl(promoXml);

const integratedXml = generateIntegratedDiagram();
const integratedPath = path.join(outputDir, 'class-diagram-tong-hop-ban-hang-va-khuyen-mai.drawio');
fs.writeFileSync(integratedPath, integratedXml, 'utf8');
const integratedUrl = encodeDrawioUrl(integratedXml);

console.log('--- GENERATION COMPLETE ---');
console.log('1. Sales Management Diagram:');
console.log('   File:', salesPath);
console.log('   URL:', salesUrl);
console.log('\n2. Promotion Management Diagram:');
console.log('   File:', promoPath);
console.log('   URL:', promoUrl);
console.log('\n3. Integrated Diagram:');
console.log('   File:', integratedPath);
console.log('   URL:', integratedUrl);
