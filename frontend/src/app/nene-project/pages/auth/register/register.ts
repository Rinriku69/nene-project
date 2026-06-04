import { Component, computed, effect, inject, Signal, signal, WritableSignal } from '@angular/core';
import { debounce, email, form, FormField, minLength, required, validate } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { RegisterModel } from '../../../models/AuthModel';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormField],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly authService = inject(AuthService);
  protected readonly formSubmitDisable: Signal<boolean> = computed(() => {
    if (this.registerForm().invalid() || this.registerForm.password_confirmation().invalid()) {
      return true
    }
    return false
  });

  private readonly registerModel:WritableSignal<RegisterModel> = signal({
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
  });
  protected readonly registerForm = form(this.registerModel, (path) => {
    debounce(path.email,500);
    email(path.email,{message:'Please enter valid email'});
    required(path.email, { message: 'Email is required' });
    required(path.username, { message: 'Username is required' });
    required(path.password, { message: 'Password is required' });
    required(path.password_confirmation,{message:'Please confirm your password'})
    validate(path.password_confirmation, ({ value }) => {
      if (value() !== null && value() !== this.registerForm.password().value()) {
        return { kind: 'https', message: 'Confirm password not match' };
      }
      return null;
    });
    minLength(path.password, 8, { message: 'Password must have atleast 8 characters' });
  });

  /* constructor(){
    effect(()=>{
      console.log(this.registerForm.password_confirmation().errors())
    })
  } */

  protected submit(){
    if(this.registerForm().invalid()){
      console.log("register form invalid")
      return
    }

    this.authService.getCSRFToken().subscribe({
      next:()=>{
        this.authService.register(this.registerForm().value()).subscribe({
          next: (response) => {
            console.log(response)
          },
          error: (error) =>{
            console.error(error.error.message)
          }
        })
      },
      error:(err)=>{
        console.log("Failed to get CSRF Token")
        console.log(err)
      }
    })
  }
}
