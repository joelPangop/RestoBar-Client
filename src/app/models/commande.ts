import { Table } from './table';
import { LigneCommande } from './ligne-commande';

export class Commande {

    constructor(id = 0, numCmd = 0, montant = 0, complete = false) {
        this.id = id;
        this.numCmd = numCmd;
        this.montant = montant;
        this.complete = complete;
        this.table = new Table();
        this.ligneCommande = [];
        this.dateLivraison = new Date();
    }

    id: number;
    numCmd: number;
    montant: number;
    complete: boolean;
    table: Table;
    ligneCommande: LigneCommande[];
    dateLivraison: Date;
}
