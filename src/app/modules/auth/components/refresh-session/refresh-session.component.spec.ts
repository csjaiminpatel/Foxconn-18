import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshSessionComponent } from './refresh-session.component';

describe('RefreshSessionComponent', () => {
  let component: RefreshSessionComponent;
  let fixture: ComponentFixture<RefreshSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefreshSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefreshSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
