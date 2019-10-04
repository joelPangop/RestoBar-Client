import { Table } from './table';
import { LigneCommande } from './ligne-commande';

export class Commande {

    constructor() {
        this.numCmd = 0;
        this.montant = 0;
        this.complete = false;
        this.dateLivraison = new Date();
    }

    id: number;
    numCmd: number;
    montant: number;
    complete: boolean;
    dateLivraison: Date;
}
