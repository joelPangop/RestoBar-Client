import {TableStatus} from './table-status';

export class Table {

    constructor() {
        this.noTable = 0;
        this.nbChaises = 0;
        this.status = TableStatus.FREE;
    }

    id: number;
    noTable: number;
    nbChaises: number;
    status: TableStatus;
}
