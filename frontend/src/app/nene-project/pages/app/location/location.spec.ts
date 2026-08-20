import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Location } from './location';

describe('Location', () => {
  let component: Location;
  let fixture: ComponentFixture<Location>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Location],
    }).compileComponents();

    fixture = TestBed.createComponent(Location);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
