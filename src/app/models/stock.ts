import { Produit } from './produit';

export class Stock {

    constructor(id = 0, quantite = 0) {
        this.id = id;
        this.quantite = quantite;
        this.produits = [];
    }

    id: number;
    quantite: number;
    produits: Produit[];
}
