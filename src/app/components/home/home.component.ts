import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CURRENT_USER, ROOM_NAME } from '../../models/constants';
import { UserService } from '../../services/user.service';
import { LogoutModel } from '../../models/logoutModel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  public username!: string;
  public bestScore = 0;
  public score = 0;
  constructor(protected userService: UserService, private router: Router) {

  }
  ngOnInit(): void {
    this.username = sessionStorage.getItem(CURRENT_USER)!;
  }
  public logout() {
    const roomName = sessionStorage.getItem(ROOM_NAME)!;
    const body: LogoutModel = {
      username: this.username,
      roomName: roomName,
      score: this.score
    };
    this.userService.logout(body).subscribe(() => {
      sessionStorage.removeItem(this.username);
      sessionStorage.removeItem(roomName);
      this.router.navigate(['/login']);
    });
  }
}
