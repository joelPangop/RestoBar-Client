import {Injectable} from '@angular/core';
import {LigneCommande} from '../models/ligne-commande';
import {ProduitService} from './produit.service';
import {PanierTransactionService} from './panier-transaction.service';
import {HttpClient} from '@angular/common/http';
import {Table} from '../models/table';
import {Commande} from '../models/commande';
import {TableStatus} from '../models/table-status';
import {tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PanierService {

    URL = 'http://localhost:4000/commande';

    panier: Map<number, LigneCommande>;
    ligneCommandes: LigneCommande[];

    constructor(private http: HttpClient, private produitService: ProduitService, private panierTransactionService: PanierTransactionService) {
        this.panier = new Map<number, LigneCommande>();
        this.ligneCommandes = [];
    }

    public async updatePanier(operation, ligneCmd: LigneCommande) {
        if (operation && ligneCmd.produit.id) {
            await this.panierTransactionService.updatePanier(ligneCmd, operation);
        }
    }

    checkoutCommand(panier: LigneCommande[], table: Table) {
        let totalMontant = this.panierTransactionService.getSubTotal(panier);
        let commande = new Commande();
        commande.complete = false;
        commande.dateLivraison = new Date();
        commande.montant = totalMontant;
        commande.numCmd = this.getRandomInt(1000);
        let url: string = this.URL +"?panier="+JSON.stringify(panier);
        return this.http.post<Commande>(url, commande).pipe(
            tap(async (res: Commande) => {
                console.log(res);
                table.status = TableStatus.BUSY;
            })
        ).subscribe(res=>{
            console.log(res);
        });
    }

    // public getPanier(table: Table) {
    //     this.getCommandeTable(table).subscribe(res=>{
    //         let ligneCommande = res as LigneCommande[];

    //         console.log(res);
    //     });
    // }

    public getCommandeTable(table: Table) {
        return this.http.get(this.URL+`/${table.id}`);
    }

    public getPanierLoaded() {
        return this.panierTransactionService.getPanierProduitsList();
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}
