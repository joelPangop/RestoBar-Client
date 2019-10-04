import {Injectable} from '@angular/core';
import {LigneCommande} from '../models/ligne-commande';
import {ProduitService} from './produit.service';
import {PanierTransactionService} from './panier-transaction.service';
import {HttpClient} from '@angular/common/http';
import {Table} from '../models/table';
import {Commande} from '../models/commande';
import {TableStatus} from '../models/table-status';
import {tap} from 'rxjs/operators';
import {Produit} from '../models/produit';

@Injectable({
    providedIn: 'root'
})
export class PanierService {

    URL = 'http://localhost:4000/commande';
    URL_TAB = 'http://localhost:4000/commande/table';

    panier: Map<number, LigneCommande>;
    ligneCommandes: LigneCommande[];
    produits: Produit[] = [];

    constructor(private http: HttpClient, private produitService: ProduitService, private panierTransactionService: PanierTransactionService) {
        this.panier = new Map<number, LigneCommande>();
        this.ligneCommandes = new Array();
        this.produits = [];
    }

    public updatePanier(operation, ligneCmd: LigneCommande) {
        if (operation && ligneCmd.produit.id) {
            // this.panierTransactionService.updatePanier(ligneCmd, operation);
            switch (operation) {
                case 'ajouter':
                    this.ajouter(this.panier, ligneCmd);
                    break;
                case 'enlever':
                    this.enlever(this.panier, ligneCmd);
                    break;
                case 'vider':
                    this.supprimer(this.panier, ligneCmd);
                    break;
                case 'enleverDuPanier':
                    this.panier.delete(ligneCmd.produit.id);
                    break;
                default:
                    break;
            }
        }
    }

    public ajouter(panier: Map<number, LigneCommande>, ligneCmd: LigneCommande) {

        if (panier.get(ligneCmd.produit.id) != null) {
            ligneCmd.quantite++;
            this.produits.forEach(e => {
                if (e.nomProduit === ligneCmd.produit.nomProduit) {
                    e.quantite--;
                }
            });
        }
        panier.set(ligneCmd.produit.id, ligneCmd);
    }

    public enlever(panier: Map<number, LigneCommande>, ligneCmd: LigneCommande) {
        if (panier.get(ligneCmd.produit.id) != null) {
            // const qte = panier.get(ligneCmd.produit.produit.id).produit.quantite;
            if (ligneCmd.quantite > 0) {
                if (ligneCmd.quantite === 1) {
                    this.panier.delete(ligneCmd.produit.id);
                } else {
                    ligneCmd.quantite--;
                    this.produits.forEach(e => {
                        if (e.nomProduit === ligneCmd.produit.nomProduit) {
                            e.quantite++;
                        }
                    });
                }
            }
        }
    }

    public supprimer(panier: Map<number, LigneCommande>, ligneCmd: LigneCommande) {
        if (panier.size !== 0) {
            if (panier.get(ligneCmd.produit.id) != null) {
                panier.delete(ligneCmd.produit.id);
                ligneCmd.produit.quantite += ligneCmd.quantite;
            }
        }
    }

    checkoutCommand(panier: LigneCommande[], table: Table, commandNumber: number) {
        let totalMontant = this.panierTransactionService.getSubTotal(panier);
        let commande = new Commande();
        commande.complete = false;
        commande.dateLivraison = new Date();
        commande.montant = totalMontant;
        commande.numCmd = commandNumber;
        return this.http.post<Commande>(this.URL + '?panier=' + JSON.stringify(panier), commande).pipe(
            tap(async (res: Commande) => {
                console.log(res);
                table.status = TableStatus.BUSY;
            })
        ).subscribe(res => {
            console.log(res);
        });
    }

    public getCommandeTable(table: Table) {
        return this.http.get<LigneCommande[]>(this.URL_TAB + `/${table.id}`).pipe(
            tap(async (res: LigneCommande[]) => {
                console.log(res);
                this.ligneCommandes = res as LigneCommande[];
            })
        );
    }

    public getLDC(table: Table, produit: Produit){
        let ldc : LigneCommande;
        for(let [key, value] of this.panier){
            if(key === produit.id && value.table.noTable === table.noTable){
                ldc = value;
            }
        }
        return ldc;
    }

    public updateCommandLine(panier: LigneCommande[], ligneCommande: LigneCommande, table: Table, commandNumber: number) {
        if (ligneCommande.commande !== undefined) {
            let totalMontant = this.panierTransactionService.getSubTotal(panier);
            if (panier.length > 0) {
                return this.http.put<Commande>(this.URL + `/${ligneCommande.commande.id}` + '?panier=' + JSON.stringify(panier), ligneCommande.commande).pipe(
                    tap(async (res: Commande) => {
                        console.log(res);
                    })
                ).subscribe(res => {
                    console.log(res);
                });
            } else {
                return this.http.delete<LigneCommande>(this.URL + `/${ligneCommande.commande.id}`)
                    .subscribe(res => {
                        console.log(res);
                    });
            }
        }
    }
}
