import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeZone } from './safe-zone';

describe('SafeZone', () => {
  let component: SafeZone;
  let fixture: ComponentFixture<SafeZone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafeZone],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeZone);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
