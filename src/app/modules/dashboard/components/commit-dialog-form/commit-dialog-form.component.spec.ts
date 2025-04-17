import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitDialogFormComponent } from './commit-dialog-form.component';

describe('CommitDialogFormComponent', () => {
  let component: CommitDialogFormComponent;
  let fixture: ComponentFixture<CommitDialogFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommitDialogFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommitDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
