import { Injectable } from '@angular/core';
import { Fournisseur } from '../models/fournisseur';
import { Adresse } from '../models/adresse';
import { HttpClient } from '@angular/common/http';
import { ProduitService } from './produit.service';
import { Telephone } from '../models/telephone';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {

  readonly URL_API = 'http://localhost:4000/fournisseur';
  selectedFournisseur: Fournisseur;
  adresse: Adresse = new Adresse();
  fournisseurs: Fournisseur[];
  telephones: Telephone[];

  constructor(private http: HttpClient, private produitService: ProduitService) {
    this.adresse = new Adresse();
    this.fournisseurs = [];
    this.selectedFournisseur = new Fournisseur();
    this.telephones = [];
  }

  getfournisseurs() {
    return this.http.get(this.URL_API);
  }

  getfournisseur(fournisseur: Fournisseur) {
    return this.http.get(this.URL_API + `/${fournisseur.id}`);
  }

  createFournisseur(fournisseur: Fournisseur) {
    return this.http.post(this.URL_API + "?adresse=" + JSON.stringify(this.adresse) + "&produits=" + JSON.stringify(this.selectedFournisseur.produits), fournisseur);
  }

  updateFournisseur(fournisseur: Fournisseur) {
    return this.http.put(this.URL_API + `/${fournisseur.id}` + "?adresse=" + JSON.stringify(this.adresse) + "&produits=" + JSON.stringify(this.selectedFournisseur.produits), fournisseur)
  }

  deleteFournisseur(fournisseur: Fournisseur) {
    return this.http.delete(this.URL_API + `/${fournisseur.id}`);
  }
}
