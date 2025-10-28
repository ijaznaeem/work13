export function TableSetting(cols: any[]) {
  const stngs = {
    selectMode: 'single', // single|multi
    hideHeader: false,
    hideSubHeader: false,
    mode: 'internal',
    actions: {
      columnTitle: 'Actions',
      add: false,
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
      addButtonContent:
        '<h4 class="mb-1"><i class="fa fa-plus ml-3 text-success"></i></h4>',
      createButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
      cancelButtonContent: '<i class="fa fa-times text-danger"></i>'
    },
    delete: {
      deleteButtonContent: '<i class="fa fa-trash-o text-danger"></i>',
      confirmDelete: true
    },
    noDataMessage: 'No data found',
    columns: {},
    pager: {
      display: true,
      perPage: 10
    }
  };

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < cols.length; i++) {
    stngs.columns[cols[i].fldname] = { title: cols[i].title, type: 'string' };
  }

  return stngs;
}
export function RoundTo2(num) {
  return RoundTo(num, 2);
}
export function RoundTo(num: number, dgt: number) {
  return Math.round((num * 1 + Number.EPSILON) * Math.pow(10, dgt)) / Math.pow(10, dgt);
}

export function getCurDate() {
  return JSON.parse(localStorage.getItem('currentUser') || "{}").date;
}

export function getCurrentTime(tim = null) {
  return (
    new Date().getHours() +
    ':' +
    (new Date().getMinutes() + 1) +
    ':' +
    new Date().getSeconds()
  );
}
export function getYMDDate(dte: any = null) {
  let d = new Date();
  if (dte) {
    d = dte;
  }
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}
export function getDMYDate(dte :any= null) {
  let d = new Date();
  if (dte) {
    d = dte;
  }
  return d.getDate() + '-' + (1 + d.getMonth()) + '-' + d.getFullYear();
}

export function JSON2Date(d) {
  return d.year + '-' + d.month + '-' + d.day;
}

export function GetDateJSON(dte: Date | null = null) {
  let d = new Date();
  if (dte) {
    d = dte;
  }
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate()
  };
}

export function GetProps(source: object, props: any[]) {
  let v: any = {};
  for (let i = 0; i < props.length; i++) {
    v[props[i]] = source[props[i]];
  }
  return v;
}
export function getMonthList() {
  return [
    {
      monthno: 1,
      month: 'January'
    },
    {
      monthno: 2,
      month: 'February'
    },
    {
      monthno: 3,
      month: 'March'
    },
    {
      monthno: 4,
      month: 'April'
    },
    {
      monthno: 5,
      month: 'May'
    },
    {
      monthno: 6,
      month: 'June'
    },
    {
      monthno: 7,
      month: 'July'
    },
    {
      monthno: 8,
      month: 'August'
    },
    {
      monthno: 9,
      month: 'September'
    },
    {
      monthno: 10,
      month: 'October'
    },
    {
      monthno: 11,
      month: 'November'
    },
    {
      monthno: 12,
      month: 'December'
    }
  ];
}
export function FindTotal(data, fld) {
  const sum = data.reduce((a, b) => parseFloat(a) + parseFloat(b[fld]), 0);
  return sum;
}

export function getYears() {
  const years: any = [];
  for (
    let i = new Date().getFullYear() - 1;
    i < new Date().getFullYear() + 3;
    i++
  ) {
    years.push(i);
  }
  return years;
}

export function AddDays(date, number) {
  const newDate = new Date(date);
  return new Date(newDate.setDate(newDate.getDate() + number));
}

export function groupby(array, key) {
  return array.reduce(
    (objectsByKeyValue, obj) => ({
      ...objectsByKeyValue,
      [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj)
    }),
    {}
  );
}
export function GroupLapReport(arr) {
  return Array.from(new Set(arr.map((item) => item.description)))
    .map(g => {
      return {
        description: g,
        values: arr.filter(i => i.description === g)
      };
    });
}

export function convertToPlain(rtf) {
  rtf = rtf.replace(/\\par[d]?/g, "");
  rtf = rtf.replace(/\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?[ ]?/g, "").trim();
  rtf = rtf.replace("\\", " \\");
  rtf = rtf.replace(/(\\\S+)/gi, "");

  return rtf;
}

export function SortArray(array: any, prop) {
  return array.sort(
    (a, b) => {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    })
}    