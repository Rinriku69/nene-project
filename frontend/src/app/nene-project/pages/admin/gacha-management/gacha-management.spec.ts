import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GachaManagement } from './gacha-management';

describe('GachaManagement', () => {
  let component: GachaManagement;
  let fixture: ComponentFixture<GachaManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GachaManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(GachaManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
