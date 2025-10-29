import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

export class PDFInvoice {
  constructor() {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  CreaePDFInvoice(PrintData: any) {
    console.log(PrintData);

    var dd: any = {
      content: [
        {
          text: 'SALE ORDER',
          style: 'header',
          alignment: 'center',
        },
        {
          columns: [
            {
              width: '33%',
              text: '', // Empty column
            },
            {
              width: '33%',
              text: '', // Empty column
            },
            {
              width: '33%',
              stack: [
                {
                  text: 'Order #',
                  bold: true,
                },
                PrintData.order_id,
                {
                  text: 'Date',
                  bold: true,
                },
                PrintData.date,
              ],
            },
          ],
          style: 'details',
        },
      ],
    };

    dd.content.push({
      columns: [
        {
          width: '33%',
          stack: [
            {
              text: 'Main Branch',
              bold: true,
            },
            {
              text: 'Branch Address',
              bold: true,
            },
            'Branch City and Country',
          ],
        },

        {
          width: '33%',
          text: '', // Empty column
        },
        {
          width: '33%',
          stack: [
            {
              text: 'Customer',
              bold: true,
            },
            {
              text: PrintData.customer_name,
              bold: true,
            },
            PrintData.address,
          ],
        },
      ],
    });

    dd.content.push({
      columns: [
        {
          width: '33%',
          stack: [
            {
              text: 'Bill To',
              bold: true,
            },
            {
              text: 'Branch Address',
              bold: true,
            },
            'Branch City and Country',
          ],
        },

        {
          width: '33%',
          text: '', // Empty column
        },
        {
          width: '33%',
          stack: [
            {
              text: 'Amount Due',
              bold: true,
            },
            {
              text: '$' + PrintData.net_amount,
              bold: true,
            },
          ],
        },
      ],
    });

    let item = PrintData.details;
    var tableDetails = {
      table: {
        widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
        body: [
          [
            '#',
            'Item & Description',
            { text: 'Rate', alignment: 'right' },
            { text: 'Qty', alignment: 'right' },
            { text: 'Tax', alignment: 'right' },
            { text: 'Amount', alignment: 'right' },
          ],
          // Add more rows for other items using ngFor loop
        ],
      },
      layout: 'lightHorizontalLines',
      style: 'details',
    };

    item.forEach((el) => {
      tableDetails.table.body.push([
        {
          text: '1',
          alignment: 'center',
        },
        {
          text: el.product_name + '\n' + el.details,
          alignment: 'left',
        },
        {
          text: el.price,
          alignment: 'right',
        },
        {
          text: el.qty,
          alignment: 'right',
        },
        {
          text: el.vat_amount + '\n' + el.vat + '%',
          alignment: 'center',
        },
        {
          text: el.net_amount,
          alignment: 'right',
        },
      ]);
    });
    dd.content.push(tableDetails);
    dd.content.push({ text: '   ' });
    dd.content.push({ text: '   ' });
    dd.content.push({
      columns: [
        {
          width: '33%',
          text: 'Payment Details',
          bold: true,
        },
        {
          width: '33%',
          text: ' ',
        },
        {
          width: '33%',
          text: 'Bill Amount',
          bold: true,
        },
      ],
    });

    dd.content.push({
      columns: [
        {
          width: '33%',
          stack: [
            {
              columns: [
                {
                  width: '50%',
                  text: 'Bank Name:',
                },
                {
                  width: '50%',
                  text: PrintData.branch.bank_name,
                },
              ],
            },
            {
              columns: [
                {
                  width: '50%',
                  text: 'Account Name:',
                },
                {
                  width: '50%',
                  text: PrintData.branch.account_title,
                },
              ],
            },
            {
              columns: [
                {
                  width: '50%',
                  text: 'IBAN:',
                },
                {
                  width: '50%',
                  text: PrintData.branch.iban_no,
                },
              ],
            },
            {
              columns: [
                {
                  width: '50%',
                  text: 'SWIFT Code:',
                },
                {
                  width: '50%',
                  text: PrintData.branch.swift_code,
                },
              ],
            },
          ],
        },
        {
          width: '33%',
          text: ' ', // Empty column
        },
        {
          width: '33%',
          stack:[{text: 'lightHorizontalLines:', fontSize: 14, bold: true, margin: [0, 20, 0, 8]},
          {

            table: {
              headerRows: 1,
              body: [
                [{text: 'Header 1', style: 'tableHeader'}, {text: 'Header 2', style: 'tableHeader'}, {text: 'Header 3', style: 'tableHeader'}],
                ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                ['Sample value 1', 'Sample value 2', 'Sample value 3'],
              ]
            },
            layout: 'lightHorizontalLines'
          }]
        },
      ]
    });

    console.log(dd);




  }
  AddPaymentDetails(data){
    let dd = [{text: 'lightHorizontalLines:', fontSize: 14, bold: true, margin: [0, 20, 0, 8]},
		{

			table: {
				headerRows: 1,
				body: [
					[{text: 'Header 1', style: 'tableHeader'}, {text: 'Header 2', style: 'tableHeader'}, {text: 'Header 3', style: 'tableHeader'}],
					['Sample value 1', 'Sample value 2', 'Sample value 3'],
					['Sample value 1', 'Sample value 2', 'Sample value 3'],
					['Sample value 1', 'Sample value 2', 'Sample value 3'],
					['Sample value 1', 'Sample value 2', 'Sample value 3'],
					['Sample value 1', 'Sample value 2', 'Sample value 3'],
				]
			},
			layout: 'lightHorizontalLines'
		}]
  return dd;
  }

}
