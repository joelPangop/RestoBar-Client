import { CategorieTelephone } from './categorie-telephone';

export class Telephone {

    constructor() {
        this.numeroTelephone = '';
        this.categorieTelephone = CategorieTelephone.cellulaire;
    }

    id: number;
    numeroTelephone: string;
    categorieTelephone: CategorieTelephone;
}
