import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitDocumentsComponent } from './commit-documents.component';

describe('CommitDocumentsComponent', () => {
  let component: CommitDocumentsComponent;
  let fixture: ComponentFixture<CommitDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommitDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommitDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
