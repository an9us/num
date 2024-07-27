import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Hpolo011Component } from './hpolo011.component';

describe('Hpolo011Component', () => {
  let component: Hpolo011Component;
  let fixture: ComponentFixture<Hpolo011Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Hpolo011Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Hpolo011Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
