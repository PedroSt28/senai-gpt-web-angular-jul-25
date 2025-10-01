import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Type } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chat-screen.component.html',
  styleUrl: './chat-screen.component.css'
})
export class ChatScreenComponent { //constroi classes

  chats: IChat[];
  chatSelecionado: IChat;
  mensagens: Imessage[];
  mensagemUsuario = new FormControl("");//declarou e atribuiu o valor
  darkMode:boolean = false;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {  //poe a classe para funcionar
    //inicialização de variaveis
    this.chats = [];
    this.chatSelecionado = null!;      //null = vazio
    this.mensagens = [];

  }

  ngOnInit() {    //executado quando o Angular esta pronto para rodar. coisas novas 
    //Buscar dados da API(banco de dados)

    this.getChats();

    let darkModeLocalStorage = localStorage.getItem("darkMode");

    if(darkModeLocalStorage == "true"){

      this.darkMode = true;
      document.body.classList.toggle("dark-mode", this.darkMode)

    }

  }

  async getChats() {

    let response = await firstValueFrom(this.http.get("https://senai-gpt-api.azurewebsites.net/chats", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }

    })) as IChat[];

    if (response) {

      console.log("Chats", response);

      let userId = localStorage.getItem("meuId");

      response = response.filter(chat => chat.userId == userId);

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

    this.cd.detectChanges();

  }

  async enviarMensagem() {

    let novaMensagemUsuario = {

      chatId: this.chatSelecionado.id,
      userId: localStorage.getItem("meuId"),
      text: this.mensagemUsuario.value,

    };
    // 1-- Salva as mensagens do usuario no banco de dados
    let novaMensagemUsuarioResponse = await firstValueFrom(this.http.post("https://senai-gpt-api.azurewebsites.net/messages", novaMensagemUsuario, {   //post serve para mandar a mensagem 
      headers: {

        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("meuToken"),

      }

    }));
    //atualiza as mensagens da tela
    await this.onChatClick(this.chatSelecionado)

    // 2 -- Enviar a mensagem para a IA responder
    //Aestrutura o google que entregou!!!!!
    let respostaIAResponse = await firstValueFrom(this.http.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
      "contents": [
        {
          "parts": [
            {
              "text": this.mensagemUsuario.value + ". me de uma resposta ."
            }
          ]
        }
      ]
    }, {
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": "AIzaSyDV2HECQZLpWJrqCKEbuq7TT5QPKKdLOdo"
      }

    })) as any;

    let novaRespostaIA = {

      chatId: this.chatSelecionado.id,
      userId: "chatbot",
      text: respostaIAResponse.candidates[0].content.parts[0].text,

    }
    // 3-- salva a nova mensagem 
    let novaRespostaIAResponse = await firstValueFrom(this.http.post("https://senai-gpt-api.azurewebsites.net/messages", novaRespostaIA, {   //post serve para mandar a mensagem 
      headers: {

        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("meuToken"),

      }

    }));

    //atualiza as mensagens da tela
    await this.onChatClick(this.chatSelecionado);


    //limpa campo de mensagem
    this.mensagemUsuario.setValue("");
  }

  async novoChat() {
    const nomeChat = prompt("Digite o nome do novo chat");

    if (!nomeChat) {

      alert("Nome Invalido");
      return; //para a execução do metodo

    }

    const novoChatObj = {

      chatTitle: nomeChat,
      userId: localStorage.getItem("meuId"),

    }

    let novoChatResponse = await firstValueFrom(this.http.post("https://senai-gpt-api.azurewebsites.net/chats", novoChatObj, {
      headers: {
        "content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("meuToken")
      }

    })) as IChat;

    //ataliza os chats da tela
    await this.getChats();

    //abre chat recem criado
    await this.onChatClick(novoChatResponse);

  }

  async logOut() {

    localStorage.clear();
    window.location.reload()

  }

  async deletarcChatSelecionado() {

    let confirmation = confirm("Deseja realmente apagar o chat " + this.chatSelecionado.chatTitle + "?")

    if (!confirmation) {

      return

    }

    try {


      let deleteResponse = await firstValueFrom(this.http.delete("https://senai-gpt-api.azurewebsites.net/chats/" + this.chatSelecionado.id, {
        headers: {
          "content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("meuToken")
        }

      })) as IChat;
    } catch (error) {

      console.log("Erro no delete: " + error);

    }

    //atualiza chats no menu lateral
    await this.getChats();

    //remove o chat clicado limpando da tela 
    this.chatSelecionado = null!;

    //força a atualização da tela
    this.cd.detectChanges();

  }

  ligarDesligarDarkMode(){

  this.darkMode = !this.darkMode; //!inverso de this.darkmode

  document.body.classList.toggle("dark-mode", this.darkMode);

  localStorage.setItem("darkMode", this.darkMode.toString());



  }

}

