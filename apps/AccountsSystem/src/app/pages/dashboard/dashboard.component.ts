import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpBase } from '../../services/httpbase.service';
import { DashboardService } from '../../services/dashboard.service';
import { ROUTES } from '../../shared/vertical-menu/vertical-menu-routes.config';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  group_id = '';
  MenuItems: any = [];
  isLoading = false;
  selectedPeriod = 'current';
  lastUpdated: Date = new Date();
  
  // Dashboard data arrays - populated dynamically by DashboardService
  // All arrays start empty and are filled with real accounting data from APIs
  summaryCards: any[] = [];
  recentTransactions: any[] = [];
  monthlyData: any[] = [];
  chartData: any[] = [];
  expenseCategories: any[] = [];
  accountBalances: any[] = [];

  // Chart configuration options
  chartOptions = {
    view: [700, 300],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel: true,
    xAxisLabel: 'Month',
    showYAxisLabel: true,
    yAxisLabel: 'Amount ($)',
    colorScheme: {
      domain: ['#5AA454', '#E44D25', '#7aa3e5']
    }
  };

  pieChartOptions = {
    view: [300, 250],
    gradient: true,
    showLegend: true,
    showLabels: true,
    isDoughnut: false,
    colorScheme: {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#FF8C00', '#8B008B', '#006400']
    }
  };

  // Quick actions configuration
  quickActions = [
    { title: 'Record Receipt', icon: 'ft-credit-card', route: '/tasks/cashreceipt', color: 'success' },
    { title: 'Add Payment', icon: 'ft-minus-circle', route: '/tasks/cashpayment', color: 'warning' },
    { title: 'Create JV', icon: 'ft-file-plus', route: '/tasks/jv', color: 'primary' },
    { title: 'View Reports', icon: 'ft-bar-chart-2', route: '/reports', color: 'info' }
  ];

  constructor(private http: HttpBase, private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.loadDashboardData();
    
    this.MenuItems = this.MenuItems.concat(ROUTES.filter(x => {
      return (x.path.includes('account'))
    }));
    this.MenuItems = this.MenuItems.concat(ROUTES.filter(x => {
      return (x.path.includes('cash'))
    }));
    this.MenuItems = this.MenuItems.concat(ROUTES.filter(x => {
      return (x.path.includes('reports'))
    }));
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardData(this.selectedPeriod).subscribe({
      next: (data) => {
        this.summaryCards = data.summaryCards || [];
        this.recentTransactions = data.recentTransactions || [];
        this.monthlyData = data.monthlyData || [];
        this.accountBalances = data.accountBalances || [];
        this.expenseCategories = data.expenseCategories || [];
        
        // Update chart data with null checks
        this.updateChartData();
        
        this.lastUpdated = new Date(); // Update timestamp when data is loaded
        this.isLoading = false;
        console.log('Dashboard data loaded successfully:', data);
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loadFallbackData(); // Load fallback data on error
        this.isLoading = false;
      }
    });
  }

  /**
   * Update chart data with current monthly data
   */
  private updateChartData(): void {
    if (this.monthlyData && this.monthlyData.length > 0) {
      this.chartData = [
        {
          name: 'Revenue',
          series: this.monthlyData.map(data => ({ 
            name: data.month, 
            value: Math.abs(data.revenue || 0)
          }))
        },
        {
          name: 'Expenses', 
          series: this.monthlyData.map(data => ({ 
            name: data.month, 
            value: Math.abs(data.expenses || 0)
          }))
        },
        {
          name: 'Profit',
          series: this.monthlyData.map(data => ({ 
            name: data.month, 
            value: data.profit || 0
          }))
        }
      ];
    }
  }

  /**
   * Load fallback data in case of API failure
   */
  private loadFallbackData(): void {
    console.warn('Loading fallback dashboard data due to API error');
    
    // Use the existing hardcoded data as fallback
    this.summaryCards = [
      {
        title: 'Total Revenue',
        value: 'N/A',
        change: 'N/A',
        trend: 'up',
        icon: 'ft-trending-up',
        color: 'secondary'
      },
      {
        title: 'Total Expenses',
        value: 'N/A',
        change: 'N/A',
        trend: 'up',
        icon: 'ft-trending-down',
        color: 'secondary'
      },
      {
        title: 'Net Profit',
        value: 'N/A',
        change: 'N/A',
        trend: 'up',
        icon: 'ft-dollar-sign',
        color: 'secondary'
      },
      {
        title: 'Total Assets',
        value: 'N/A',
        change: 'N/A',
        trend: 'up',
        icon: 'ft-briefcase',
        color: 'secondary'
      }
    ];

    this.recentTransactions = [];
    this.accountBalances = [];
    this.expenseCategories = [];
    this.monthlyData = [];
    this.chartData = [];
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getTransactionClass(type: string): string {
    return type === 'credit' ? 'text-success' : 'text-danger';
  }

  getBalanceClass(balance: number): string {
    return balance >= 0 ? 'text-success' : 'text-danger';
  }

  // Chart interaction methods
  onChartSelect(event: any): void {
    console.log('Chart selection:', event);
  }

  onChartActivate(event: any): void {
    console.log('Chart activate:', event);
  }

  onChartDeactivate(event: any): void {
    console.log('Chart deactivate:', event);
  }

  // Method to refresh dashboard data
  refreshDashboard(): void {
    this.loadDashboardData();
  }

  // Method to export dashboard data
  exportData(): void {
    // In a real application, this would export dashboard data
    const data = {
      summaryCards: this.summaryCards,
      transactions: this.recentTransactions,
      monthlyData: this.monthlyData,
      accountBalances: this.accountBalances,
      expenseCategories: this.expenseCategories
    };
    console.log('Exporting dashboard data:', data);
    
    // Simulate file download
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  // Method to change period
  changePeriod(period: string): void {
    this.selectedPeriod = period;
    this.loadDashboardData();
    this.lastUpdated = new Date(); // Update timestamp when data is refreshed
  }

  abs(number: number): number {
    return Math.abs(number);
  }

  /**
   * Get period display text
   */
  getPeriodText(): string {
    switch (this.selectedPeriod) {
      case 'current': return 'Current Month';
      case 'last': return 'Last Month';
      case 'year': return 'Year to Date';
      default: return 'Current Month';
    }
  }

  /**
   * Check if dashboard has any data
   */
  hasAnyData(): boolean {
    return (
      this.summaryCards.length > 0 ||
      this.recentTransactions.length > 0 ||
      this.accountBalances.length > 0 ||
      this.expenseCategories.length > 0
    );
  }

  /**
   * Get dashboard status message
   */
  getDashboardStatus(): string {
    if (this.isLoading) {
      return 'Loading financial data...';
    }
    
    if (!this.hasAnyData()) {
      return 'No financial data available. Please check your accounting system.';
    }

    const period = this.getPeriodText().toLowerCase();
    return `Showing financial overview for ${period}`;
  }

  /**
   * Get current date for display
   */
  getCurrentDate(): Date {
    return new Date();
  }
}
