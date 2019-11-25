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
    URL_TABS = 'http://localhost:4000/commande/tables';

    panier: Map<number, LigneCommande>;
    ligneCommandes: LigneCommande[];
    produits: Produit[] = [];
    table: Table;
    commande: Commande;

    constructor(private http: HttpClient, private produitService: ProduitService) {
        this.panier = new Map<number, LigneCommande>();
        this.ligneCommandes = [];
        this.produits = [];
        this.table = new Table();
        this.commande = new Commande();
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

    public async ajouter(panier: Map<number, LigneCommande>, ligneCmd: LigneCommande) {

        if (panier.get(ligneCmd.produit.id) != null) {
            ligneCmd.quantite++;
            for (let e of this.produits) {
                if (e.nomProduit === ligneCmd.produit.nomProduit) {
                    e.quantite--;
                    await this.produitService.editProduit(e).subscribe(res => {
                        e = res as Produit;
                    });
                }
            }
        } else {
            this.commande.ligneCommandes.push(ligneCmd as LigneCommande);
        }
        panier.set(ligneCmd.produit.id, ligneCmd);
        this.commande.table.status = TableStatus.BUSY;
    }

    public async enlever(panier: Map<number, LigneCommande>, ligneCmd: LigneCommande) {
        if (panier.get(ligneCmd.produit.id) != null) {
            // const qte = panier.get(ligneCmd.produit.produit.id).produit.quantite;
            if (ligneCmd.quantite > 0) {
                if (ligneCmd.quantite === 1) {
                    this.panier.delete(ligneCmd.produit.id);
                    for (let e of this.produits) {
                        if (e.nomProduit === ligneCmd.produit.nomProduit) {
                            e.quantite++;
                            await this.produitService.editProduit(e).subscribe(res => {
                                e = res as Produit;
                            });
                        }
                    }
                    const index = this.commande.ligneCommandes.indexOf(ligneCmd, 0);
                    if (index > -1) {
                        this.commande.ligneCommandes.splice(index, 1);
                    }
                } else {
                    ligneCmd.quantite--;
                    this.produits.forEach(e => {
                        if (e.nomProduit === ligneCmd.produit.nomProduit) {
                            e.quantite++;
                            ligneCmd.produit.quantite++;
                        }
                    });
                }
            }
        }
    }

    public async supprimer(panier: Map<number, LigneCommande>, ligneCmd: LigneCommande) {
        if (panier.size !== 0) {
            if (panier.get(ligneCmd.produit.id) != null) {
                // ligneCmd.produit.quantite += ligneCmd.quantite;
                panier.delete(ligneCmd.produit.id);
                for (let e of this.produits) {
                    if (e.nomProduit === ligneCmd.produit.nomProduit) {
                        e.quantite += ligneCmd.quantite;
                        await this.produitService.editProduit(e).subscribe(res => {
                            e = res as Produit;
                        });
                    }
                }
                const index = this.commande.ligneCommandes.indexOf(ligneCmd, 0);
                if (index > -1) {
                    this.commande.ligneCommandes.splice(index, 1);
                }
                if (this.commande.ligneCommandes.length === 0) {
                    this.commande.numCmd = null;
                }
            }
        }
    }

    public checkoutCommand() {
        if (this.commande.id !== undefined) {
            const url: string = this.URL + `/${this.commande.id}`;
            return this.http.put<Commande>(url, this.commande).pipe(
                tap(async (res: Commande) => {
                    console.log(res);
                })
            );
        } else {
            const url: string = this.URL;
            return this.http.post<Commande>(url, this.commande).pipe(
                tap(async (res: Commande) => {
                    console.log(res);
                })
            );
        }
    }

    public getCommandeTable(table: Table) {
        this.ligneCommandes = [];
        this.commande = new Commande();
        return this.http.get<Commande[]>(this.URL_TABS + `/${table.id}`).pipe(
            tap(async (res: Commande[]) => {
                console.log(res);
                for (const cmd of res as Commande[]) {
                    // tslint:disable-next-line:triple-equals
                    if (cmd.complete == false) {
                        this.ligneCommandes = cmd.ligneCommandes;
                    }
                    this.commande = cmd;
                }

            })
        );
    }

    public getCommandeByTable(table: Table) {
        return this.http.get(this.URL_TAB + `/${table.id}`);
    }

    public getLDC(table: Table, produit: Produit) {
        let ldc: LigneCommande;
        for (const [key, value] of this.panier) {
            if (key === produit.id && value.commande.table.noTable === table.noTable) {
                ldc = value;
            }
        }
        return ldc;
    }

    public updateCommandLine(panier: LigneCommande[], ligneCommande: LigneCommande, table: Table, commandNumber: number) {
        if (ligneCommande.commande !== undefined) {
            if (panier.length > 0) {
                return this.http.put<Commande>(this.URL + `/${ligneCommande.commande.id}` + '?panier=' + JSON.stringify(panier), ligneCommande.commande).pipe(
                    tap(async (res: Commande) => {
                        console.log(res);
                    })
                ).subscribe(res => {
                    console.log(res);
                });
            } else {
                return this.http.delete<LigneCommande>(this.URL + '/delete' + `/${ligneCommande.id}`)
                    .subscribe(res => {
                        console.log(res);
                    });
            }
        }
    }

}
