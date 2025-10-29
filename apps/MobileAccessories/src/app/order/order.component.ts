import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UPLOADS_URL } from '../../../../config/constants';
import {
  getCurDate,
  GetDateJSON,
  JSON2Date,
  RoundTo2,
} from '../../../../factories/utilities';
import { HttpBase } from '../../../../services/httpbase.service';
import { MyToastService } from '../../../../services/toaster.server';

class OrderModel {
  OrderID?: number;
  CustomerID: number;
  Date: any = GetDateJSON();
  Amount: number;
  IsPosted: number;
  Notes: string;
  details: any;
}

class OrderDetailModel {
  OrderID: number;
  ProductName: string;
  ProductID: number | null;
  Qty: number;
  SPrice: number;
  Color?: string;
  Size?: string;
  Notes?: string;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit, OnDestroy {
  @ViewChild('cmbProduct') cmbProduct;
  public EditID: number = 0;
  public order: OrderModel = new OrderModel();
  public orderdetail: OrderDetailModel = new OrderDetailModel();
  public Accounts: any = [];
  public Products: any = [];
  public FilteredProducts: any = [];
  public Filter: any = {};
  public Categories: any = [];
  public UploadFolder = UPLOADS_URL;
  public selectedProduct: any = {};
  public selectedCategory: any = {};
  public quickAddMode: boolean = false;
  public bulkAddMode: boolean = false;
  public bulkSelectedProducts: any[] = [];
  public searchTerm: string = '';
  public viewMode: string = 'grid'; // 'grid', 'list', 'card'
  public sortBy: string = 'name';
  public showProductModal: boolean = false;
  public modalProduct: any = {};
  public availableColors: string[] = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Gray', 'Navy'];
  public availableSizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42', 'One Size'];
  public modalOrderDetail: OrderDetailModel = new OrderDetailModel();

  // Pagination properties
  public currentPage: number = 1;
  public pageSize: number = 20;
  public totalProducts: number = 0;
  public totalPages: number = 1;
  public isLoading: boolean = false;
  public loadingMore: boolean = false;

  // Order items tracking
  public orderItems: any[] = [];
  public orderItemsCount: number = 0;
  public showOrderDetailsModal: boolean = false;

  // Image handling properties
  private imageCache = new Map<string, string>();
  private failedImages = new Set<string>();
  private defaultImageUrl = UPLOADS_URL + '/products/dummy.jpg';
  private searchTimeout: any;

  constructor(
    private http: HttpBase,
    private toast: MyToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private bsModel: BsModalRef
  ) {}

  ngOnInit() {
    this.http.getData('customers').then((d: any) => {
      this.Accounts = [...d];
    });
    this.http.getData('qrycategories').then((d: any) => {
      this.Categories = [...d];
    });

    this.LoadProducts();
    if (this.EditID != 0) {
      console.log('EditID:', this.EditID);
      this.LoadInvoice();
    }

    // Set default quantity to 1
    this.orderdetail.Qty = 1;
  }

  LoadProducts(CategoryID = '', resetPage = true) {
    if (resetPage) {
      this.currentPage = 1;
      this.Products = [];
      this.FilteredProducts = [];
    }

    this.isLoading = true;

    // Build filter
    let filter = '1=1';
    if (CategoryID !== '') {
      filter = `CategoryID=${CategoryID}`;
    }

    // Add search filter if exists
    if (this.searchTerm) {
      const searchFilter = `(ProductName LIKE '%${this.searchTerm}%' OR Description LIKE '%${this.searchTerm}%')`;
      filter = CategoryID !== '' ? `${filter} AND ${searchFilter}` : searchFilter;
    }

    // Build DataTables request
    const dtRequest = {
      draw: this.currentPage,
      start: (this.currentPage - 1) * this.pageSize,
      length: this.pageSize,
      search: {
        value: '',
        regex: false
      },
      order: [{
        column: 0,
        dir: this.getSortDirection()
      }],
      columns: [
        { data: 'ProductID', searchable: false, orderable: true },
        { data: 'ProductName', searchable: true, orderable: true },
        { data: 'Description', searchable: true, orderable: false },
        { data: 'SPrice', searchable: false, orderable: true },
        { data: 'CategoryID', searchable: false, orderable: true },
        { data: 'StockQty', searchable: false, orderable: true },
        { data: 'Image', searchable: false, orderable: false }
      ],
      filter: filter
    };

    this.http.DataTable('products', dtRequest).then((response: any) => {
      this.isLoading = false;
      this.loadingMore = false;

      if (response && response.data) {
        const newProducts = response.data.map((p: any) => {
          return {
            Image: this.getOptimizedImageUrl(p.Image),
            OriginalImage: p.Image, // Keep original for retry purposes
            ProductName: p.ProductName,
            ProductID: p.ProductID,
            SPrice: p.SPrice,
            CategoryID: p.CategoryID,
            StockQty: p.StockQty || 0,
            Description: p.Description || ''
          };
        });

        if (resetPage) {
          this.Products = newProducts;
        } else {
          this.Products = [...this.Products, ...newProducts];
        }

        this.FilteredProducts = [...this.Products];
        this.totalProducts = response.recordsFiltered || response.recordsTotal || 0;
        this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
      }
    }).catch((error) => {
      this.isLoading = false;
      this.loadingMore = false;
      console.error('Error loading products:', error);

      // Fallback to original API if DataTables fails
      this.loadProductsFallback(CategoryID);
    });
  }

  // Fallback method using original API
  private loadProductsFallback(CategoryID = '') {
    const filter = CategoryID !== '' ? 'CategoryID=' + CategoryID : '1=1';
    this.http.getData('products', { filter }).then((d: any) => {
      this.Products = d.map((p) => {
        return {
          Image: this.getOptimizedImageUrl(p.Image),
          OriginalImage: p.Image, // Keep original for retry purposes
          ProductName: p.ProductName,
          ProductID: p.ProductID,
          SPrice: p.SPrice,
          CategoryID: p.CategoryID,
          StockQty: p.StockQty || 0,
          Description: p.Description || ''
        };
      });
      this.FilteredProducts = [...this.Products];
      this.totalProducts = this.Products.length;
      this.totalPages = 1;
    });
  }

  // Get sort direction based on sortBy property
  private getSortDirection(): string {
    switch (this.sortBy) {
      case 'price-desc':
        return 'desc';
      default:
        return 'asc';
    }
  }

  // Load more products (for infinite scroll)
  loadMoreProducts() {
    if (this.loadingMore || this.isLoading || this.currentPage >= this.totalPages) {
      return;
    }

    this.currentPage++;
    this.loadingMore = true;
    this.LoadProducts(this.selectedCategory?.CategoryID || '', false);
  }

  // Check if there are more products to load
  hasMoreProducts(): boolean {
    return this.currentPage < this.totalPages && !this.isLoading;
  }

  categorySelected(event) {
    this.selectedCategory = event;
    this.searchTerm = ''; // Clear search when changing category

    if (event) {
      this.LoadProducts(event.CategoryID, true);
    } else {
      this.LoadProducts('', true);
    }

    // Auto-switch to visual mode when category is selected
    if (this.viewMode === 'list') {
      this.viewMode = 'grid';
    }
  }

  // Set view mode
  setViewMode(mode: string) {
    this.viewMode = mode;
    this.bulkAddMode = false;
    this.clearBulkSelection();
  }

  // Enable bulk selection mode
  enableBulkMode() {
    this.bulkAddMode = !this.bulkAddMode;
    if (!this.bulkAddMode) {
      this.clearBulkSelection();
    }
  }

  // Clear all selections
  clearAllSelections() {
    this.selectedProduct = {};
    this.orderdetail = new OrderDetailModel();
    this.orderdetail.Qty = 1;
    this.quickAddMode = false;
    this.clearBulkSelection();
  }

  // Clear search
  clearSearch() {
    this.searchTerm = '';
    this.LoadProducts(this.selectedCategory?.CategoryID || '', true);
  }

  // Filter products based on search term (now uses server-side search)
  filterProducts() {
    // Debounce search to avoid too many API calls
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.LoadProducts(this.selectedCategory?.CategoryID || '', true);
    }, 500);
  }

  // Search products (triggers server-side search)
  onSearchProducts() {
    this.filterProducts();
  }

  // Change sorting
  changeSorting(sortBy: string) {
    this.sortBy = sortBy;
    this.LoadProducts(this.selectedCategory?.CategoryID || '', true);
  }

  // Image handling methods
  getOptimizedImageUrl(originalUrl: string): string {
    if (!originalUrl || originalUrl.trim() === '') {
      return this.defaultImageUrl;
    }

    // Check if image has failed before
    if (this.failedImages.has(originalUrl)) {
      return this.defaultImageUrl;
    }

    // Check cache first
    if (this.imageCache.has(originalUrl)) {
      return this.imageCache.get(originalUrl)!;
    }

    let optimizedUrl = originalUrl;

    // Handle external URLs with SSL issues
    if (originalUrl.startsWith('https://')) {
      // For problematic domains, try to use a proxy or convert to HTTP
      if (originalUrl.includes('akmobilestore.com') ||
          originalUrl.includes('ssl-cert-error') ||
          originalUrl.includes('certificate')) {
        optimizedUrl = originalUrl.replace('https://', 'http://');
      }
    }
    // Handle relative URLs
    else if (!originalUrl.startsWith('http')) {
      optimizedUrl = this.UploadFolder + originalUrl;
    }

    this.imageCache.set(originalUrl, optimizedUrl);
    return optimizedUrl;
  }

  onImageError(event: any, originalUrl: string): void {
    const imgElement = event.target as HTMLImageElement;

    // Mark this image as failed
    this.failedImages.add(originalUrl);

    // Try fallback strategies
    if (originalUrl.startsWith('https://')) {
      // Try HTTP version
      const httpUrl = originalUrl.replace('https://', 'http://');
      if (!this.failedImages.has(httpUrl)) {
        imgElement.src = httpUrl;
        return;
      }
    }

    // Use default image as final fallback
    imgElement.src = this.defaultImageUrl;
    imgElement.alt = 'Image not available';
  }

  onImageLoad(originalUrl: string): void {
    // Image loaded successfully, no action needed
    // Could be used for analytics or preloading related images
  }

  // Retry loading a failed image
  retryImage(originalUrl: string): void {
    this.failedImages.delete(originalUrl);
    this.imageCache.delete(originalUrl);
    // The next call to getOptimizedImageUrl will try again
  }

  // Clean up image cache when component is destroyed
  ngOnDestroy(): void {
    this.imageCache.clear();
    this.failedImages.clear();
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  // Focus first product in current view
  focusFirstProduct() {
    if (this.FilteredProducts.length > 0) {
      setTimeout(() => {
        const firstElement = document.querySelector(`#product-0, #product-card-0, #product-row-0`) as HTMLElement;
        if (firstElement) {
          firstElement.focus();
        }
      }, 100);
    }
  }

  // Bulk selection methods
  toggleBulkSelection(product: any) {
    const index = this.bulkSelectedProducts.findIndex(p => p.ProductID === product.ProductID);
    if (index > -1) {
      this.bulkSelectedProducts.splice(index, 1);
    } else {
      this.bulkSelectedProducts.push(product);
    }
  }

  removeFromBulkSelection(product: any) {
    const index = this.bulkSelectedProducts.findIndex(p => p.ProductID === product.ProductID);
    if (index > -1) {
      this.bulkSelectedProducts.splice(index, 1);
    }
  }

  clearBulkSelection() {
    this.bulkSelectedProducts = [];
  }

  isBulkSelected(product: any): boolean {
    return this.bulkSelectedProducts.some(p => p.ProductID === product.ProductID);
  }

  isAllSelected(): boolean {
    return this.FilteredProducts.length > 0 && this.FilteredProducts.every(p => this.isBulkSelected(p));
  }

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.FilteredProducts.forEach(product => {
        if (!this.isBulkSelected(product)) {
          this.bulkSelectedProducts.push(product);
        }
      });
    } else {
      this.FilteredProducts.forEach(product => {
        this.removeFromBulkSelection(product);
      });
    }
  }

  processBulkAdd() {
    if (this.bulkSelectedProducts.length === 0) {
      this.toast.Warning('No products selected for bulk add!', 'Bulk Add');
      return;
    }

    let addedCount = 0;
    this.bulkSelectedProducts.forEach(product => {
      const orderDetail = new OrderDetailModel();
      orderDetail.ProductID = product.ProductID;
      orderDetail.ProductName = product.ProductName;
      orderDetail.SPrice = product.SPrice;
      orderDetail.Qty = 1; // Default quantity
      orderDetail.Color = 'N/A'; // Default color
      orderDetail.Size = 'N/A'; // Default size
      orderDetail.Notes = ''; // Default notes

      this.AddToDetails(orderDetail);
      addedCount++;
    });

    this.calculation();
    this.clearBulkSelection();
    this.bulkAddMode = false;

    this.toast.Sucess(`${addedCount} products added to order with default settings!`, 'Bulk Add');
  }

  // Enhanced product selection
  handleProductGridClick(product: any) {
    if (this.bulkAddMode) {
      this.toggleBulkSelection(product);
    } else {
      this.openProductModal(product);
    }
  }

  // Open product selection modal
  openProductModal(product: any) {
    this.modalProduct = { ...product };
    this.modalOrderDetail = new OrderDetailModel();
    this.modalOrderDetail.ProductID = product.ProductID;
    this.modalOrderDetail.ProductName = product.ProductName;
    this.modalOrderDetail.SPrice = product.SPrice;
    this.modalOrderDetail.Qty = 1;
    this.modalOrderDetail.Color = '';
    this.modalOrderDetail.Size = '';
    this.modalOrderDetail.Notes = '';
    this.showProductModal = true;

    // Focus on quantity input after modal opens
    setTimeout(() => {
      const qtyInput = document.getElementById('modalQty') as HTMLInputElement;
      if (qtyInput) {
        qtyInput.focus();
        qtyInput.select();
      }
    }, 300);
  }

  // Close product modal
  closeProductModal() {
    this.showProductModal = false;
    this.modalProduct = {};
    this.modalOrderDetail = new OrderDetailModel();
  }

  // Add product from modal
  addProductFromModal() {
    if (!this.modalOrderDetail.ProductID) {
      this.toast.Error('Invalid product selection!', 'Error');
      return;
    }

    if (!this.modalOrderDetail.Qty || this.modalOrderDetail.Qty <= 0) {
      this.toast.Error('Quantity must be greater than 0!', 'Error');
      return;
    }

    if (!this.modalOrderDetail.SPrice || this.modalOrderDetail.SPrice <= 0) {
      this.toast.Error('Price must be greater than 0!', 'Error');
      return;
    }

    // Create the order detail with all information
    const orderDetail = {
      ProductID: this.modalOrderDetail.ProductID,
      ProductName: this.modalOrderDetail.ProductName,
      Qty: this.modalOrderDetail.Qty,
      SPrice: this.modalOrderDetail.SPrice,
      Color: this.modalOrderDetail.Color || 'N/A',
      Size: this.modalOrderDetail.Size || 'N/A',
      Notes: this.modalOrderDetail.Notes || ''
    };

    this.AddToDetails(orderDetail);
    this.calculation();
    this.closeProductModal();

    this.toast.Sucess('Product added to order successfully!', 'Success');
  }

  // Helper method for keyboard navigation in modal
  focusNextInput(nextInputId: string) {
    setTimeout(() => {
      const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
        if (nextInput.type === 'number') {
          nextInput.select();
        }
      }
    }, 100);
  }

  isProductSelected(product: any): boolean {
    return this.selectedProduct?.ProductID === product.ProductID;
  }

  // Quick add product from grid
  quickAddProduct(product: any) {
    this.orderdetail.ProductID = product.ProductID;
    this.orderdetail.ProductName = product.ProductName;
    this.orderdetail.SPrice = product.SPrice;
    this.selectedProduct = product;

    // If quantity is not set, default to 1
    if (!this.orderdetail.Qty || this.orderdetail.Qty <= 0) {
      this.orderdetail.Qty = 1;
    }

    this.quickAddMode = true;

    // Auto-focus on quantity input
    setTimeout(() => {
      const qtyInput = document.getElementById('qty') as HTMLInputElement;
      if (qtyInput) {
        qtyInput.focus();
        qtyInput.select();
      }
    }, 100);
  }

  // Cancel quick add mode
  cancelQuickAdd() {
    this.quickAddMode = false;
    this.selectedProduct = {};
    this.orderdetail = new OrderDetailModel();
    this.orderdetail.Qty = 1;
  }

  // Enhanced add order with better UX
  public AddOrder() {
    if (!this.orderdetail.ProductID) {
      this.toast.Error('Please select a product!', 'error');
      return;
    }

    if (!this.orderdetail.Qty || this.orderdetail.Qty <= 0) {
      this.toast.Error('Quantity must be greater than 0!', 'error');
      return;
    }

    if (!this.orderdetail.SPrice || this.orderdetail.SPrice <= 0) {
      this.toast.Error('Price must be greater than 0!', 'error');
      return;
    }

    this.AddToDetails(this.orderdetail);
    this.calculation();

    // Reset form and focus back to product selection
    this.orderdetail = new OrderDetailModel();
    this.orderdetail.Qty = 1;
    this.selectedProduct = {};
    this.quickAddMode = false;

    // Focus back to product search or category
    setTimeout(() => {
      const productSelect = document.getElementById('cmbProduct');
      if (productSelect) {
        productSelect.focus();
      }
    }, 100);

    this.toast.Sucess('Product added to order!', 'Success');
  }

  // Get product by ID (helper method)
  getProductById(productId: number) {
    return this.Products.find(p => p.ProductID === productId);
  }

  LoadInvoice() {
    if (this.EditID && this.EditID > 0) {
      this.http.getData('orders/' + this.EditID).then((r: any) => {
        if (!r) {
          this.toast.Warning('Invalid order No', 'Edit', 1);
          return;
        }

        this.order = r;
        this.order.Date = GetDateJSON(new Date(r.Date));

        this.http
          .getData(
            'qryorderdetails?orderby=DetailID desc&filter=OrderID=' +
              this.EditID
          )
          .then((rdet: any) => {
            this.orderItems = []; // Reset order items

            for (const det of rdet) {
              const { ProductID, ProductName, Qty, SPrice, Color, Size, Notes } = det;
              // Create new object with selected properties
              this.AddToDetails({
                ProductID,
                ProductName,
                Qty,
                SPrice,
                Color: Color || 'N/A',
                Size: Size || 'N/A',
                Notes: Notes || ''
              });
            }
            this.orderItemsCount = this.orderItems.length;
            this.calculation();
          });
      });
    }
  }
  AddToDetails(ord: any) {
    const tQty = parseFloat('0' + ord.Qty);

    const obj = {
      ProductName: ord.ProductName,
      SPrice: parseFloat('0' + ord.SPrice),
      Qty: parseFloat(ord.Qty),
      Amount: RoundTo2(ord.SPrice * tQty),
      ProductID: ord.ProductID,
      Color: ord.Color || 'N/A',
      Size: ord.Size || 'N/A',
      Notes: ord.Notes || ''
    };

    // Add to order items array
    this.orderItems.unshift({...obj});
    this.orderItemsCount = this.orderItems.length;
  }
  public async SaveData() {
    let InvoiceID = '';

    if (this.EditID) {
      InvoiceID = '/' + this.EditID;
    }

    this.order.Date = JSON2Date(this.order.Date);

    this.order.details = this.orderItems;
    this.http.postTask('order' + InvoiceID, this.order).then(
      (r: any) => {
        this.toast.Sucess('Order Saved Successfully', 'Save', 2);

        if (this.EditID > 0) {
          this.LoadInvoice();
        } else {
          this.Cancel(false);
        }
      },
      (err) => {
        this.order.Date = GetDateJSON(new Date(getCurDate()));
        this.toast.Error('Error saving order', 'Error', 2);
        console.log(err);
      }
    );
  }
  ProductSearchFn(term: any, item) {
    if (term) {
      return (
        item.ProductName.toLocaleLowerCase().indexOf(
          term.toLocaleLowerCase()
        ) >= 0
      );
    } else {
      return false;
    }
  }
  public calculation() {
    this.order.Amount = 0;

    for (let i = 0; i < this.orderItems.length; i++) {
      this.order.Amount += this.orderItems[i].Amount * 1;
    }
  }
  Cancel(bclose: boolean = true) {
    this.orderItems = [];
    this.orderItemsCount = 0;
    this.order = new OrderModel();
    this.orderdetail = new OrderDetailModel();
    if (this.bsModel && bclose) {
      this.bsModel.hide();
    }
  }

  productSelected(event) {
    if (event) {
      const product = this.getProductById(event);
      if (product) {
        this.orderdetail.ProductID = product.ProductID;
        this.orderdetail.SPrice = product.SPrice;
        this.orderdetail.ProductName = product.ProductName;
        this.selectedProduct = product;

        // Set default quantity if not set
        if (!this.orderdetail.Qty || this.orderdetail.Qty <= 0) {
          this.orderdetail.Qty = 1;
        }

        // Focus on quantity input
        setTimeout(() => {
          const qtyInput = document.getElementById('qty') as HTMLInputElement;
          if (qtyInput) {
            qtyInput.focus();
            qtyInput.select();
          }
        }, 100);
      }
    } else {
      this.selectedProduct = {};
      this.orderdetail.ProductID = null;
      this.orderdetail.ProductName = '';
      this.orderdetail.SPrice = 0;
    }
  }

  // Show order details modal
  public showOrderDetails() {
    this.showOrderDetailsModal = true;
  }

  // Close order details modal
  public closeOrderDetails() {
    this.showOrderDetailsModal = false;
  }

  // Update quantity in order
  public updateOrderItemQty(item: any, newQty: number) {
    if (newQty <= 0) {
      this.removeOrderItem(item);
      return;
    }

    item.Qty = newQty;
    item.Amount = RoundTo2(item.SPrice * newQty);
    this.calculation();
  }

  // Remove item from order
  public removeOrderItem(item: any) {
    const index = this.orderItems.findIndex(i =>
      i.ProductID === item.ProductID &&
      i.SPrice === item.SPrice &&
      i.Color === item.Color &&
      i.Size === item.Size
    );

    if (index > -1) {
      this.orderItems.splice(index, 1);
      this.orderItemsCount = this.orderItems.length;
      this.calculation();
    }
  }

  // Edit item in order
  public editOrderItem(item: any) {
    this.selectedProduct = this.getProductById(item.ProductID);
    this.orderdetail = {
      ProductID: item.ProductID,
      ProductName: item.ProductName,
      Qty: item.Qty,
      SPrice: item.SPrice,
      Color: item.Color === 'N/A' ? '' : item.Color,
      Size: item.Size === 'N/A' ? '' : item.Size,
      Notes: item.Notes === 'N/A' ? '' : item.Notes,
      OrderID: 0
    };

    // Remove the item and let user re-add with changes
    this.removeOrderItem(item);
    this.closeOrderDetails();
    this.quickAddMode = true;
  }
}

