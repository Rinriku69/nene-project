import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Townfolk } from './townfolk';

describe('Townfolk', () => {
  let component: Townfolk;
  let fixture: ComponentFixture<Townfolk>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Townfolk],
    }).compileComponents();

    fixture = TestBed.createComponent(Townfolk);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
