import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadadosFormComponent } from './metadados-form.component';

describe('MetadadosFormComponent', () => {
  let component: MetadadosFormComponent;
  let fixture: ComponentFixture<MetadadosFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetadadosFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadadosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
