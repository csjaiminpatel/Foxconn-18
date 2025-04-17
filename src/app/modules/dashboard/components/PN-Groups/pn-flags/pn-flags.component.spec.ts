import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PnFlagsComponent } from './pn-flags.component';

describe('PnFlagsComponent', () => {
  let component: PnFlagsComponent;
  let fixture: ComponentFixture<PnFlagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PnFlagsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PnFlagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
