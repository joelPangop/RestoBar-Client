import { Injectable } from '@angular/core';
import { LigneCommande } from '../models/ligne-commande';
import { GestionPanier } from './gestion-panier';
import { ProduitService } from './produit.service';
import { Produit } from '../models/produit';
import { PanierTransactionService } from './panier-transaction.service';

@Injectable({
  providedIn: 'root'
})
export class PanierService {

  URL = 'http://localhost:4000/panier';

  constructor(private produitService: ProduitService, private panierTransactionService: PanierTransactionService) { }

  public async updatePanier(operation, produitId) {

    if (operation && produitId) {
      const ligneCmd: LigneCommande = new LigneCommande();
      await this.produitService.getProduitById(produitId).subscribe(res => {
        ligneCmd.produit = res as Produit;
        ligneCmd.quantite = 1;
        this.panierTransactionService.updatePanier(ligneCmd, operation);
      });
    }
  }

  public ajouterPanier(operation: string, produitId: string, quantite: string) {

    if (produitId != null && operation != null && quantite != null) {
      const id: number = +produitId;
      const uneCommande: LigneCommande = new LigneCommande();
      const qte: number = +quantite;
      uneCommande.produit.id = id;
      uneCommande.quantite = qte;
      this.panierTransactionService.updatePanier(uneCommande, operation);
    }

  }

  public getPanier(operation: string, produitId: string) {
    return this.panierTransactionService.getPanierProduits();
  }

  public getPanierLoaded() {
    return this.panierTransactionService.getPanierProduitsList();
  }
}
