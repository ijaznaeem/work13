import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpBase } from '../../../services/httpbase.service';
import { UserDepartments } from '../../../config/constants';
import {
  BudgetHead,
  BudgetHeadView,
  ExpenseHead,
  ExpenseHeadView,
  BudgetFilterCriteria,
  BudgetPermissions,
  CreateBudgetHeadRequest,
  UpdateBudgetHeadRequest,
  CreateExpenseHeadRequest,
  UpdateExpenseHeadRequest,
  ApiResponse,
  BudgetValidationResult,
  BudgetStatus
} from './budget-management.interface';

@Injectable({
  providedIn: 'root',
})
export class BudgetManagementService {
  constructor(private httpBase: HttpBase) {}

  /**
   * Get all budget heads with calculated balances
   * Equivalent to VB6 ShowData() function
   */
  getBudgetHeads(criteria?: BudgetFilterCriteria): Observable<BudgetHeadView[]> {
    return new Observable((observer) => {
      let filter = this.buildBudgetFilter(criteria);

      const flds = 'BudgetID, BudgetName, Balance, Percentage ';

      console.log('getBudgetHeads filter:', filter);

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
          
          // Calculate balance and other computed fields
          const budgetsWithBalance = budgetsArray.map((budget) => ({
            ...budget,
            Balance: this.calculateBudgetBalance(budget.Percentage),
            ExpenseHeadCount: 0, // Will be populated separately if needed
            TotalAllocated: 0,   // Will be populated separately if needed
            IsEditable: this.canEditBudget(budget)
          }));
          
          console.log('Processed budget heads:', budgetsWithBalance);
          
          observer.next(budgetsWithBalance);
          observer.complete();
        })
        .catch((error) => {
          console.error('getBudgetHeads failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Get expense heads for a specific budget
   * Equivalent to VB6 grdData_SelectionChange functionality
   */
  getExpenseHeads(budgetId: number): Observable<ExpenseHeadView[]> {
    return new Observable((observer) => {
      if (!budgetId || budgetId <= 0) {
        observer.next([]);
        observer.complete();
        return;
      }

      const filter = `1 = 1 AND BudgetID = ${budgetId}`;
      const flds = 'HeadID, Head, BudgetID, Balance, Perecentage';

      console.log('getExpenseHeads filter:', filter);

      this.httpBase
        .getData('ExpenseHeads', {
          filter: filter,
          flds: flds,
          orderby: 'Head ASC',
        })
        .then((expenseHeads: any) => {
          const expenseHeadsArray = Array.isArray(expenseHeads)
            ? expenseHeads
            : expenseHeads ? [expenseHeads] : [];
          
          // Add computed fields
          const expenseHeadsWithInfo = expenseHeadsArray.map((head) => ({
            ...head,
            BudgetName: '', // Will be populated if needed
            IsActive: head.StatusID === BudgetStatus.Active
          }));
          
          console.log('Processed expense heads:', expenseHeadsWithInfo);
          
          observer.next(expenseHeadsWithInfo);
          observer.complete();
        })
        .catch((error) => {
          console.error('getExpenseHeads failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Create new budget head
   * Equivalent to VB6 btnSave_Click for new records
   */
  createBudgetHead(request: CreateBudgetHeadRequest): Observable<BudgetHead> {
    return new Observable((observer) => {
      // Validate percentage before saving
      this.validateBudgetPercentage(request.Percentage, 0).subscribe({
        next: (validation) => {
          if (!validation.isValid) {
            observer.error(new Error(validation.errors.join(', ')));
            return;
          }

          const data = {
            BudgetName: request.BudgetName,
            Percentage: request.Percentage,
            StatusID: request.StatusID || BudgetStatus.Active,
            CreatedDate: new Date(),
            CreatedBy: request.CreatedBy
          };

          this.httpBase
            .postData('BudgetHeads', data)
            .then((result: any) => {
              observer.next(result);
              observer.complete();
            })
            .catch((error) => {
              console.error('createBudgetHead failed:', error);
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
   * Update existing budget head
   * Equivalent to VB6 btnSave_Click for edit records
   */
  updateBudgetHead(request: UpdateBudgetHeadRequest): Observable<boolean> {
    return new Observable((observer) => {
      // Validate percentage before saving
      this.validateBudgetPercentage(request.Percentage, request.BudgetID).subscribe({
        next: (validation) => {
          if (!validation.isValid) {
            observer.error(new Error(validation.errors.join(', ')));
            return;
          }

          const data = {
            BudgetName: request.BudgetName,
            Percentage: request.Percentage,
            StatusID: request.StatusID,
            ModifiedDate: new Date(),
            ModifiedBy: request.ModifiedBy
          };

          this.httpBase
            .putData(`BudgetHeads/${request.BudgetID}`, data)
            .then((result: any) => {
              observer.next(true);
              observer.complete();
            })
            .catch((error) => {
              console.error('updateBudgetHead failed:', error);
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
   * Create new expense head
   */
  createExpenseHead(request: CreateExpenseHeadRequest): Observable<ExpenseHead> {
    return new Observable((observer) => {
      const data = {
        Head: request.Head,
        BudgetID: request.BudgetID,
        StatusID: request.StatusID || BudgetStatus.Active,
        CreatedDate: new Date(),
        CreatedBy: request.CreatedBy
      };

      this.httpBase
        .postData('ExpenseHeads', data)
        .then((result: any) => {
          observer.next(result);
          observer.complete();
        })
        .catch((error) => {
          console.error('createExpenseHead failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Update existing expense head
   */
  updateExpenseHead(request: UpdateExpenseHeadRequest): Observable<boolean> {
    return new Observable((observer) => {
      const data = {
        Head: request.Head,
        BudgetID: request.BudgetID,
        StatusID: request.StatusID,
        ModifiedDate: new Date(),
        ModifiedBy: request.ModifiedBy
      };

      this.httpBase
        .putData(`ExpenseHeads/${request.HeadID}`, data)
        .then((result: any) => {
          observer.next(true);
          observer.complete();
        })
        .catch((error) => {
          console.error('updateExpenseHead failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Delete budget head (set status to inactive)
   */
  deleteBudgetHead(budgetId: number, userId: number): Observable<boolean> {
    return new Observable((observer) => {
      const data = {
        StatusID: BudgetStatus.Inactive,
        ModifiedDate: new Date(),
        ModifiedBy: userId
      };

      this.httpBase
        .putData(`BudgetHeads/${budgetId}`, data)
        .then((result: any) => {
          observer.next(true);
          observer.complete();
        })
        .catch((error) => {
          console.error('deleteBudgetHead failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Validate budget percentage
   * Equivalent to VB6 percentage validation logic
   */
  validateBudgetPercentage(newPercentage: number, excludeBudgetId: number = 0): Observable<BudgetValidationResult> {
    return new Observable((observer) => {
      // Get current total percentage
      this.getCurrentTotalPercentage(excludeBudgetId).subscribe({
        next: (currentTotal) => {
          const totalWithNew = currentTotal + newPercentage;
          const isValid = totalWithNew <= 100;
          const remaining = 100 - currentTotal;

          const result: BudgetValidationResult = {
            isValid: isValid,
            errors: isValid ? [] : [`Total percentage cannot exceed 100%. Current total: ${currentTotal}%, Attempting to add: ${newPercentage}%, Would total: ${totalWithNew}%`],
            totalPercentage: totalWithNew,
            remainingPercentage: remaining
          };

          observer.next(result);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * Get current total percentage of all budgets
   */
  private getCurrentTotalPercentage(excludeBudgetId: number = 0): Observable<number> {
    return new Observable((observer) => {
      let filter = 'StatusID = 1';
      if (excludeBudgetId > 0) {
        filter += ` AND BudgetID <> ${excludeBudgetId}`;
      }

      this.httpBase
        .getData('BudgetHeads', {
          filter: filter,
          flds: 'SUM(Percentage) as TotalPercentage',
        })
        .then((result: any) => {
          const totalPercentage = result?.TotalPercentage || 0;
          observer.next(totalPercentage);
          observer.complete();
        })
        .catch((error) => {
          console.error('getCurrentTotalPercentage failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Calculate remaining balance for a budget
   */
  private calculateBudgetBalance(percentage: number): number {
    // This would typically calculate based on actual expenses vs budget
    // For now, returning the percentage as balance
    return 100 - percentage;
  }

  /**
   * Build filter string for budget queries
   */
  private buildBudgetFilter(criteria?: BudgetFilterCriteria): string {
    if (!criteria) {
      return 'StatusID = 1';
    }

    let filter = '';

    // Status filter
    if (criteria.showInactive) {
      filter = '1=1';
    } else {
      filter = 'StatusID = 1';
    }

    // Budget name filter
    if (criteria.budgetName && criteria.budgetName.trim()) {
      filter += ` AND BudgetName LIKE '%${criteria.budgetName.trim()}%'`;
    }

    // Specific status filter
    if (criteria.statusId !== undefined && criteria.statusId !== null && !criteria.showInactive) {
      filter += ` AND StatusID = ${criteria.statusId}`;
    }

    return filter;
  }

  /**
   * Check if current user can edit budget
   * Based on VB6: nDepartment = grpceo Or nDepartment = grpOperations Or nDepartment = grpGM
   */
  private canEditBudget(budget: BudgetHead): boolean {
    const userDepartment = this.httpBase.getUserDept();
    return (
      userDepartment === UserDepartments.grpCEO ||
      userDepartment === UserDepartments.grpOperations ||
      userDepartment === UserDepartments.grpGM
    );
  }

  /**
   * Get user permissions for budget operations
   * Based on VB6 LockObjs function logic
   */
  getUserPermissions(): BudgetPermissions {
    const userDepartment = this.httpBase.getUserDept();
    const hasEditPermission = (
      userDepartment === UserDepartments.grpCEO ||
      userDepartment === UserDepartments.grpOperations ||
      userDepartment === UserDepartments.grpGM
    );

    return {
      canAdd: hasEditPermission,
      canEdit: hasEditPermission,
      canView: true, // All users can view
      canDelete: hasEditPermission,
      canManageExpenseHeads: hasEditPermission,
      canViewReports: true
    };
  }

  /**
   * Export budget data to Excel
   * Equivalent to VB6 Print functionality
   */
  exportToExcel(criteria?: BudgetFilterCriteria): Observable<boolean> {
    return new Observable((observer) => {
      this.getBudgetHeads(criteria).subscribe({
        next: (budgets) => {
          // This would typically call a report service or generate Excel file
          console.log('Export budget data to Excel:', budgets);
          observer.next(true);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }

  /**
   * Get budget head by ID
   */
  getBudgetHeadById(budgetId: number): Observable<BudgetHeadView> {
    return new Observable((observer) => {
      this.httpBase
        .getData('qryBudgets', {
          filter: `BudgetID = ${budgetId}`,
        })
        .then((budget: any) => {
          if (budget) {
            const budgetWithBalance = {
              ...budget,
              Balance: this.calculateBudgetBalance(budget.Percentage),
              ExpenseHeadCount: 0,
              TotalAllocated: 0,
              IsEditable: this.canEditBudget(budget)
            };
            observer.next(budgetWithBalance);
            observer.complete();
          } else {
            observer.error(new Error('Budget not found'));
          }
        })
        .catch((error) => {
          console.error('getBudgetHeadById failed:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Get budget summary statistics
   */
  getBudgetSummary(): Observable<any> {
    return new Observable((observer) => {
      const query = `
        SELECT 
          COUNT(*) as TotalBudgets,
          SUM(Percentage) as TotalPercentageAllocated,
          (100 - SUM(Percentage)) as RemainingPercentage,
          AVG(Percentage) as AveragePercentage
        FROM BudgetHeads 
        WHERE StatusID = 1
      `;

      this.httpBase
        .getData('budget-summary', { query })
        .then((summary: any) => {
          observer.next(summary);
          observer.complete();
        })
        .catch((error) => {
          console.error('getBudgetSummary failed:', error);
          observer.error(error);
        });
    });
  }
}
