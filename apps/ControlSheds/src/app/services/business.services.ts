import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class BusinessServices {
    public curBuniessID :any='0' ;
    public Blist = [];
    
    getBusinessID (){
        let bid = JSON.parse(localStorage.getItem('currentUser') || '{}').businessid;
        if (bid=='0' || bid =='')
            return this.curBuniessID;
        else 
            return bid;
    }
}

