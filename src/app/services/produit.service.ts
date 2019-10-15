import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Produit} from '../models/produit';

@Injectable({
    providedIn: 'root'
})
export class ProduitService {

    URL_API = 'http://localhost:4000/produit';
    public produits: Produit[];
    public produit: Produit;

    constructor(private http: HttpClient) {
        this.produits = [];
        this.produit = new Produit();
    }

    getProduitById(id: number) {
        const url = this.URL_API + '/' + id;
        return this.http.get(url);
    }

    getAll() {
        return this.http.get(this.URL_API);
    }

    createProduit(produit: Produit) {
        return this.http.post(this.URL_API, produit);
    }

     editProduit(produit: Produit) {
        return this.http.put(this.URL_API + `/${produit.id}`, produit);
    }

    deleteProduit(produit: Produit) {
        return this.http.delete(this.URL_API + "?produit="+JSON.stringify(produit));
    }
}
