import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Params, Router } from '@angular/router';
import { CURRENT_USER, ROOM_NAME } from '../../models/constants';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { GameModel } from '../../models/startGame';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  public form!: FormGroup;

  public error: any;
  public isRegister: boolean = false;

  constructor(protected userService: UserService, private router: Router) {

  }
  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
      confirmPassword: new FormControl('')
    });
  }
  public login() {
    if(this.isRegister){
      this.isRegister = false;
      return; 
    }
    const body: User = {
      username: this.form.controls['username'].value,
      password: this.form.controls['password'].value
    }
    this.userService.login(body).subscribe((gameModel: any) => {
      this.setDataToSession(gameModel.result);
    },error => {
      this.error = error.error;
    });
  }

  public register() {
    if(!this.isRegister){
      this.isRegister = true;
      return;
    }
    if(this.form.controls['confirmPassword'].value !== this.form.controls['password'].value){
      this.error = 'passwords did not match';
      return;
    }
    const body: User = {
      username: this.form.controls['username'].value,
      password: this.form.controls['password'].value
                                    
    }
    this.userService.registerUser(body).subscribe((gameModel: GameModel) => {
      this.setDataToSession(gameModel);
    },error => {
      this.error = error.error;
    });
  }
  public setDataToSession(gameModel: GameModel){
    sessionStorage.setItem(CURRENT_USER, gameModel.username);
    sessionStorage.setItem(ROOM_NAME, gameModel.roomName);
    const queryParams: Params = { gameStatus: gameModel.gameStatus };
    this.router.navigate(['/'],{ queryParams });
  }
}
