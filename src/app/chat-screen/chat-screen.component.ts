import { CommonModule } from '@angular/common';
import { HttpClient} from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface IChat {

  chatTitle: string;
  id: Number;
  userId: string;

}

interface Imessage {

  chatId: number;
  id: number;
  text: string;
  userId: string;

}

@Component({
  selector: 'app-chat-screen',
  imports: [CommonModule],
  templateUrl: './chat-screen.component.html',
  styleUrl: './chat-screen.component.css'
})
export class ChatScreenComponent { //constroi classes

  chats: IChat[];
  chatSelecionado: IChat;
  mensagens: Imessage[];

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {  //poe a classe para funcionar
    //inicialização de variaveis
    this.chats = [];
    this.chatSelecionado = null!;      //null = vazio
    this.mensagens = [];

  }

  ngOnInit() {    //executado quando o Angular esta pronto para rodar. coisas novas 
    //Buscar dados da API(banco de dados)

    this.getChats();

  }

  async getChats() {

    let response = await firstValueFrom(this.http.get("https://senai-gpt-api.azurewebsites.net/chats", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }

    }))

    if (response) {

      console.log("Chats", response);
      this.chats = response as [];

    } else {

      console.log("erro ao buscar os chats")
    }

  }

  async onChatClick(chatClicado: IChat) {

    console.log("Chat Clicado"), chatClicado

    this.chatSelecionado = chatClicado;

    //Logica para buscar as mensagens.

    let response = await firstValueFrom(this.http.get("https://senai-gpt-api.azurewebsites.net/messages?chatId=" + chatClicado.id, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("meuToken")

      }

    }));
    console.log("MENSAGENS", response);

    this.mensagens = response as Imessage[];

  }

}



