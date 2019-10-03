import { Produit } from './produit';

export class ProduitPanier {

    constructor(produit: Produit) {
        this.produit = produit;
        this.montant = 0;
        this.quantite = 0;
    }
    produit: Produit;
    quantite: number;
    montant: number;
}
