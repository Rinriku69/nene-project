import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SakuraComponent } from './sakura-component';

describe('SakuraComponent', () => {
  let component: SakuraComponent;
  let fixture: ComponentFixture<SakuraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SakuraComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SakuraComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
