import {TypeDepense} from './type-depense';
import {Fournisseur} from './fournisseur';
import {ProduitAchat} from './produit-achat';

export class Depense {
    constructor(){
        this.typeDepense = TypeDepense.ACHAT;
        this.montant = 0;
        this.description='';
        this.produitAchats = [];
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
}
