import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetComponent } from './pet-component';

describe('PetComponent', () => {
  let component: PetComponent;
  let fixture: ComponentFixture<PetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PetComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
