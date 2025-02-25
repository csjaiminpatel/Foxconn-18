import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkEventsDialogComponent } from './link-events-dialog.component';

describe('LinkEventsDialogComponent', () => {
  let component: LinkEventsDialogComponent;
  let fixture: ComponentFixture<LinkEventsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkEventsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkEventsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
