import { LigneCommande } from './ligne-commande';
import { Table } from './table';

export class Commande {

    constructor() {
        this.numCmd = 0;
        this.montant = 0;
        this.complete = false;
        this.dateLivraison = new Date();
        this.ligneCommandes = [];
        this.table = new Table();
    }

    id: number;
    numCmd: number;
    montant: number;
    complete: boolean;
    dateLivraison: Date;
    ligneCommandes: LigneCommande[];
    table: Table;
}
