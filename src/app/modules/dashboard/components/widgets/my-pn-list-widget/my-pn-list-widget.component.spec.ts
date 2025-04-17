import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPnListWidgetComponent } from './my-pn-list-widget.component';

describe('MyPnListWidgetComponent', () => {
  let component: MyPnListWidgetComponent;
  let fixture: ComponentFixture<MyPnListWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPnListWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPnListWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
