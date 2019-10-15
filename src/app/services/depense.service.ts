import { Injectable } from '@angular/core';
import {Fournisseur} from '../models/fournisseur';
import {Adresse} from '../models/adresse';
import {Depense} from '../models/depense';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepenseService {
  readonly URL_API = 'http://localhost:4000/depense';
  selectedDepense: Depense;
  fournisseur: Fournisseur;
  depenses: Depense[];
  constructor(private http: HttpClient) {
    this.selectedDepense = new Depense();
    this.depenses = [];
    this.fournisseur = new Fournisseur();
  }

  getDepenses(){
    return this.http.get(this.URL_API);
  }

  getDepense(depense: Depense){
    return this.http.get(this.URL_API+`/${depense.id}`);
  }

  createDepense(depense: Depense){
    return this.http.post(this.URL_API+"?fournisseur="+JSON.stringify(this.fournisseur), depense);
  }

  updateDepense(depense: Depense){
    return this.http.put(this.URL_API+`/${depense.id}`+"?fournisseur="+JSON.stringify(this.fournisseur), depense)
  }

  deleteDepense(depense: Depense){
    return this.http.delete(this.URL_API+`/${depense.id}`);
  }
}
