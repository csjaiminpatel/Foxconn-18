import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPnListWidgetComponent } from './search-pn-list-widget.component';

describe('SearchPnListWidgetComponent', () => {
  let component: SearchPnListWidgetComponent;
  let fixture: ComponentFixture<SearchPnListWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPnListWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPnListWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
