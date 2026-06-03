import { Component, signal, WritableSignal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { LoginModel } from '../../../models/AuthModel';

@Component({
  selector: 'app-login',
  imports: [RouterLink,FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly loginModel:WritableSignal<LoginModel> = signal({
    username:'',
    password:''
  })

  protected readonly loginForm = form(this.loginModel,(path)=>{
    required(path.username,{message:'Username is required'});
    required(path.password,{message:'Password is required'})
  })

}
