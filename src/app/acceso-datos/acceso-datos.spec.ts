import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesoDatos } from './acceso-datos';

describe('AccesoDatos', () => {
  let component: AccesoDatos;
  let fixture: ComponentFixture<AccesoDatos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccesoDatos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccesoDatos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
