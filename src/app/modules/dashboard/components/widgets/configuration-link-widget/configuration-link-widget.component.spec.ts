import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationLinkWidgetComponent } from './configuration-link-widget.component';

describe('ConfigurationLinkWidgetComponent', () => {
  let component: ConfigurationLinkWidgetComponent;
  let fixture: ComponentFixture<ConfigurationLinkWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationLinkWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationLinkWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
