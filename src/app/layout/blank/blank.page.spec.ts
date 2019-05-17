import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlankPage } from './blank.page';

describe('BlankPage', () => {
  let component: BlankPage;
  let fixture: ComponentFixture<BlankPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlankPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlankPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
