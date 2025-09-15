import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-user-screen-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-user-screen.component.html',
  styleUrl: './new-user-screen.component.css'
})

export class NewScreenComponent {


  emailErrorMensage: String;
  passwordErrorMessege: String;
  congratulations: String;
  incorrect: String;
  name: string
  confirmPass: string


  NewForm: FormGroup;

  constructor(private fb: FormBuilder,) {
    this.NewForm = this.fb.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required]],//*inica o formulario, cria o campo obrigatorio de preenchimento ou seja nao pode entrar sem digitar *
      password: ["", [Validators.required]],
      confirmPass: ["", [Validators.required]]


    });

    this.emailErrorMensage = "";
    this.passwordErrorMessege = "";
    this.congratulations = "";
    this.incorrect = "";
    this.name = "";
    this.confirmPass = "";

  }

  async onEnterClick() {

    this.emailErrorMensage = "";
    this.passwordErrorMessege = "";
    this.incorrect = "";
    this.congratulations = "";
    this.name = "";
    this.confirmPass = "";

    console.log("nome", this.NewForm.value.name);
    console.log("Email", this.NewForm.value.email);
    console.log("password", this.NewForm.value.password);
    console.log("confirmPass", this.NewForm.value.confirmPass);
      
      if (this.NewForm.value.name == "") {
        
        this.name = "o campo de nome é obrigatorio";
        return
        
      }
      
      if (this.NewForm.value.email == "") {
        
        this.emailErrorMensage = "O campo de email é obrigatorio";
        return
      }
      
      if (this.NewForm.value.password == "") {
        this.passwordErrorMessege = "Campo de senha obrigatorio";
        return
      }

      if (this.NewForm.value.confirmPass == ""   || this.NewForm.value.confirmPass != this.NewForm.value.password) {
      
        this.confirmPass = "senha incorreta ou nao aplicada"
        return
        
      }
      
    let response = await fetch("https://senai-gpt-api.azurewebsites.net/users", {

      method: "POST",//enviar
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({

        nome: this.NewForm.value.nome,
        email: this.NewForm.value.email,
        password: this.NewForm.value.password,
        confirmPass: this.NewForm.value.confirmPass,

      })

    });

    console.log("STATUS CODE", response.status)


    if (response.status >= 200 && response.status <= 299) {

       window.location.href = "login";
       this.congratulations = "Tudo certo, prossiga"
       

    }else{
      this.incorrect = "Credenciais incorretas";
    }

  }

};
