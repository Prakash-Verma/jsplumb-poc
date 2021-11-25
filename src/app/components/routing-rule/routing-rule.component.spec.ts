import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingRuleComponent } from './routing-rule.component';

describe('RoutingRuleComponent', () => {
  let component: RoutingRuleComponent;
  let fixture: ComponentFixture<RoutingRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoutingRuleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutingRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
