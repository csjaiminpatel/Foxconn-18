import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterCommitsWidgetComponent } from './filter-commits-widget.component';

describe('FilterCommitsWidgetComponent', () => {
  let component: FilterCommitsWidgetComponent;
  let fixture: ComponentFixture<FilterCommitsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterCommitsWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterCommitsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
