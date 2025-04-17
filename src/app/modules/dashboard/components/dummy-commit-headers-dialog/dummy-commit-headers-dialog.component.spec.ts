import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyCommitHeadersDialogComponent } from './dummy-commit-headers-dialog.component';

describe('DummyCommitHeadersDialogComponent', () => {
  let component: DummyCommitHeadersDialogComponent;
  let fixture: ComponentFixture<DummyCommitHeadersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DummyCommitHeadersDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DummyCommitHeadersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
