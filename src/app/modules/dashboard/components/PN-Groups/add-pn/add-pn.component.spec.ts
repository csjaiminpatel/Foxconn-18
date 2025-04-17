import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPnComponent } from './add-pn.component';

describe('AddPnComponent', () => {
  let component: AddPnComponent;
  let fixture: ComponentFixture<AddPnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
