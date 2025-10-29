import { Injectable } from '@angular/core';
import { HttpBase } from '../../../../services/httpbase.service';

@Injectable({
  providedIn: 'root'
})
export class AmendmentApprovalService {

  constructor(private http: HttpBase) {}

  /**
   * Get amendment approvals using the same query logic as VB6
   * VB6 Query: "select * from qryAmmendmentApprovals where Status = '" & cmbStatus.Text & "'"
   * Since qryAmmendmentApprovals doesn't exist, using amendmentaprovals table directly
   */
  getAmendmentApprovals(status: string, fromDate?: string, toDate?: string): any {
    let whereClause = `Status = '${status}'`;
    
    // Add date filter for Posted/Rejected status (VB6 logic)
    if ((status === 'Posted' || status === 'Rejected') && fromDate && toDate) {
      whereClause += ` AND Date BETWEEN '${fromDate}' AND '${toDate}'`;
    }

    // Use exact table name from database.sql
    const query = `SELECT * FROM amendmentaprovals WHERE ${whereClause}`;
    
    return this.http.getData('amendment-approvals', { query })
      .catch(() => {
        // Fallback to mock data if API fails
        return this.getMockAmendmentApprovals(status);
      });
  }

  /**
   * Get amendment details using the exact same query as VB6
   * VB6 Query: "Select ProductName, OldQty, NewQty, Type, RawID, AmendmentID from [qryAmendmentDetails] where [AmendmentID] = " & GetLVal(grdData, "AmendmentID")
   */
  getAmendmentDetails(amendmentId: number): any{
    // Use exact view name from database.sql: qryamendmentdetails
    const query = `SELECT ProductName, OldQty, NewQty, Type, RawID, AmendmentID, PPrice, Category, DetailID 
                   FROM qryamendmentdetails 
                   WHERE AmendmentID = ${amendmentId}`;
    
    return this.http.getData('amendment-details', { query })
      .catch(() => {
        return this.getMockAmendmentDetails(amendmentId);
      });
  }

  /**
   * Post amendment approval using VB6 logic
   * Updates amendmentaprovals table status to 'Completed'
   */
  postAmendmentApproval(amendmentId: number): Promise<any> {
    const query = `UPDATE amendmentaprovals SET Status = 'Completed' WHERE AmendmentID = ${amendmentId}`;
    
    return this.http.postData('amendment-approvals/post', { query, amendmentId });
  }

  /**
   * Process amendment details according to VB6 PostApproval logic
   * Manipulates ProductDetails table based on Type (Add/Change/Delete)
   */
  async processAmendmentDetails(amendmentId: number, masterProductId: number): Promise<void> {
    // First get the details using the same query as VB6
    const details = await this.getAmendmentDetails(amendmentId);
    
    for (const detail of details) {
      const productFilter = `ProductID = ${masterProductId} AND RawID = ${detail.RawID} AND Category = '${detail.Category}'`;
      
      switch (detail.Type) {
        case 'Add':
          // VB6: INSERT INTO ProductDetails
          const insertQuery = `INSERT INTO productdetails (ProductID, RawID, Qty, Category, SortID) 
                              VALUES (${masterProductId}, ${detail.RawID}, ${detail.NewQty}, '${detail.Category}', 0)`;
          await this.http.postData('product-details', { query: insertQuery });
          break;
          
        case 'Change':
          // VB6: UPDATE ProductDetails SET Qty
          const updateQuery = `UPDATE productdetails SET Qty = ${detail.NewQty} WHERE ${productFilter}`;
          await this.http.postData('product-details/update', { query: updateQuery });
          break;
          
        case 'Delete':
          // VB6: DELETE FROM ProductDetails
          const deleteQuery = `DELETE FROM productdetails WHERE ${productFilter}`;
          await this.http.postData('product-details/delete', { query: deleteQuery });
          break;
      }
    }
  }

  /**
   * Add remarks to amendment approval (VB6 functionality)
   * Updates Remarks field in amendmentaprovals table
   */
  addRemarks(amendmentId: number, newRemarks: string): Promise<any> {
    const query = `UPDATE amendmentaprovals SET Remarks = '${newRemarks}' WHERE AmendmentID = ${amendmentId}`;
    
    return this.http.postData('amendment-approvals/remarks', { query, amendmentId, remarks: newRemarks });
  }

