import {TableStatus} from './table-status';

export class Table {

    constructor(id = 0, username = '', password = '', role = '') {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
        this.tableStatus = TableStatus.FREE;
    }

    id: number;
    username: string;
    password: string;
    role: string;
    tableStatus: TableStatus;
}
