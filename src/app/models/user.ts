import {TableStatus} from './table-status';
import {RoleType} from './role-type';
import { Depense } from './depense';
import { Adresse } from './adresse';
import { Telephone } from './telephone';

export class User {
    constructor() {
        this.id = 0;
        this.username = '';
        this.password = '';
        this.salaire = 0;
        this.role = RoleType.EMPLOYE;
        this.adresse = new Adresse();
        this.telephones = [];

    }

    id: number;
    username: string;
    usernumber: number;
    password: string;
    role: RoleType;
    salaire: number;
    adresse: Adresse;
    telephones: Telephone[];
}