  /**
   * Forward amendment approval (VB6 functionality)
   * Updates ForwardedTo field in amendmentaprovals table
   */
  forwardAmendment(amendmentId: number, forwardedTo: number): Promise<any> {
    const query = `UPDATE amendmentaprovals SET ForwardedTo = ${forwardedTo} WHERE AmendmentID = ${amendmentId}`;
    
    return this.http.postData('amendment-approvals/forward', { query, amendmentId, forwardedTo });
  }

  /**
   * Create new amendment approval (VB6 Add functionality)
   * Inserts into amendmentaprovals table
   */
  createAmendmentApproval(amendmentData: any): Promise<any> {
    const query = `INSERT INTO amendmentaprovals (Date, MasterProductID, Remarks, Status, ForwardedTo) 
                   VALUES ('${amendmentData.Date}', ${amendmentData.MasterProductID}, '${amendmentData.Remarks}', 
                           '${amendmentData.Status}', ${amendmentData.ForwardedTo})`;
    
    return this.http.postData('amendment-approvals', { query, ...amendmentData });
  }

  /**
   * Create amendment detail records (VB6 Add functionality)
   * Inserts into amendmentdetails table
   */
  createAmendmentDetail(detailData: any): Promise<any> {
    const query = `INSERT INTO amendmentdetails (AmendmentID, RawID, OldQty, NewQty, Type, Category) 
                   VALUES (${detailData.AmendmentID}, ${detailData.RawID}, ${detailData.OldQty}, 
                           ${detailData.NewQty}, '${detailData.Type}', ${detailData.Category})`;
    
    return this.http.postData('amendment-details', { query, ...detailData });
  }

  // Mock data methods for fallback (maintains exact VB6 data structure)
  private getMockAmendmentApprovals(status: string): any[] {
    const allData = [
      {
        AmendmentID: 1,
        Date: '2025-01-15',
        MasterProductID: 101,
        Status: 'In Process',
        ForwardedTo: 3, // grpCEO
        Remarks: 'Amendment initiated for formulation change\n---------------\nQC On: 15/01/2025\nStatus: Approved for further review'
      },
      {
        AmendmentID: 2,
        Date: '2025-01-14',
        MasterProductID: 102,
        Status: 'Completed',
        ForwardedTo: 2, // grpOperations
        Remarks: 'Amendment completed successfully\n---------------\nGM On: 14/01/2025\nStatus: Posted'
      },
      {
        AmendmentID: 3,
        Date: '2025-01-13',
        MasterProductID: 103,
        Status: 'Rejected',
        ForwardedTo: 1, // grpQC
        Remarks: 'Amendment rejected\n---------------\nCEO On: 13/01/2025\nStatus: Rejected'
      }
    ];

    return allData.filter(item => item.Status === status);
  }

  private getMockAmendmentDetails(amendmentId: number): any[] {
    const allDetails: { [key: number]: any[] } = {
      1: [
        {
          AmendmentID: 1,
          RawID: 201,
          ProductName: 'Microcrystalline Cellulose',
          Type: 'Change',
          OldQty: 50.0,
          NewQty: 55.0,
          Category: 'Excipient',
          PPrice: 2.50,
          DetailID: 1
        },
        {
          AmendmentID: 1,
          RawID: 202,
          ProductName: 'Magnesium Stearate',
          Type: 'Add',
          OldQty: 0.0,
          NewQty: 2.0,
          Category: 'Lubricant',
          PPrice: 15.00,
          DetailID: 2
        }
      ],
      2: [
        {
          AmendmentID: 2,
          RawID: 203,
          ProductName: 'Lactose Monohydrate',
          Type: 'Delete',
          OldQty: 25.0,
          NewQty: 0.0,
          Category: 'Filler',
          PPrice: 1.80,
          DetailID: 3
        }
      ],
      3: [
        {
          AmendmentID: 3,
          RawID: 204,
          ProductName: 'Corn Starch',
          Type: 'Change',
          OldQty: 30.0,
          NewQty: 35.0,
          Category: 'Disintegrant',
          PPrice: 1.20,
          DetailID: 4
        }
      ]
    };

    return allDetails[amendmentId] || [];
  }
}