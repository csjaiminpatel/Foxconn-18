import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitHistoryComponent } from './commit-history.component';

describe('CommitHistoryComponent', () => {
  let component: CommitHistoryComponent;
  let fixture: ComponentFixture<CommitHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommitHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommitHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
