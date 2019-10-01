import {Injectable} from '@angular/core';
import {LigneCommande} from '../models/ligne-commande';
import {GestionPanier} from './gestion-panier';
import {ProduitService} from './produit.service';
import {Produit} from '../models/produit';
import {PanierTransactionService} from './panier-transaction.service';
import {HttpClient} from '@angular/common/http';
import {Table} from '../models/table';

@Injectable({
    providedIn: 'root'
})
export class PanierService {

    URL = 'http://localhost:4000/commande';

    panier: Map<number, LigneCommande>;

    constructor(private http: HttpClient, private produitService: ProduitService, private panierTransactionService: PanierTransactionService) {
        this.panier = new Map<number, LigneCommande>();
    }

    public async updatePanier(operation, produitToStock: Produit, table: Table) {
        let ligneCmd: LigneCommande = new LigneCommande();
        if (operation && produitToStock.id) {
            await this.produitService.getProduitById(produitToStock.id).subscribe(res => {
                ligneCmd.produit = res as Produit;
                ligneCmd.quantite = 1;
                if (ligneCmd.table.noTable === 0) {
                    ligneCmd.table = table as Table;
                }
                this.panierTransactionService.updatePanier(ligneCmd, operation, res as Produit);
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
            // this.panierTransactionService.updatePanier(uneCommande, operation);
        }

    }

    public checkoutCommand(panier: LigneCommande[]) {
        let totalMontant = this.panierTransactionService.getSubTotal(panier);
        let url: string = this.URL + `/${totalMontant}`;
        return this.http.post(url, panier);
    }

    public getPanier(operation: string, produitId: string) {
        return this.panierTransactionService.getPanierProduits();
    }

    public getPanierLoaded() {
        return this.panierTransactionService.getPanierProduitsList();
    }
}
