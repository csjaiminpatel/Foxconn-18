import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PnGroupComponent } from './pn-group.component';

describe('PnGroupComponent', () => {
  let component: PnGroupComponent;
  let fixture: ComponentFixture<PnGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PnGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PnGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
