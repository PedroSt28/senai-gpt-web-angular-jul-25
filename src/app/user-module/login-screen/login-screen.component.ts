import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-screen',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-screen.component.html',
  styleUrl: './login-screen.component.css'
})

export class LoginScreenComponent {

  emailErrorMensage: String;
  passwordErrorMessege: String;
  congratulations: String;
  incorrect: String;
  mostrarDiv : boolean;

  LoginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.LoginForm = this.fb.group({
      email: ["", [Validators.required]],//*inica o formulario, cria o campo obrigatorio de preenchimento ou seja nao pode entrar sem digitar *
      password: ["", [Validators.required]],

    });

    this.emailErrorMensage = "";
    this.passwordErrorMessege = "";
    this.congratulations = "";
    this.incorrect = "";
    this.mostrarDiv = true;

  }

  async onLoginClick() {

    this.emailErrorMensage = "";
    this.passwordErrorMessege = "";
    this.incorrect = "";
    this.congratulations = "";

    console.log("Email", this.LoginForm.value.email);
    console.log("password", this.LoginForm.value.password);


    if (this.LoginForm.value.email == "") {

      this.emailErrorMensage = "O canmpo de email é obrigatorio";
      return
    }

    if (this.LoginForm.value.password == "") {
      this.passwordErrorMessege = "Campo de senha obrigatorio";
      return
    }


    let response = await fetch("https://senai-gpt-api.azurewebsites.net/login", {

      method: "POST",//enviar
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({

        email: this.LoginForm.value.email,
        password: this.LoginForm.value.password

      })
    });

    console.log("STATUS CODE", response.status)



    if (response.status >= 200 && response.status <= 299) {

      this.congratulations = "Login realizado com sucesso ";

    } else {
      this.incorrect = "Credenciais incorretas";
    }
  }
};


