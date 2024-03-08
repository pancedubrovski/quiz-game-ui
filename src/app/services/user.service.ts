import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { environment } from '../../environments/environments';
import { GameModel } from '../models/gameModel';
import { LogoutModel } from '../models/logoutModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {

  }


  public registerUser(user: User) {
    return this.http.post<GameModel>(`${environment.apiUrl}api/user/register`, user);
  }

  public login(user: User) {
    return this.http.post<GameModel>(`${environment.apiUrl}api/user/login`, user);
  }
  
  public logout(logoutModel: LogoutModel) {
    return this.http.post(`${environment.apiUrl}api/user/logout`, logoutModel);
  }
}
