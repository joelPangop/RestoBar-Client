import { Commande } from './commande';
import { Produit } from './produit';
import {Table} from './table';
import { ProduitPanier } from './produit-panier';

export class LigneCommande {

    constructor() {
        this.quantite = 0;
    }

    id: number;
    produit: Produit;
    commande: Commande;
    quantite: number;
}

