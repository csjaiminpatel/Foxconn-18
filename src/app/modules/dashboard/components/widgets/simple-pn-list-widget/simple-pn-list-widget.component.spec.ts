import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplePnListWidgetComponent } from './simple-pn-list-widget.component';

describe('SimplePnListWidgetComponent', () => {
  let component: SimplePnListWidgetComponent;
  let fixture: ComponentFixture<SimplePnListWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimplePnListWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimplePnListWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
