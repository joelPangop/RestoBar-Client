import { LigneCommande } from '../models/ligne-commande';

export class GestionPanier {

    public static ajouter(panier: Map<number, LigneCommande>, ligneCmd: LigneCommande) {
        if (ligneCmd.quantite > 0) {
            if (panier[ligneCmd.produit.id] != null) {
                const quantite = panier.get(ligneCmd.produit.id).quantite;
                ligneCmd.quantite = quantite + 1;
            }
            panier.set(ligneCmd.produit.id, ligneCmd);
        }
    }

    public static enlever(panier: Map<number, LigneCommande>, ligneCmd: LigneCommande) {
        if (ligneCmd.quantite > 0) {
            if (panier.get(ligneCmd.produit.id) != null) {
                const qte = panier.get(ligneCmd.produit.id).quantite;
                ligneCmd.quantite = qte - 1;
                if (ligneCmd.quantite <= 0) {
                    this.supprimer(panier, ligneCmd);
                } else {
                    panier.set(ligneCmd.produit.id, ligneCmd);
                }
            }
        }
    }

    public static supprimer(panier: Map<number, LigneCommande>, ligneCmd: LigneCommande) {
        if (panier.size !== 0) {
            if (panier.get(ligneCmd.produit.id) != null) {
                panier.delete(ligneCmd.produit.id);
            }
        }
    }

    public static vider(panier: Map<number, LigneCommande>) {
        panier.clear();
    }

    public static nbArticles(panier: Map<number, LigneCommande>) {
        let retour = 0;
        for (const value of panier.values()) {
            retour += value.quantite;
        }
    }
}
