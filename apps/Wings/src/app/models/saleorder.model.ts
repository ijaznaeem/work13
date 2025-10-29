export class SaleOrderModel {
  details: any = '';
  order_id: string = '';
  date: any = '';
  inquiry_id: string = '';
  customer_id: string = '';
  customer_name: string = '';
  contact_no: string = '';
  amount: number = 0;
  discount: number = 0;
  status_id: string = '';
  customer_type: string = '';
  whatsapp_no: string = '';
  email: string = '';
  address: string = '';
  country: string = '';
  product_id: string = '';
  agent_id: string = '';
  branch_id: string = '';
  notes: string = '';
  vat:any = '0';
  markup:any = '0';
  charges_id= '1';
  bank_charges:any = 0;
  bill_to: string = '';
  package: string = '';
}

export class OrderDetailsModel {
  detailid = '';
  order_id = '0';
  product_id = '';
  qty = '1';
  price = '0';
  discount = '0';
  vat = '0';
  markup=  '0';
  branch_id = '';
  book_ref = '';
  ticket_no = '';
  passport_no = '';
  nationality_id = '';
  travel_date = '';
  return_date = '';
  post_date = '';
  origin = '';
  destination = '';
  airline = '';
  route = '';
  servicecharges = '';
  description='';
  package='';
  staff_cost=0;

}
