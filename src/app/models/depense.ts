import {TypeDepense} from './type-depense';
import {Fournisseur} from './fournisseur';
import {ProduitAchat} from './produit-achat';
import { User } from './user';

export class Depense {
    constructor(){
        this.typeDepense = TypeDepense.ACHAT;
        this.montant = 0;
        this.quantite = 1;
        this.description='';
        this.produitAchats = [];
        this.user = new User();
    }

    id: number;
    typeDepense: TypeDepense;
    numDepense: number;
    montant: number;
    description: string;
    quantite: number;
    dateDepense: Date;
    fournisseur: Fournisseur;
    produitAchats: ProduitAchat[];
    user: User;
}
