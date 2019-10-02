import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams, ToastController} from '@ionic/angular';
import {Produit} from '../../models/produit';
import {LigneCommande} from '../../models/ligne-commande';
import {PanierService} from '../../services/panier.service';
import {PanierTransactionService} from '../../services/panier-transaction.service';
import {Table} from '../../models/table';

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
        this.getCommandLines();
    }

    ngOnInit() {
        this.getCommandLines();
    }

    public getCommandLines() {
        let ligneCommandes: LigneCommande[] = [];
        for (const [key, value] of this.panierTransactionService.panier.entries()) {
            if (value.table.noTable == this.table.noTable) {
                ligneCommandes.push(value);
            }
        }
        console.log(ligneCommandes);
        return ligneCommandes;
    }

    dismiss() {
        // this.presentToast();
        this.modalController.dismiss();
    }

    async updatePanier(operation, produit: Produit) {
        if (produit.quantite > 0) {
            await this.panierService.updatePanier(operation, produit, this.table);
        }
    }

    renderProdPanier(produit: Produit){
        return produit.quantite > 0;
    }

    async checkoutcommand() {
        this.panierService.checkoutCommand(this.getCommandLines(), this.table);
    }
}
