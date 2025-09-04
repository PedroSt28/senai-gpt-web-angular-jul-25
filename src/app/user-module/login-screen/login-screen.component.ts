import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-screen',
  imports: [ReactiveFormsModule],
  templateUrl: './login-screen.component.html',
  styleUrl: './login-screen.component.css'
})
export class LoginScreenComponent {

  LoginForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.LoginForm = this.fb.group({
      email: ["", [Validators.required]],//*inica o formulario, cria o campo obrigatorio de preenchimento ou seja nao pode entrar sem digitar *
      password: ["", [Validators.required]],
    });

  }
  
  onLoginClick() {

    alert("botao de login clicado");

    console.log("Email", this.LoginForm.value.email)
    console.log("password", this.LoginForm.value.password);
    
  }
}
