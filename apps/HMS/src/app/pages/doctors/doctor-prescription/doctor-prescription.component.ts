import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  HtmlEditorService,
  ImageService,
  LinkService,
  QuickToolbarService,
  ToolbarService,
} from '@syncfusion/ej2-angular-richtexteditor';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { InitialModalState } from '../../../factories/forms.factory';
import {
  convertToPlain,
  GetDateJSON,
  getYMDDate,
  groupby,
  JSON2Date,
} from '../../../factories/utilities';
import { HttpBase } from '../../../services/httpbase.service';
import { AddPatientComponent } from '../add-patient/add-patient.component';
import { ItemsListComponent } from '../items/items-list.component';
import { PatientProfileComponent } from '../patient-profile/patient-profile.component';

@Component({
  selector: 'app-doctor-prescription',
  templateUrl: './doctor-prescription.component.html',
  styleUrls: ['./doctor-prescription.component.scss'],
  providers: [
    ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
    QuickToolbarService,
  ],
})
export class DoctorPrescriptionComponent implements OnInit, AfterViewInit {
  @ViewChild('remarks') _remarks: ElementRef;

  @Input() apptid: string = '';
  setting: any = {
    crud: true,
    Columns: [
      {
        label: 'Medicine',
        fldName: 'medicine_name',
      },
      {
        label: 'Qty',
        fldName: 'dose_qty',
      },
      {
        label: 'Doze',
        fldName: 'dose',
      },
      {
        label: 'ِInstructions',
        fldName: 'instructions',
      },
    ],
    Actions: [
      {
        action: 'delete',
        title: 'Delete',
        icon: 'trash',
        class: 'danger',
      },
    ],
    Data: [],
  };

  labsetting = {
    crud: true,
    Columns: [
      {
        label: 'Test Name',
        fldName: 'test_name',
      },
    ],
    Actions: [
      {
        action: 'delete',
        title: 'Delete',
        icon: 'trash',
        class: 'danger',
      },
    ],
  };

  public data: any = [];

  public LabData: any = [];

  public ApptData: any = [];
  public Medicines: any = [];
  public LabTests: any = [];
  public PatientData: any = [];
  public PatMed: any = {};
  public PatLabTest: any = {};
  public ApptID: any = '';
  ItemsGroups: any = {};
  constructor(
    private http: HttpBase,
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.LoadItemsData();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.ApptID = params.apptid || this.apptid;

      this.http.getData('apptdata/' + this.ApptID).then((data: any) => {
        this.ApptData = data;
        this.ApptData.next_date = GetDateJSON(
          new Date(this.ApptData.next_date)
        );
        this.ApptData.remarks = convertToPlain(this.ApptData.remarks + '');
        this.LoadPatientData();
        this.setTextAreaFocused();
      });
    });

    this.Medicines = this.http.getMedicines();

    this.http.getData('labtests').then((data) => {
      this.LabTests = data;
    });
  }
  LoadPatientData() {
    this.http
      .getData('patients/' + this.ApptData.patient_id)
      .then((data: any) => {
        this.PatientData = data;

        let diff = moment(this.PatientData.dob).diff(moment(), 'years');
        this.PatientData.age = diff * 1 + 1;
        this.PatientData.ageYrs = 'Years';
        console.log(this.PatientData);
      });
  }
  ngAfterViewInit() {
    //  this.setTextAreaFocused();
  }

  setTextAreaFocused(): void {
    const textArea = this._remarks.nativeElement as HTMLTextAreaElement;

    textArea.setSelectionRange(
      this.ApptData.remarks.length,
      this.ApptData.remarks.length
    );
    textArea.focus();
  }

  OpenProfile() {
    let modelState = InitialModalState;
    modelState.initialState = {
      PatientID: this.ApptData.patient_id,
    };
    (modelState.class = 'modal-md'),
      this.http.OpenModal(PatientProfileComponent, modelState);
  }
  AddMedicine() {
    this.PatMed.date = getYMDDate();
    this.PatMed.appointment_id = this.ApptID;
    this.PatMed.patient_id = this.PatientData.patientid;
    this.PatMed.user_id = this.http.getUserData().doctor_id;

    this.http.postData('pat_medicine', this.PatMed).then((response) => {
      this.LoadMedicine();
      this.PatMed = {};
    });
  }
  AddLab() {
    this.PatLabTest.date = getYMDDate();
    this.PatLabTest.appointment_id = this.ApptID;
    this.PatLabTest.patient_id = this.PatientData.patientid;
    this.PatLabTest.doctor_id = this.http.getUserData().doctor_id;

    this.http.postData('pat_labtest', this.PatLabTest).then((response) => {
      this.LoadLab();

      this.PatMed = {};
    });
  }
  LoadMedicine() {
    this.http
      .getData('qrypat_med?filter=appointment_id = ' + this.ApptID)
      .then((r: any) => {
        this.ApptData.med = r;
      });
  }
  LoadLab() {
    this.http
      .getData(
        'qrypat_lab?flds=test_name,id&filter=appointment_id = ' + this.ApptID
      )
      .then((r: any) => {
        this.ApptData.lab = r;
      });
  }

  ActionClicked(e) {
    if (e.action === 'delete') {
      this.http.Delete('pat_medicine', e.data.id).then((r: any) => {
        this.LoadMedicine();
      });
    }
  }
  LabClicked(e) {
    console.log(e);
    if (e.action === 'delete') {
      this.http.Delete('pat_labtest', e.data.id).then((r: any) => {
        this.LoadLab();
      });
    }
  }

  SaveNotes(n = 0) {
    this.http
      .postData('appointments/' + this.ApptID, {
        remarks: this.ApptData.remarks,
        status: '2',
        next_date: JSON2Date(this.ApptData.next_date),
      })
      .then((r: any) => {
        this.bsModalRef.hide();
        if (n == 1) {
          window.open('/#/print/prescription/' + this.ApptID);
        }
      });
  }
  EditReg() {
    let modelState = InitialModalState;
    modelState.initialState = {
      RegNo: this.PatientData.regno,
    };
    console.log(modelState);

    this.modalService.show(AddPatientComponent, modelState);
    this.modalService.onHide.subscribe((reason: string) => {
      const _reason = reason ? `, dismissed by ${reason}` : '';
      this.LoadPatientData();
    });
  }

  Print() {
    this.SaveNotes(1);
  }

  AddItems(grp) {
    let modelState = InitialModalState;
    modelState.initialState = {
      group: grp,
    };
    console.log(modelState);

    this.modalService.show(ItemsListComponent, modelState);
    this.modalService.onHide.subscribe((reason: string) => {
      this.LoadItemsData();
    });
  }

  LoadItemsData() {
    this.http.getData('itemslist').then((data) => {
      this.ItemsGroups = groupby(data, 'group');
      console.log(this.ItemsGroups);
    });
  }
}
