import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamsInputWidgetComponent } from './params-input-widget.component';

describe('ParamsInputWidgetComponent', () => {
  let component: ParamsInputWidgetComponent;
  let fixture: ComponentFixture<ParamsInputWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParamsInputWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParamsInputWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
