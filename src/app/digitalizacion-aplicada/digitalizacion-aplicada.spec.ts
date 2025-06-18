import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalizacionAplicada } from './digitalizacion-aplicada';

describe('DigitalizacionAplicada', () => {
  let component: DigitalizacionAplicada;
  let fixture: ComponentFixture<DigitalizacionAplicada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalizacionAplicada]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalizacionAplicada);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
