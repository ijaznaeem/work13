export class ProductsCategorySettings {

  public static FormFields() {
    return  [
      {key: 'CatName',
    type: 'input',
    templateOptions: {
      type: 'text',
      label: 'Category Name',
      placeholder: 'category name here'
    }},   {key: 'CatCode',
    type: 'input',
    templateOptions: {
      type: 'text',
      label: 'Category Code',
      placeholder: 'category code here'
    }
  }
    ];
  }

  public static formList() {
    return {
      selectMode: 'single',  //single|multi
      hideHeader: false,
      hideSubHeader: false,
      mode: 'external',
      actions: {
        columnTitle: 'Actions',
        add: true,
        edit: true,
        delete: true,
        position: 'right' // left|right
      },
      edit: {
        editButtonContent: '<i class="fa fa-pencil mr-3 text-primary"></i>',
        saveButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
        cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
        confirmSave: true
      },
      add: {
        addButtonContent: '<h4 class="mb-1"><i class="fa fa-plus ml-3 text-success"></i></h4>',
        createButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
        cancelButtonContent: '<i class="fa fa-times text-danger"></i>',

      },
      delete: {
        deleteButtonContent: '<i class="fa fa-trash-o text-danger"></i>',
        confirmDelete: true
      },
      noDataMessage: 'No data found',
      columns: {
        CatID: {
          title: 'ID',
          editable: false,
          width: '60px',
          type: 'html',
          valuePrepareFunction: (value) => { return '<div class="text-center">' + value + '</div>'; }
        },
        CatName: {
          title: 'Category Name',

          filter: true,
          type: 'string'

        },CatCode: {
          title: 'Category Code',

          filter: true,
          type: 'string'

        }
      },
      pager: {
        display: true,
        perPage: 30
      }
    };
  }
}
