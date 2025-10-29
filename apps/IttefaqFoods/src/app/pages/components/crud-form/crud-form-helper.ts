export function AddLookupFld(
  fldName,
  label,
  listTable,
  valueFld,
  displayFld,
  size,
  data: any = [],
  required = true,
  options: any = {}
) {
  return Object.assign(
    {
      fldName,
      control: 'select',
      type: 'lookup',
      label,
      listTable,
      listData: data,
      valueFld,
      displayFld,
      required,
      size,
    },
    options
  );
}
export function AddInputFld(
  fldName,
  label,
  size,
  required = true,
  type = 'Text',
  options: any = {}
) {
  return Object.assign(
    {
      fldName: fldName,
      control: 'input',
      type: type,
      label: label,
      required: required,
      size: size,
    },
    options
  );
}
export function AddSpacer(size) {
  return {
    fldName: '',
    control: '',
    type: '',
    label: '',
    size: size,
  };
}
export function AddHiddenFld(fldName, options: any = {}) {
  return Object.assign(
    {
      fldName: fldName,
      control: 'hidden',
    },
    options
  );
}
export function AddCheckBox(
  fldName,
  label,
  size,
  required = true,
  cssClass = 'primary'
) {
  return {
    fldName: fldName,
    control: 'checkbox',
    class: cssClass,
    label: label,
    required: required,
    size: size,
  };
}
export function AddFormButton(
  label,
  onClick,
  size = 2,
  icon: null | string = null,
  cssClass = 'primary'
) {
  return {
    fldName: label,
    control: 'button',
    type: 'button',
    label: label,
    size: size,
    OnClick: onClick,
    cssClass: cssClass,
    icon: icon,
  };
}
export function AddTextArea(
  fldName: string,
  label: string,
  size = 6,
  required = true,
  options: any = {}
) {
  return Object.assign(
    {
      fldName: fldName,
      control: 'textarea',
      label: label,
      required: required,
      size: size,
      rows: 3,
    },
    options
  );
}
export function AddHTMLEditor(
  fldName: string,
  label: string,
  size = 6,
  required = true
) {
  return {
    fldName: fldName,
    control: 'html-editor',
    label: label,
    required: required,
    size: size,
  };
}

export function AddImageFld(
  fldName,
  label,
  size,
  required = true,
  options: any = {}
) {
  return Object.assign(
    {
      fldName: fldName,
      control: 'file',
      type: 'image',
      label: label,
      required: required,
      size: size,
    },
    options
  );
}
export function AddRadioFld(
  fldName,
  data,
  valueFld,
  displayFld,
  size,
  required = true
) {
  return {
    fldName: fldName,
    control: 'radio',
    type: '',
    listData: data,
    valueFld: valueFld,
    displayFld: displayFld,
    required: required,
    size: size,
  };
}
export function FindCtrl(form: any, fldName: string) {
  return form.columns.find((x) => x.fldName == fldName);
}
