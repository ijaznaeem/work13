import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierAcctsComponent } from './supplier-accts.component';

describe('SupplierAcctsComponent', () => {
  let component: SupplierAcctsComponent;
  let fixture: ComponentFixture<SupplierAcctsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierAcctsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierAcctsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
