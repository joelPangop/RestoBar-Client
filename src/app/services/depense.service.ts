import {Injectable} from '@angular/core';
import {Fournisseur} from '../models/fournisseur';
import {Depense} from '../models/depense';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class DepenseService {
    readonly URL_API = 'http://localhost:4000/depense';
    selectedDepense: Depense;
    fournisseurs: Fournisseur[];
    depenses: Depense[];

    constructor(private http: HttpClient) {
        this.selectedDepense = new Depense();
        this.depenses = [];
        this.fournisseurs = [];
    }

    getDepenses(typedepense: string) {
        return this.http.get(this.URL_API + `/${typedepense}`);
    }

    getDepense(depense: Depense, typedepense: string) {
        return this.http.get(this.URL_API + `/${typedepense}` + `/${depense.id}`);
    }

    createDepense(depense: Depense) {
        return this.http.post(this.URL_API + '?fournisseur=' + JSON.stringify(depense.fournisseur) + '?produits='+JSON.stringify(depense.produitAchats), depense);
    }

    updateDepense(depense: Depense, typedepense: string) {
        return this.http.put(this.URL_API + `/${typedepense}`+ `/${depense.id}` + '?fournisseur=' + JSON.stringify(this.fournisseurs)+ '?produits='+JSON.stringify(depense.produitAchats), depense);
    }

    deleteDepense(typedepense: string, depense: Depense) {
        return this.http.delete(this.URL_API + `/${typedepense}` + `/${depense.id}`);
    }
}