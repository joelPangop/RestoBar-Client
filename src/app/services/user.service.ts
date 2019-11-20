import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Adresse } from '../models/adresse';
import { Telephone } from '../models/telephone';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  URL = "http://localhost:4000/user"

  users: User[];
  selectedUser: User;
  adresse: Adresse;
  telephones: Telephone[];

  constructor(private http: HttpClient) {
    this.users = [];
    this.selectedUser = new User();
    this.adresse = new Adresse();
    this.telephones = [];
    this.telephones.push(new Telephone());
  }


  getUsers() {
    return this.http.get(this.URL);
  }

  getUser(id) {
    return this.http.get(this.URL + `/${id}`)
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
