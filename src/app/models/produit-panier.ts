import { Produit } from './produit';

export class ProduitPanier {

    constructor() {
        this.produitModel = new Produit();
        this.montant = 0;
        this.prix = 0;
        this.quantite = 0;
        this.titre = 'titre';
        this.type = 'type';
    }

    produitModel: Produit;
    quantite: number;
    titre: string;
    type: string;
    prix: number;
    montant: number;
}
