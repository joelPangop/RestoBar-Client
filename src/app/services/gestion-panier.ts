import {LigneCommande} from '../models/ligne-commande';
import {Produit} from '../models/produit';

export class GestionPanier {

    public static ajouter(panier: Map<number, LigneCommande>, ligneCmd: LigneCommande) {

        if (panier.get(ligneCmd.produit.id) != null) {
            ligneCmd.quantite++;
            ligneCmd.produit.quantite--;
        }
        panier.set(ligneCmd.produit.id, ligneCmd);
    }

    public static enlever(panier: Map<number, LigneCommande>, ligneCmd: LigneCommande) {
        if (panier.get(ligneCmd.produit.id) != null) {
            // const qte = panier.get(ligneCmd.produit.produit.id).produit.quantite;
            if (ligneCmd.quantite > 0) {
                ligneCmd.quantite--;
                ligneCmd.produit.quantite++;
                if (ligneCmd.produit.quantite === 1) {
                    this.supprimer(panier, ligneCmd);
                }
            }
            // panier.set(ligneCmd.produit.produit.id, ligneCmd);
        }
    }

    public static supprimer(panier: Map<number, LigneCommande>, ligneCmd: LigneCommande) {
        if (panier.size !== 0) {
            if (panier.get(ligneCmd.produit.id) != null) {
                panier.delete(ligneCmd.produit.id);
                ligneCmd.produit.quantite += ligneCmd.quantite;
            }
        }
    }

    public static vider(panier: Map<number, LigneCommande>) {

        panier.clear();
    }

    public static nbArticles(panier: Map<number, LigneCommande>) {
        let retour = 0;
        for (const value of panier.values()) {
            retour += value.produit.quantite;
        }
    }
}
