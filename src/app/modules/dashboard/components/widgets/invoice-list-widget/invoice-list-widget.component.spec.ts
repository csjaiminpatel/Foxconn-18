import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceListWidgetComponent } from './invoice-list-widget.component';

describe('InvoiceListWidgetComponent', () => {
  let component: InvoiceListWidgetComponent;
  let fixture: ComponentFixture<InvoiceListWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceListWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceListWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
