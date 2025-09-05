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

  async onLoginClick() {

    console.log("Email", this.LoginForm.value.email);
    console.log("password", this.LoginForm.value.password);

    debugger
    if(this.LoginForm.value.email == ""){
     alert("reencha o email")
     return
    }

    if(this.LoginForm.value.password == ""){
    alert("preencha a senha")
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
      alert("aprovado")

    } else {
      alert("recusado")
    }
  }
};


