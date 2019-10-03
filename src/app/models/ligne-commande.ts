import { Commande } from './commande';
import { Produit } from './produit';
import {Table} from './table';
import { ProduitPanier } from './produit-panier';

export class LigneCommande {

    constructor() {
        this.quantite = 0;
        this.table = new Table();
    }

    id: number;
    produit: Produit;
    commande: Commande;
    table: Table;
    quantite: number;
}

