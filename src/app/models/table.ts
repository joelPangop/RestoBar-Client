import {TableStatus} from './table-status';
import { LigneCommande } from './ligne-commande';
import { Commande } from './commande';

export class Table {

    constructor() {
        this.nbChaises = 0;
        this.status = TableStatus.FREE;
    }

    id: number;
    noTable: number;
    nbChaises: number;
    status: TableStatus;

}
