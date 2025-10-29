import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpBase } from '../../../services/httpbase.service';
import { UserDepartments } from '../../../config/constants';
import {
  BudgetTransfer,
  BudgetTransferView,
  BudgetTransferHistory,
  BudgetBalance,
  CreateBudgetTransferRequest,
  BudgetTransferValidation,
  BudgetTransferFilterCriteria,
  BudgetTransferSummary,
  BudgetTransactionType,
  TransactionTypeOption
} from './budget-transfer.interface';
import { BudgetHeadView, BudgetPermissions } from '../budget-management/budget-management.interface';

@Injectable({
  providedIn: 'root',
})
export class BudgetTransferService {
  constructor(private httpBase: HttpBase) {}

  /**
   * Get available budget heads for transfer
   * Equivalent to VB6 RefreshList functionality
   */
  getAvailableBudgets(): Observable<BudgetHeadView[]> {
    return new Observable((observer) => {
      const flds = 'BudgetID, BudgetName, Percentage, Balance, StatusID';
      const filter = 'StatusID = 1'; // Only active budgets

      this.httpBase
        .getData('qryBudgets', {
          filter: filter,
          flds: flds,
          orderby: 'BudgetName ASC',
        })
        .then((budgets: any) => {
          const budgetsArray = Array.isArray(budgets)
            ? budgets
            : budgets ? [budgets] : [];

          console.log('Available budgets for transfer:', budgetsArray);
          observer.next(budgetsArray);
          observer.complete();
        })
        .catch((error) => {
          console.error('getAvailableBudgets failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Get budget balance by ID
   * Equivalent to VB6 CheckAvaiableBudget function
   */
  getBudgetBalance(budgetId: number): Observable<BudgetBalance> {
    return new Observable((observer) => {
      if (!budgetId || budgetId <= 0) {
        observer.error(new Error('Invalid budget ID'));
        return;
      }

      // Get budget details with calculated balance
      const query = `
        SELECT 
          b.BudgetID,
          b.BudgetName,
          b.Percentage as AllocatedAmount,
          ISNULL(SUM(CASE WHEN dc.AmountPaid > 0 THEN dc.AmountPaid ELSE 0 END), 0) as SpentAmount,
          ISNULL(SUM(CASE WHEN dc.AmountRecieved > 0 THEN dc.AmountRecieved ELSE 0 END), 0) as TransferredIn,
          ISNULL(SUM(CASE WHEN dc.AmountPaid > 0 THEN dc.AmountPaid ELSE 0 END), 0) as TransferredOut,
          (b.Percentage - ISNULL(SUM(CASE WHEN dc.AmountPaid > 0 THEN dc.AmountPaid ELSE 0 END), 0) + 
           ISNULL(SUM(CASE WHEN dc.AmountRecieved > 0 THEN dc.AmountRecieved ELSE 0 END), 0)) as CurrentBalance,
          (b.Percentage - ISNULL(SUM(CASE WHEN dc.AmountPaid > 0 THEN dc.AmountPaid ELSE 0 END), 0) + 
           ISNULL(SUM(CASE WHEN dc.AmountRecieved > 0 THEN dc.AmountRecieved ELSE 0 END), 0)) as AvailableBalance
        FROM BudgetHeads b
        LEFT JOIN DailyCash dc ON b.BudgetID = dc.CustomerID
        WHERE b.BudgetID = ${budgetId}
        GROUP BY b.BudgetID, b.BudgetName, b.Percentage
      `;

      this.httpBase
        .getData('budget-balance', { query })
        .then((balance: any) => {
          if (balance) {
            observer.next(balance);
            observer.complete();
          } else {
            observer.error(new Error('Budget balance not found'));
          }
        })
        .catch((error) => {
          console.error('getBudgetBalance failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Validate budget transfer
   * Equivalent to VB6 validation logic in btnOK_Click
   */
  validateTransfer(
    fromBudgetId: number,
    toBudgetId: number,
    amount: number,
    transactionType: BudgetTransactionType
  ): Observable<BudgetTransferValidation> {
    return new Observable((observer) => {
      const errors: string[] = [];
      const warnings: string[] = [];

      // Basic validation
      if (!fromBudgetId || fromBudgetId <= 0) {
        errors.push('Please select a valid "From" budget');
      }

      if (!toBudgetId || toBudgetId <= 0) {
        errors.push('Please select a valid "To" budget');
      }

      if (fromBudgetId === toBudgetId) {
        errors.push('Cannot transfer to the same budget head');
      }

      if (!amount || amount <= 0) {
        errors.push('Transfer amount must be greater than zero');
      }

      if (!transactionType) {
        errors.push('Please select a transaction type');
      }

      if (errors.length > 0) {
        observer.next({
          isValid: false,
          errors: errors,
          warnings: warnings,
          fromBudgetAvailable: 0,
          toBudgetCurrent: 0
        });
        observer.complete();
        return;
      }

      // Check available budget in source
      this.getBudgetBalance(fromBudgetId).subscribe({
        next: (fromBalance) => {
          this.getBudgetBalance(toBudgetId).subscribe({
            next: (toBalance) => {
              if (fromBalance.AvailableBalance < amount) {
                errors.push(`Insufficient budget available. Available: ${fromBalance.AvailableBalance}, Required: ${amount}`);
              }

              if (fromBalance.AvailableBalance > 0 && fromBalance.AvailableBalance < amount * 0.1) {
                warnings.push('This transfer will use most of the available budget');
              }

              const validation: BudgetTransferValidation = {
                isValid: errors.length === 0,
                errors: errors,
                warnings: warnings,
                fromBudgetAvailable: fromBalance.AvailableBalance,
                toBudgetCurrent: toBalance.CurrentBalance
              };

              observer.next(validation);
              observer.complete();
            },
            error: (error) => {
              errors.push('Failed to validate destination budget');
              observer.next({
                isValid: false,
                errors: errors,
                warnings: warnings,
                fromBudgetAvailable: 0,
                toBudgetCurrent: 0
              });
              observer.complete();
            }
          });
        },
        error: (error) => {
          errors.push('Failed to validate source budget');
          observer.next({
            isValid: false,
            errors: errors,
            warnings: warnings,
            fromBudgetAvailable: 0,
            toBudgetCurrent: 0
          });
          observer.complete();
        }
      });
    });
  }

  /**
   * Execute budget transfer
   * Equivalent to VB6 AddToBudget calls in btnOK_Click
   */
  executeBudgetTransfer(request: CreateBudgetTransferRequest): Observable<BudgetTransfer> {
    return new Observable((observer) => {
      // First validate the transfer
      this.validateTransfer(
        request.FromBudgetID,
        request.ToBudgetID,
        request.Amount,
        request.TransactionType
      ).subscribe({
        next: (validation) => {
          if (!validation.isValid) {
            observer.error(new Error(validation.errors.join(', ')));
            return;
          }

          // Create the transfer records in DailyCash table
          const transferDate = new Date();
          
          // Debit entry (subtract from source budget)
          const debitEntry = {
            CustomerID: request.FromBudgetID,
            Date: request.Date,
            Description: request.Description,
            AmountPaid: request.Amount,
            AmountRecieved: 0,
            Balance: validation.fromBudgetAvailable - request.Amount,
            AcctTypeID: request.TransactionType,
            CreatedDate: transferDate,
            CreatedBy: request.CreatedBy
          };

          // Credit entry (add to destination budget)
          const creditEntry = {
            CustomerID: request.ToBudgetID,
            Date: request.Date,
            Description: request.Description,
            AmountPaid: 0,
            AmountRecieved: request.Amount,
            Balance: validation.toBudgetCurrent + request.Amount,
            AcctTypeID: request.TransactionType,
            CreatedDate: transferDate,
            CreatedBy: request.CreatedBy
          };

          // Execute both transactions
          Promise.all([
            this.httpBase.postData('DailyCash', debitEntry),
            this.httpBase.postData('DailyCash', creditEntry)
          ])
            .then(([debitResult, creditResult]) => {
              // Return the completed transfer
              const completedTransfer: BudgetTransfer = {
                TransferID: (debitResult as any)?.DetailID || Date.now(),
                Date: request.Date,
                FromBudgetID: request.FromBudgetID,
                ToBudgetID: request.ToBudgetID,
                Amount: request.Amount,
                Description: request.Description,
                TransactionType: request.TransactionType,
                CreatedDate: transferDate,
                CreatedBy: request.CreatedBy
              };

              observer.next(completedTransfer);
              observer.complete();
            })
            .catch((error) => {
              console.error('executeBudgetTransfer failed:', error);
              observer.error(error);
            });
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * Get budget transfer history
   */
  getBudgetTransferHistory(criteria: BudgetTransferFilterCriteria): Observable<BudgetTransferHistory[]> {
    return new Observable((observer) => {
      let filter = this.buildTransferHistoryFilter(criteria);
      
      const query = `
        SELECT 
          dc.DetailID as HistoryID,
          dc.Date,
          dc.CustomerID as BudgetID,
          b.BudgetName,
          CASE 
            WHEN dc.AmountPaid > 0 THEN dc.AmountPaid * -1 
            ELSE dc.AmountRecieved 
          END as Amount,
          CASE 
            WHEN dc.AmountPaid > 0 THEN 'Debit' 
            ELSE 'Credit' 
          END as TransferType,
          dc.Description,
          dc.DetailID as ReferenceID,
          dc.CreatedBy,
          dc.CreatedDate
        FROM DailyCash dc
        INNER JOIN BudgetHeads b ON dc.CustomerID = b.BudgetID
        WHERE ${filter}
        ORDER BY dc.Date DESC, dc.CreatedDate DESC
      `;

      this.httpBase
        .getData('budget-transfer-history', { query })
        .then((history: any) => {
          const historyArray = Array.isArray(history)
            ? history
            : history ? [history] : [];

          observer.next(historyArray);
          observer.complete();
        })
        .catch((error) => {
          console.error('getBudgetTransferHistory failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Get transaction type options
   */
  getTransactionTypes(): TransactionTypeOption[] {
    return [
      {
        value: BudgetTransactionType.Transfer,
        label: 'Transfer',
        description: 'Transfer budget between heads'
      },
      {
        value: BudgetTransactionType.Adjustment,
        label: 'Adjustment',
        description: 'Budget adjustment entry'
      },
      {
        value: BudgetTransactionType.Allocation,
        label: 'Allocation',
        description: 'Initial budget allocation'
      },
      {
        value: BudgetTransactionType.Reallocation,
        label: 'Reallocation',
        description: 'Budget reallocation'
      }
    ];
  }

  /**
   * Get user permissions for budget transfers
   */
  getUserPermissions(): BudgetPermissions {
    const userDepartment = this.httpBase.getUserDept();
    const hasTransferPermission = (
      userDepartment === UserDepartments.grpCEO ||
      userDepartment === UserDepartments.grpOperations ||
      userDepartment === UserDepartments.grpGM
    );

    return {
      canAdd: hasTransferPermission,
      canEdit: hasTransferPermission,
      canView: true,
      canDelete: false, // Transfers typically cannot be deleted, only reversed
      canManageExpenseHeads: hasTransferPermission,
      canViewReports: true
    };
  }

  /**
   * Get budget transfer summary statistics
   */
  getBudgetTransferSummary(criteria: BudgetTransferFilterCriteria): Observable<BudgetTransferSummary> {
    return new Observable((observer) => {
      const filter = this.buildTransferHistoryFilter(criteria);
      
      const query = `
        SELECT 
          COUNT(*) as TotalTransfers,
          SUM(ABS(CASE WHEN AmountPaid > 0 THEN AmountPaid ELSE AmountRecieved END)) as TotalAmountTransferred,
          AVG(ABS(CASE WHEN AmountPaid > 0 THEN AmountPaid ELSE AmountRecieved END)) as AverageTransferAmount,
          MIN(Date) as FromDate,
          MAX(Date) as ToDate
        FROM DailyCash
        WHERE ${filter}
      `;

      this.httpBase
        .getData('budget-transfer-summary', { query })
        .then((summary: any) => {
          const result: BudgetTransferSummary = {
            totalTransfers: summary?.TotalTransfers || 0,
            totalAmountTransferred: summary?.TotalAmountTransferred || 0,
            averageTransferAmount: summary?.AverageTransferAmount || 0,
            mostActiveFromBudget: 'N/A', // Could be calculated with additional query
            mostActiveToBudget: 'N/A',   // Could be calculated with additional query
            dateRange: {
              from: summary?.FromDate || criteria.fromDate,
              to: summary?.ToDate || criteria.toDate
            }
          };

          observer.next(result);
          observer.complete();
        })
        .catch((error) => {
          console.error('getBudgetTransferSummary failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Build filter string for transfer history queries
   */
  private buildTransferHistoryFilter(criteria: BudgetTransferFilterCriteria): string {
    let filter = '1=1';

    // Date range filter
    if (criteria.fromDate) {
      filter += ` AND Date >= '${this.formatDateForSQL(criteria.fromDate)}'`;
    }
    if (criteria.toDate) {
      filter += ` AND Date <= '${this.formatDateForSQL(criteria.toDate)}'`;
    }

    // Budget filters
    if (criteria.fromBudgetId) {
      filter += ` AND CustomerID = ${criteria.fromBudgetId} AND AmountPaid > 0`;
    }
    if (criteria.toBudgetId) {
      filter += ` AND CustomerID = ${criteria.toBudgetId} AND AmountRecieved > 0`;
    }

    // Transaction type filter
    if (criteria.transactionType) {
      filter += ` AND AcctTypeID = ${criteria.transactionType}`;
    }

    // Amount range filters
    if (criteria.minAmount !== undefined && criteria.minAmount > 0) {
      filter += ` AND (AmountPaid >= ${criteria.minAmount} OR AmountRecieved >= ${criteria.minAmount})`;
    }
    if (criteria.maxAmount !== undefined && criteria.maxAmount > 0) {
      filter += ` AND (AmountPaid <= ${criteria.maxAmount} OR AmountRecieved <= ${criteria.maxAmount})`;
    }

    // Created by filter
    if (criteria.createdBy) {
      filter += ` AND CreatedBy = ${criteria.createdBy}`;
    }

    return filter;
  }

  /**
   * Format date for SQL query
   */
  private formatDateForSQL(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Calculate balance after transfer (preview calculation)
   */
  calculateBalanceAfterTransfer(
    currentBalance: number,
    transferAmount: number,
    isSource: boolean
  ): number {
    return isSource 
      ? currentBalance - transferAmount
      : currentBalance + transferAmount;
  }

  /**
   * Get budget head by ID with current balance
   */
  getBudgetHeadWithBalance(budgetId: number): Observable<BudgetHeadView> {
    return new Observable((observer) => {
      this.getBudgetBalance(budgetId).subscribe({
        next: (balance) => {
          const budgetHead: BudgetHeadView = {
            BudgetID: balance.BudgetID,
            BudgetName: balance.BudgetName,
            Percentage: balance.AllocatedAmount,
            Balance: balance.CurrentBalance,
            StatusID: 1, // Assume active
            CreatedDate: new Date(),
            CreatedBy: 1,
            ExpenseHeadCount: 0,
            TotalAllocated: balance.AllocatedAmount,
            IsEditable: true
          };

          observer.next(budgetHead);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
}