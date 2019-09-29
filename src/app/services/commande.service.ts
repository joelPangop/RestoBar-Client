import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  URL_CMD_API = "http://localhost:4000/commande";
  URL_LDC_API = "http://localhost:4000/lignecommande";

  constructor(private http: HttpClient) { }

  getCmdByUserId(id: number) {
    const url = this.URL_CMD_API + "/" + id;
    return this.http.get(url);
  }

  getLdcBycmd(id: number){
    const url = this.URL_LDC_API + "?commande=" + id;
    return this.http.get(url);
  }
}
