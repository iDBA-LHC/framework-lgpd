import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiscoFormComponent } from './risco-form.component';

describe('RiscoFormComponent', () => {
  let component: RiscoFormComponent;
  let fixture: ComponentFixture<RiscoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiscoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiscoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
