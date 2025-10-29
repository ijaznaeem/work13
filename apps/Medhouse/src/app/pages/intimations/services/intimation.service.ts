import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpBase } from '../../../services/httpbase.service';
import {
  Department,
  DocumentHistory,
  IntimationFilter,
  IntimationLetter,
  IntimationStatus,
  User
} from '../models/intimation.models';

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class IntimationService {

    private intimationTable = 'IntimationLetter';
  private departmentTable = 'Departments';
  private userTable = 'Users';

  constructor(private http: HttpBase) { }

  // Get all intimation letters with filters and pagination
  getIntimations(filter: IntimationFilter) {
    const params = this.buildFilterParams(filter);

    console.log(params);
    
    return this.http.getData(`qryIntimationLetter`, params);
  }

  // Get all intimations without pagination (for backwards compatibility)
  getAllIntimations(filter: IntimationFilter) {
    return this.getIntimations(filter)
   }

  // Get single intimation by ID with optional related data
  getIntimation(id: number, includeRelated: boolean = true): Observable<IntimationLetter> {
    const params = includeRelated ? { include: 'department,history' } : {};
    return from(this.http.getData(`${this.intimationTable}/${id}`, params) as Promise<IntimationLetter>);
  }

  // Create new intimation
  createIntimation(intimation: IntimationLetter): Observable<IntimationLetter> {
    return from(this.http.postData(`${this.intimationTable}`, intimation) as Promise<IntimationLetter>);
  }

  // Update intimation
  updateIntimation(id: number, intimation: Partial<IntimationLetter>): Observable<IntimationLetter> {
    return from(this.http.putData(`${this.intimationTable}/${id}`, intimation) as Promise<IntimationLetter>);
  }

  // Delete intimation
  deleteIntimation(id: number): Observable<{ message: string }> {
    return from(this.http.deleteData(`${this.intimationTable}/${id}`) as Promise<{ message: string }>);
  }

  // Get document history for an intimation
  getDocumentHistory(intimationId: number): Observable<DocumentHistory[]> {
    return from(this.http.getData('qryDocHistory', {
      filter: `DocumentID= ${intimationId} and Type= 1`,
      sortby: 'Date DESC'
    }) as Promise<{ data: DocumentHistory[] }>).pipe(
      map(response => response.data || [])
    );
  }

  // Add comment/history to intimation
  addComment(history: DocumentHistory): Observable<DocumentHistory> {
    return from(this.http.postData('DocumentsHistory', history) as Promise<DocumentHistory>);
  }

  // Forward intimation to another user
  forwardIntimation(intimationId: number, forwardTo: number, remarks: string): Observable<any> {
    const historyData = {
      Date: new Date(),
      Time: new Date().toLocaleTimeString(),
      Remarks: remarks,
      DocumentID: intimationId,
      Type: 1,
      ForwardTo: forwardTo
    };
    return from(this.http.postData('Intimations/forward', { intimationId, forwardTo, history: historyData }));
  }

  // Complete intimation
  completeIntimation(intimationId: number, remarks: string): Observable<any> {
    return from(this.http.postData('Intimations/complete', { intimationId, remarks }));
  }

  // Get intimation statuses
  getIntimationStatuses(): Observable<IntimationStatus[]> {
    return from(this.http.getData('IntimationStatus') as Promise<IntimationStatus[]>);
  }

  // Get departments using the new DataApi
  getDepartments() {
    return this.http.getData(`${this.departmentTable}`, { limit: 100 })
  }

  // Get users by department using the new DataApi
  getUsersByDepartment(departmentId?: number): Observable<User[]> {
    const params: any = { limit: 100 };
    if (departmentId) {
      params.filter =  'Department = ' + departmentId;
    }
    return from(this.http.getData(`${this.userTable}`, params) as Promise<any>).pipe(
      map(response => response)
    );
  }

  // Get current user pending intimations
  getPendingIntimations(){
    return this.getAllIntimations({ activeOnly: true });
  }

  // Search intimations with text query
  searchIntimations(searchText: string, page: number = 1, limit: number = 20): Observable<PaginatedResponse<IntimationLetter>> {
    const params = {
      search: searchText,
      page,
      limit,
      sort: '-Date'
    };
    return from(this.http.getData(`${this.intimationTable}`, params) as Promise<PaginatedResponse<IntimationLetter>>);
  }

  private buildFilterParams(filter: IntimationFilter): any {
    

    // Build filter object for the DataApi
    let filterObj: string = ' 1= 1 ';

     if (filter.dateFrom && filter.dateTo) {
      // For date range filtering, we'll use a custom approach
      filterObj += ` and (Date between '${this.formatDate(filter.dateFrom)}' and '${this.formatDate(filter.dateTo)}')`;      
    }


    if (filter.DepartmentID) {
      filterObj += ` and (DepartmentID=${filter.DepartmentID})`;
    }

    if (filter.activeOnly !== undefined) {
      filterObj += ` and (IsClosed=${filter.activeOnly ? 0 : 1})`;
    }

    return { sortby: 'Date DESC', filter: filterObj };
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
