import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOptions } from './dialog-options';

describe('DialogOptions', () => {
  let component: DialogOptions;
  let fixture: ComponentFixture<DialogOptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogOptions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogOptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
