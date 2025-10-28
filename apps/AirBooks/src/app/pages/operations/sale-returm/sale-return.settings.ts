import { ACTION_CREATE, ACTION_EDIT } from "../../../factories/static.data";
import { AddInputFld, AddLookupFld, AddTextArea } from "../../components/crud-form/crud-form-helper";

export const ListTableSettings: any = {

    Columns: [
      {
        fldName: 'date',
        label: 'Date',
    },
        {
            fldName: 'invoice_id',
            label: 'Invoice No',
            valueFormatter: (d) => {
                return `Inv # ${d.invoice_id}`;
            },

        },
        {
            fldName: 'customer_name',
            label: 'Customer Name',
        },

        {
            fldName: 'passport_no',
            label: 'Passport No',
        },

        {
            fldName: 'product_name',
            label: 'Product',
        },


        {
            fldName: 'staff',
            label: 'Staff Remarks',
        },

        {
            fldName: 'operations',
            label: 'Operation Rem',
        },
        {
            fldName: 'accounts',
            label: 'Accounts Rem',
        },
        {
            fldName: 'refund_amount',
            label: 'Refund Amount',
        },


    ],
    Actions: [
      ACTION_CREATE,
      ACTION_EDIT,
        {
            action: 'crnote',
            title: 'Add Credit Note',
            icon: 'plus',
            class: 'warning',

        },
        {
            action: 'drnote',
            title: 'Add Debit Note',
            icon: 'plus',
            class: 'warning',
        },

    ],

};
export const SaleReturn_Form = {
    title: 'Reuest Sale return',
    tableName: 'invoicereturn',
    pk: 'return_id',
    columns: [
        AddInputFld('date','Date:',2,true,'date'),
        AddLookupFld('invoice_id','Select Invoice','','invoice_id','customer_name',4,[]),
        AddLookupFld('product_id','Select Product','','product_id','product_name',6),
        AddInputFld('ticket_no','Ticket No:',2,true,'text'),
        AddInputFld('passport_no','Passport No:',2,true,'text'),
        AddLookupFld('agent_id','Agent Name','qryagents','userid','name',4,[],true,{disabled: true}),
        AddTextArea('staff','Staff Remarks:',12,false),
        AddTextArea('operations','Operations Remarks:',12, false),
        AddTextArea('accounts','Accounts Remarks:',12,false),
        AddInputFld('amount','Inv. Amount:',2,true,'number', {readonly: true}),
        AddInputFld('refund_amount','Amount:',2,true,'number'),
    ],
};
export const CrNote_Form = {
    title: 'Credit Note',
    tableName: 'drcr_note',
    pk: 'note_id',
    columns: [
        AddInputFld('date','Date:',4,true,'date'),
        AddInputFld('account_name','Customer Name:',8,false,'text',{readonly:true}),
        AddInputFld('account_id','',8,false,'hidden'),
        AddTextArea('description','Products:',12,true,{readonly: true} ),
        AddInputFld('credit','Amount:',4,true,'number', {readonly: true}),
    ],
};

export const DrNote_Form = {
    title: 'Debit Note',
    tableName: 'drcr_note',
    pk: 'note_id',
    columns: [
        AddInputFld('date','Date:',4,true,'date'),
        AddInputFld('account_name','Supplier Name:',8,false,'text',{readonly:true}),
        AddInputFld('account_id','',8,false,'hidden'),
        AddTextArea('description','Products:',12,true,{readonly: true} ),
        AddInputFld('debit','Amount:',4,true,'number'),
    ],
};
