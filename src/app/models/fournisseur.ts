import {Adresse} from './adresse';
import {Produit} from './produit';
import { Telephone } from './telephone';

export class Fournisseur {

    constructor(){
        this.nom='';
        this.adresse = new Adresse();
        this.telephones = [];
    }

    id: number;
    nom: string;
    adresse: Adresse;
    produits: Produit[];
    telephones: Telephone[];
}
