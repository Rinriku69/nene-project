import { Component, computed, Signal, signal } from '@angular/core';
import { form, FormField, minLength, required, validate } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormField],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  protected readonly formSubmitDisable: Signal<boolean> = computed(() => {
    if (this.registerForm().invalid() || this.registerForm.password_confirmation().invalid()) {
      return true
    }
    return false
  });

  private readonly registerModel = signal({
    nickname: '',
    username: '',
    password: '',
    password_confirmation: '',
  });
  protected readonly registerForm = form(this.registerModel, (path) => {
    required(path.nickname, { message: 'Nickname is required' });
    required(path.username, { message: 'Username is required' });
    required(path.password, { message: 'Password is required' });
    required(path.password_confirmation,{message:'Please confirm your password'})
    validate(path.password_confirmation, ({ value }) => {
      if (value() !== this.registerForm.password().value()) {
        return { kind: 'https', message: 'Confirm password not match' };
      }
      return null;
    });
    minLength(path.password, 8, { message: 'Password must have atleast 8 characters' });
  });
}
