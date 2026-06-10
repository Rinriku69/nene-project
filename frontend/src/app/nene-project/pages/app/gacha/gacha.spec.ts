import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gacha } from './gacha';

describe('Gacha', () => {
  let component: Gacha;
  let fixture: ComponentFixture<Gacha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gacha],
    }).compileComponents();

    fixture = TestBed.createComponent(Gacha);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
