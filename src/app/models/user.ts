import {TableStatus} from './table-status';
import {RoleType} from './role-type';

export class User {
    constructor() {
        this.id = 0;
        this.username = '';
        this.password = '';
        this.role = RoleType.USER;
    }

    id: number;
    username: string;
    password: string;
    role: RoleType;
}
