import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../../environments/environments';
import { AnswerQuestion } from '../models/answerQuestion';
import { ChangeQuestion } from '../models/changeQuestion';
import { ADD_USER_DATA, ANSWER_QUESTION_EVENT, NEXT_QUESTION, ONLINE_USERS, ON_ANSWER_QUESTION_EVENT, START_GAME, USER_CONNECTED } from '../models/constants';
import { HttpClient } from '@angular/common/http';
import { GameModel } from '../models/gameModel';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  private gameConnection?: HubConnection;
  

  public startGame: EventEmitter<any> = new EventEmitter<any>();
  public nextQuestion: EventEmitter<any> = new EventEmitter<any>();
  public changeQuestion: EventEmitter<any> = new EventEmitter<any>();


  constructor(private http: HttpClient) { }
  public onlineUsers = [];

  
  createGameConnection(gameModel: GameModel){
    this.gameConnection = new HubConnectionBuilder()
    .withUrl(`${environment.apiUrl}hubs/game`).withAutomaticReconnect().build();
    
    this.gameConnection.start();
    this.gameConnection.on(USER_CONNECTED, () => {
      this.addUserConncetedId(gameModel);
    });


    this.gameConnection.on(ONLINE_USERS, (onlineUsers) => {
      if(!onlineUsers)
        return;
      this.onlineUsers = onlineUsers;
    });


    this.gameConnection.on(NEXT_QUESTION, (question) => {
      
     this.nextQuestion.emit(question);
    });
    this.gameConnection.on(ON_ANSWER_QUESTION_EVENT, (changeQuestion: ChangeQuestion) => {
     this.changeQuestion.emit(changeQuestion);
    });
  }

  async addUserConncetedId(gameModel: GameModel){
    return await this.gameConnection?.invoke(ADD_USER_DATA,gameModel)
    .catch(error => console.log(error));
  }

  public async invokeAnwerQuestion(answerQustion: AnswerQuestion){
    return await this.gameConnection?.invoke(ANSWER_QUESTION_EVENT,answerQustion)
    .catch(error => console.log(error));
  }
  stopGameConnection(){
    this.gameConnection?.stop().catch(error => console.log(error));
  }
  
}


