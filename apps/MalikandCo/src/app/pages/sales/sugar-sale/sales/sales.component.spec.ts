import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { HttpBase } from '../../../../services/httpbase.service';
import { PrintBillService } from '../../../../services/print-bill.service';
import { PrintDataService } from '../../../../services/print.data.services';
import { MyToastService } from '../../../../services/toaster.server';
import { SalesComponent } from './sales.component';

describe('SalesComponent', () => {
  let component: SalesComponent;
  let fixture: ComponentFixture<SalesComponent>;
  let modalService: BsModalService;
  let printDataService: PrintDataService;
  let toastService: MyToastService;
  let printBillService: PrintBillService;
  let httpBase: HttpBase;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [BsModalService, PrintDataService, MyToastService, PrintBillService, HttpBase]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(BsModalService);
    printDataService = TestBed.inject(PrintDataService);
    toastService = TestBed.inject(MyToastService);
    printBillService = TestBed.inject(PrintBillService);
    httpBase = TestBed.inject(HttpBase);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default filter values', () => {
    expect(component.Filter.FromDate).toBeTruthy();
    expect(component.Filter.ToDate).toBeTruthy();
    expect(component.Filter.Balance).toBe('0');
    expect(component.Filter.RouteID).toBe('');
  });

  it('should call FilterData on ngOnInit', () => {
    spyOn(component, 'FilterData');
    component.ngOnInit();
    expect(component.FilterData).toHaveBeenCalled();
  });

  it('should open modal on AddSale', () => {
    spyOn(modalService, 'show').and.callThrough();
    component.AddSale();
    expect(modalService.show).toHaveBeenCalled();
  });

  it('should navigate to print report on PrintReport', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    component.PrintReport();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/print/print-html');
  });

  it('should fetch data on FilterData', async () => {
    spyOn(httpBase, 'getData').and.returnValue(Promise.resolve([]));
    await component.FilterData();
    expect(httpBase.getData).toHaveBeenCalledWith('qryinvoicedetails?filter=IsPosted = 0');
    expect(component.data).toEqual([]);
  })
});
