import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Commande } from '../models/commande';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  URL_CMD_API = "http://localhost:4000/commande";
  URL_LDC_API = "http://localhost:4000/lignecommande";

  commandes: Commande[];

  constructor(private http: HttpClient) {
    this.commandes = [];
  }

  getAll() {
    return this.http.get(this.URL_CMD_API);
  }

  getCmdByUserId(id: number) {
    const url = this.URL_CMD_API + "/" + id;
    return this.http.get(url);
  }

  getLdcBycmd(id: number) {
    const url = this.URL_LDC_API + "?commande=" + id;
    return this.http.get(url);
  }

  getByTime(startTime, endTime) {
    return this.http.get(this.URL_CMD_API+"/time" + `?startTime=` + JSON.stringify(startTime) + "&endTime=" + JSON.stringify(endTime));
  }

}
