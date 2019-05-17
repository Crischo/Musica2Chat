import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiembrosSalaPage } from './miembros-sala.page';

describe('MiembrosSalaPage', () => {
  let component: MiembrosSalaPage;
  let fixture: ComponentFixture<MiembrosSalaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiembrosSalaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiembrosSalaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
