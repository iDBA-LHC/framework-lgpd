import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiscoListComponent } from './risco-list.component';

describe('RiscoListComponent', () => {
  let component: RiscoListComponent;
  let fixture: ComponentFixture<RiscoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiscoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiscoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
