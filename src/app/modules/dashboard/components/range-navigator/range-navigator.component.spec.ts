import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeNavigatorComponent } from './range-navigator.component';

describe('RangeNavigatorComponent', () => {
  let component: RangeNavigatorComponent;
  let fixture: ComponentFixture<RangeNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangeNavigatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RangeNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
