import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetAnimate } from './pet-animate';

describe('PetAnimate', () => {
  let component: PetAnimate;
  let fixture: ComponentFixture<PetAnimate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetAnimate],
    }).compileComponents();

    fixture = TestBed.createComponent(PetAnimate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
