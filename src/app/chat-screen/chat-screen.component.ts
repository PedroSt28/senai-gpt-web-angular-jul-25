import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';

interface IChat {

chatTitle: string;
id: Number;
userId: string;

}

@Component({
  selector: 'app-chat-screen',
  imports: [HttpClientModule, CommonModule],
  templateUrl: './chat-screen.component.html',
  styleUrl: './chat-screen.component.css'
})
export class ChatScreenComponent {

  chats : IChat[];

  constructor(private http: HttpClient) {   //constroi classes
    //inicialização de variaveis
    this.chats = []

  }

  ngOnInit() {    //executado quando o Angular esta pronto para rodar. coisas novas 
    //Buscar dados da API(banco de dados)

    this.getChats();

  }

  async getChats() {
    //metodo que busca os chats na API
    let response = await this.http.get("https://senai-gpt-api.azurewebsites.net/chats", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("meuToken")

      }
    }).toPromise();

    console.log("Chats", response);

    if (response) {

      this.chats = response as [] ;
    }else{

      console.log ("erro ao buscar os chats")
    }

  }

}
