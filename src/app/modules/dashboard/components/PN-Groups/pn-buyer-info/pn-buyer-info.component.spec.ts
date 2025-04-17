import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PnBuyerInfoComponent } from './pn-buyer-info.component';

describe('PnBuyerInfoComponent', () => {
  let component: PnBuyerInfoComponent;
  let fixture: ComponentFixture<PnBuyerInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PnBuyerInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PnBuyerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
