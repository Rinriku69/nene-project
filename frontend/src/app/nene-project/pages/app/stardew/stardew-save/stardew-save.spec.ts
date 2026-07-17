import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StardewSave } from './stardew-save';

describe('StardewSave', () => {
  let component: StardewSave;
  let fixture: ComponentFixture<StardewSave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StardewSave],
    }).compileComponents();

    fixture = TestBed.createComponent(StardewSave);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
