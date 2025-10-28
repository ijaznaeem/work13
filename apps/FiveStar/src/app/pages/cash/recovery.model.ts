import { getCurDate, GetDateJSON } from '../../factories/utilities';

export class RecoveryModel {
    Date: any = GetDateJSON(new Date(getCurDate()));
    RouteID = '';
    CustomerID = '';
    RefID = '';
    Description = '';
    PrevBalance = 0;
    Amount = 0;
    SalesmanID = '';
    Type = 1;
    UserID = '';
    ClosingID = JSON.parse(localStorage.getItem('currentUser')).closingid;
}
