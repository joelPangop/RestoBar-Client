import {TypeDepense} from './type-depense';

export class Depense {
    constructor(){
        this.typeDepense = TypeDepense.ACHAT;
        this.montant = 0;
        this.description='';
    }

    id: number;
    typeDepense: TypeDepense;
    montant: number;
    description: string;
}
