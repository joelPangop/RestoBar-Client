import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  URL = "http://localhost:4000/user"

  users: User[];
  selectedUser: User;

  constructor(private http: HttpClient) {
    this.users = [];
    this.selectedUser = new User();
  }


  getUsers() {
    return this.http.get(this.URL);
  }

  getUser(user: User) {
    return this.http.get(this.URL + `/${user.id}`)
  }

  createUser(user: User) {
    return this.http.post(this.URL, user);
  }

  updateUser(user: User){
    return this.http.put(this.URL+ `/${user.id}`, user);
  }

  deleteUser(user: User){
    return this.http.delete(this.URL+ `/${user.id}`);
  }
}
