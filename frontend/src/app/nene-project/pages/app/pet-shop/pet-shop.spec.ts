import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetShop } from './pet-shop';

describe('PetShop', () => {
  let component: PetShop;
  let fixture: ComponentFixture<PetShop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetShop],
    }).compileComponents();

    fixture = TestBed.createComponent(PetShop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
