import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemResultComponent } from './item-result-component';

describe('ItemResultComponent', () => {
  let component: ItemResultComponent;
  let fixture: ComponentFixture<ItemResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemResultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemResultComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
