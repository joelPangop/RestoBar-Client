import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Produit} from '../models/produit';

@Injectable({
    providedIn: 'root'
})
export class ProduitService {

    URL_API = 'http://localhost:4000/produit';
    public produits: Produit[];

    constructor(private http: HttpClient) {
        this.produits = [];
    }

    getProduitById(id: number) {
        const url = this.URL_API + '/' + id;
        return this.http.get(url);
    }

    getAll(){
        return this.http.get(this.URL_API);
    }
}
