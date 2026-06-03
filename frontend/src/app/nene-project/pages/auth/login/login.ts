import { Component, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink,FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly loginModel = signal({
    username:'',
    password:''
  })

  protected readonly loginForm = form(this.loginModel,(path)=>{
    required(path.username,{message:'Username is required'});
    required(path.password,{message:'Password is required'})
  })

}
