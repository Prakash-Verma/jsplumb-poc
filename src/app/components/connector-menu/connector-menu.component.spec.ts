import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorMenuComponent } from './connector-menu.component';

describe('ConnectorMenuComponent', () => {
  let component: ConnectorMenuComponent;
  let fixture: ComponentFixture<ConnectorMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectorMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
