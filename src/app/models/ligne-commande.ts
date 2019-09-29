import { Commande } from './commande';
import { Produit } from './produit';

export class LigneCommande {

    constructor(id = 0, quantite = 0) {
        this.id = id;
        this.quantite = quantite;
        this.commande = new Commande();
        this.produit = new Produit();
    }

    id: number;
    quantite: number;
    commande: Commande;
    produit: Produit;
}

