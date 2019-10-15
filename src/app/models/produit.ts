import {TypeProduit} from './type-produit';
import {LigneCommande} from './ligne-commande';

export class Produit {

    constructor() {
        this.nomProduit = '';
        this.description = '';
        this.quantite = 0;
        this.prix = 0;
        this.type = TypeProduit.LIQUEUR
    }

    id: number;
    nomProduit: string;
    description: string;
    type: string;
    quantite: number;
    prix: number;
    ligneCommandes: LigneCommande[];
}
