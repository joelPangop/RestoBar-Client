import {Produit} from './produit';

export class ProduitAchat {

    constructor(){
        this.produit =new Produit();
        this.quantite = 0;
        this.montant = 0;
    }

    produit: Produit;
    quantite: number;
    montant: number;
}
