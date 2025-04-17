import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDashboardFormComponent } from './add-edit-dashboard-form.component';

describe('AddEditDashboardFormComponent', () => {
  let component: AddEditDashboardFormComponent;
  let fixture: ComponentFixture<AddEditDashboardFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditDashboardFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditDashboardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
