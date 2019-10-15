import {Adresse} from './adresse';
import {Produit} from './produit';

export class Fournisseur {

    constructor(){
        this.nom='';
        this.adresse = new Adresse();
    }

    id: number;
    nom: string;
    adresse: Adresse;
    produits: Produit[];
}
