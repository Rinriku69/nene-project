import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemViewComponent } from './item-view-component';

describe('ItemViewComponent', () => {
  let component: ItemViewComponent;
  let fixture: ComponentFixture<ItemViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemViewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
