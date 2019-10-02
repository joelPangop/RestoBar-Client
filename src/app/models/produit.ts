import { LigneCommande } from './ligne-commande';

export class Produit {

    constructor(id = 0, nomProduit = '', description = '', quantite = 0, prix = 0, type = '') {
        this.id = id;
        this.nomProduit = nomProduit;
        this.description = description;
        this.quantite = quantite;
        this.prix = prix;
        this.type = type;
    }

    id: number;
    nomProduit: string;
    description: string;
    type: string;
    quantite: number;
    prix: number;
}
