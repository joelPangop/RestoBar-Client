import { Commande } from './commande';
import { Produit } from './produit';
import {Table} from './table';

export class LigneCommande {

    constructor() {
        this.quantite = 0;
        this.produit = new Produit();
        this.table = new Table();
    }

    id: number;
    quantite: number;
    commande: Commande;
    produit: Produit;
    table: Table
}

