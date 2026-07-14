import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenLogin } from './token-login';

describe('TokenLogin', () => {
  let component: TokenLogin;
  let fixture: ComponentFixture<TokenLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
