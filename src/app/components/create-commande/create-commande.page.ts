import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams, ToastController} from '@ionic/angular';
import {Produit} from '../../models/produit';
import {LigneCommande} from '../../models/ligne-commande';
import {PanierService} from '../../services/panier.service';
import {PanierTransactionService} from '../../services/panier-transaction.service';
import {Table} from '../../models/table';
import {ProduitPanier} from '../../models/produit-panier';
import {PredefinedColors} from '@ionic/core';

@Component({
    selector: 'app-create-commande',
    templateUrl: './create-commande.page.html',
    styleUrls: ['./create-commande.page.scss'],
})
export class CreateCommandePage implements OnInit {
    table: Table;
    produits: Produit[] = [];

    constructor(public panierService: PanierService, public modalController: ModalController, private panierTransactionService: PanierTransactionService,
                public navParams: NavParams, public toastController: ToastController) {
        this.table = this.navParams.get('table');
        this.produits = this.navParams.get('produits');
    }

    ngOnInit() {
        this.getCommandLines();
        this.getExistingPanier();
    }

    public getCommandLines() {
        let ligneCommandes: LigneCommande[] = [];
        for (const [key, value] of this.panierTransactionService.panier.entries()) {
            if (value.table.noTable == this.table.noTable) {
                ligneCommandes.push(value as LigneCommande);
            }
            console.log(ligneCommandes);
        }
        return ligneCommandes;
    }

    public async getExistingPanier() {
        await this.panierService.getCommandeTable(this.table).subscribe(res => {
            this.panierService.ligneCommandes = res as LigneCommande[];
            for (let ldc of this.panierService.ligneCommandes) {
                if (ldc.commande.complete == false) {
                    for (let prod of this.produits) {
                        if (prod.id === ldc.produit.id) {
                            prod.quantite -= ldc.quantite;
                        }
                    }
                    this.panierTransactionService.panier.set(ldc.produit.id, ldc);
                }
            }
        });
    }

    dismiss() {
        this.modalController.dismiss();
    }

    public async addCommande(produit: Produit) {
        if (produit.quantite > 0) {
            let ligneCommande: LigneCommande = new LigneCommande();
            ligneCommande.produit = produit;
            ligneCommande.quantite = 1;
            ligneCommande.table = this.table;
            // if (this.panierTransactionService.panier.size >= 0) {
            //     if (!this.panierTransactionService.panier.get(produit.id)) {
            await this.panierService.updatePanier('ajouter', ligneCommande);
            //     }
            //             // }
        } else {
            this.presentToast('Produit fini en stock');
        }
    }

    public async updatePanier(operation, ligneCommande: LigneCommande) {
        if (ligneCommande.produit.quantite > 0) {
            await this.panierService.updatePanier(operation, ligneCommande);
        } else {
            this.presentToast('Produit fini en stock');
        }
    }

    renderProdPanier(produit: Produit) {
        return produit.quantite > 0;
    }

    async checkoutcommand() {
        this.panierService.checkoutCommand(this.getCommandLines(), this.table);
    }

    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000,
            position: 'middle',
            color: 'transparent'
        });
        toast.present();
    }

    getRandomInt() {
        return Math.floor(Math.random() * Math.floor(30000));
    }
}
