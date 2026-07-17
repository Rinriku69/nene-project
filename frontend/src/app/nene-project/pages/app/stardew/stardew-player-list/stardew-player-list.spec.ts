import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StardewPlayerList } from './stardew-player-list';

describe('StardewPlayerList', () => {
  let component: StardewPlayerList;
  let fixture: ComponentFixture<StardewPlayerList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StardewPlayerList],
    }).compileComponents();

    fixture = TestBed.createComponent(StardewPlayerList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
