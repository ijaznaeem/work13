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
      position: 'right', // left|right
    },
    edit: {
      editButtonContent: '<i class="fa fa-pencil mr-3 text-primary"></i>',
      saveButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
      cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
      confirmSave: true,
    },
    add: {
      addButtonContent:
        '<h4 class="mb-1"><i class="fa fa-plus ml-3 text-success"></i></h4>',
      createButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
      cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="fa fa-trash-o text-danger"></i>',
      confirmDelete: true,
    },
    noDataMessage: 'No data found',
    columns: {},
    pager: {
      display: true,
      perPage: 10,
    },
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
  return (
    Math.round((num * 1 + Number.EPSILON) * Math.pow(10, dgt)) /
    Math.pow(10, dgt)
  );
}

export function getCurDate() {
  return JSON.parse(localStorage.getItem('currentUser') || '{}').date;
}

export function getCurrentTime(tim = null) {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}
export function getYMDDate(dte: any = null) {
  let d = new Date();
  if (dte) {
    d = new Date(dte);
  }
  console.log(d);
  return (
    d.getFullYear() +
    '-' +
    pad(d.getMonth() + 1, 2, '0') +
    '-' +
    pad(d.getDate(), 2, '0')
  );
}
export function getDMYDate(dte = null) {
  let d = new Date();
  if (dte) {
    d = new Date(dte);
  }

  return d.getDate() + '-' + (1 + d.getMonth()) + '-' + d.getFullYear();
}

export function JSON2Date(d) {
  return d.year + '-' + d.month.toString().padStart(2, '0') + '-' + d.day;
}

export function GetDateJSON(dte: Date | null = null) {
  let d = new Date();
  if (dte) {
    d = dte;
  }
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
  };
}

export function GetProps(source: any, props: any): any {
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
      month: 'January',
    },
    {
      monthno: 2,
      month: 'February',
    },
    {
      monthno: 3,
      month: 'March',
    },
    {
      monthno: 4,
      month: 'April',
    },
    {
      monthno: 5,
      month: 'May',
    },
    {
      monthno: 6,
      month: 'June',
    },
    {
      monthno: 7,
      month: 'July',
    },
    {
      monthno: 8,
      month: 'August',
    },
    {
      monthno: 9,
      month: 'September',
    },
    {
      monthno: 10,
      month: 'October',
    },
    {
      monthno: 11,
      month: 'November',
    },
    {
      monthno: 12,
      month: 'December',
    },
  ];
}
export function FindTotal(data, fld) {
  const sum = data.reduce((a, b) => Number(a) + Number(b[fld]), 0);
  return sum;
}
export function GroupBy(array, key) {
  return array.reduce(
    (objectsByKeyValue, obj) => ({
      ...objectsByKeyValue,
      [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj),
    }),
    {}
  );
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

export function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export function MonthDiff(d1, d2) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

export function AddMonths(d: Date, m: number) {
  let dte = new Date(d);
  dte.setMonth(dte.getMonth() + m);
  return dte.toISOString();
}
export function getFileType(filename) {
  return filename.split('.').pop();
}
