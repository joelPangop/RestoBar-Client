import { Produit } from './produit';

export class ProduitPanier {

    constructor(quantite = 0, titre = '', type = '', noProduit = '', prix = 0, montant = 0) {
        this.produitModel = new Produit();
        this.montant = montant;
        this.noProduit = noProduit;
        this.prix = prix;
        this.quantite = quantite;
        this.titre = titre;
        this.type = type;
    }

    produitModel: Produit;
    quantite: number;
    titre: string;
    type: string;
    noProduit: string;
    prix: number;
    montant: number;
}
