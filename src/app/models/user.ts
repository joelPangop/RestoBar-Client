import {TableStatus} from './table-status';
import {RoleType} from './role-type';
import { Depense } from './depense';

export class User {
    constructor() {
        this.id = 0;
        this.username = '';
        this.password = '';
        this.salaire = 0;
        this.role = RoleType.EMPLOYE;
    }

    id: number;
    username: string;
    usernumber: number;
    password: string;
    role: RoleType;
    salaire: number;
}
