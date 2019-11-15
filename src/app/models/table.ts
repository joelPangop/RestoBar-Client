import {TableStatus} from './table-status';
import { LigneCommande } from './ligne-commande';

export class Table {

    constructor() {
        this.noTable = 0;
        this.nbChaises = 0;
        this.status = TableStatus.FREE;
        this.ligneCommandes = [];
    }

    id: number;
    noTable: number;
    nbChaises: number;
    status: TableStatus;
    ligneCommandes: LigneCommande[];
}
