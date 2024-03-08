import { Component, Input } from '@angular/core';
import { Question } from '../../models/question';
import { GameService } from '../../services/game.service';
import { CURRENT_USER, ROOM_NAME } from '../../models/constants';
import { QuestionStatus } from '../../models/questionStatus';
import { ChangeQuestion } from '../../models/changeQuestion';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

interface inputAnswer {
  questionId: number;
  isCorrected?: boolean;
  isBonusQuestion: boolean;
}

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {


  public roomName = '';
  public username = '';
  public myAnswer!: string;
  public dataSource: Array<Question> = [];
  public displayedColumns = ['position', 'expresion', 'answer', 'result'];
  public gameStatus: string = "";
  public waitngPlayers = true;
  public score = 0;
  public answerControll: FormControl = new FormControl('');



  constructor(public gameService: GameService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.gameStatus = params['gameStatus']
      if (this.gameStatus === 'StartGame' || this.gameStatus === 'Started') {
        this.waitngPlayers = false;
      }
    });
  }
  ngOnInit(): void {

    this.getUsername();


    this.onNextQuestion();

    this.onChangeQuestion();


  }

  public onNextQuestion() {
    this.gameService.nextQuestion.subscribe((model: Question) => {
      this.waitngPlayers = false;
      if (this.dataSource.find(e => e.questionId == model.questionId)) {
        return;
      }
      this.dataSource.push(model);
      this.dataSource = this.dataSource.map((e, index) => {
        e.index = index + 1;
        return e;
      });
    });
  }
  public onChangeQuestion() {
    this.gameService.changeQuestion.subscribe((submitedAnswer: ChangeQuestion) => {

      let question = this.dataSource.find(e => submitedAnswer.questionId === e.questionId)!;

      if (submitedAnswer.username == this.username) {
        question.status = submitedAnswer.result ? QuestionStatus.Success : QuestionStatus.Failed;
        question.result = submitedAnswer.result ? 'Ok' : 'Failed';
        question.answer = this.myAnswer;
        if (submitedAnswer.result) {
          this.score += 1;
        }
        return;
      }
      if (question.status != QuestionStatus.Failed) {
        question.status = QuestionStatus.Failed;
        question.result = 'Failed';
        question.answer = 'Missed';
      }
    });
  }


  private getUsername() {
    this.username = sessionStorage.getItem(CURRENT_USER)!;
    this.roomName = sessionStorage.getItem(ROOM_NAME)!;
    this.gameService.createGameConnection({
      username: this.username,
      roomName: this.roomName,
      gameStatus: this.gameStatus
    });
  }


  public answerQustion(input: inputAnswer) {
    const result = input.isBonusQuestion ? this.answerControll.value : input.isCorrected;
    this.gameService.invokeAnwerQuestion({
      questionId: input.questionId,
      result: String(result),
      username: this.username,
      roomName: this.roomName
    });
    this.myAnswer = input.isBonusQuestion ? this.answerControll.value : (input.isCorrected ? 'Yes' : 'No');
  }


  public checkStatus(questionId: number) {
    return this.dataSource.find(e => questionId === e.questionId)?.status === QuestionStatus.Current;
  }
}