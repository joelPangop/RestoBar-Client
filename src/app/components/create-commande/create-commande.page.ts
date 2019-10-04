import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams, ToastController} from '@ionic/angular';
import {Produit} from '../../models/produit';
import {LigneCommande} from '../../models/ligne-commande';
import {PanierService} from '../../services/panier.service';
import {PanierTransactionService} from '../../services/panier-transaction.service';
import {Table} from '../../models/table';
import {ProduitPanier} from '../../models/produit-panier';
import {PredefinedColors} from '@ionic/core';
import {ProduitService} from '../../services/produit.service';

@Component({
    selector: 'app-create-commande',
    templateUrl: './create-commande.page.html',
    styleUrls: ['./create-commande.page.scss'],
})
export class CreateCommandePage implements OnInit {
    table: Table;
    commandNumber: number;

    constructor(public panierService: PanierService, public modalController: ModalController,
                private panierTransactionService: PanierTransactionService, public produitService: ProduitService,
                public navParams: NavParams, public toastController: ToastController) {
        this.table = this.navParams.get('table');
    }

    ngOnInit() {
        this.getCommandLines();
        this.getExistingPanier();
        this.getProduits();
    }

    public getCommandLines() {
        const ligneCommandes: LigneCommande[] = [];
        for (const [key, value] of this.panierService.panier.entries()) {
            if (value.table.noTable === this.table.noTable) {
                ligneCommandes.push(value as LigneCommande);
            }
            console.log(ligneCommandes);
        }
        return ligneCommandes;
    }

    public getProduits() {
        this.produitService.getAll().subscribe(res => {
            this.panierService.produits = res as Produit[];
        });
    }

    public async getExistingPanier() {
        await this.panierService.getCommandeTable(this.table).subscribe(res => {
            console.log(res);
            this.panierService.ligneCommandes = res as LigneCommande[];
            if (this.panierService.ligneCommandes.length > 0) {
                this.commandNumber = this.panierService.ligneCommandes[0].commande.numCmd;
                for (const ldc of this.panierService.ligneCommandes) {
                    if (ldc.commande.complete === false) {
                        for (const prod of this.panierService.produits) {
                            if (prod.id === ldc.produit.id) {
                                prod.quantite -= ldc.quantite;
                            }
                        }
                        this.panierService.panier.set(ldc.produit.id, ldc);
                    }
                }
            }
        });
    }

    dismiss() {
        this.modalController.dismiss();
    }

    public async addCommande(produit: Produit) {
        let ldc: LigneCommande = this.panierService.getLDC(this.table, produit);
        if (produit.quantite > 0 && !ldc) {
            const ligneCommande: LigneCommande = new LigneCommande();
            this.commandNumber = this.getRandomInt();
            ligneCommande.produit = produit;
            ligneCommande.quantite = 1;
            produit.quantite--;
            ligneCommande.table = this.table;
            await this.panierService.updatePanier('ajouter', ligneCommande);
        } else if (produit.quantite < 0) {
            this.presentToast('Produit fini en stock');
        }
    }

    public updatePanier(operation, ligneCommande: LigneCommande) {
        if (ligneCommande.produit.quantite > 0) {
            this.panierService.updatePanier(operation, ligneCommande);
            if (operation === 'enleverDuPanier') {
                this.panierService.updateCommandLine(this.getCommandLines(), ligneCommande, this.table, this.commandNumber);
            }
        } else {
            this.presentToast('Produit fini en stock');
        }
    }

    renderProdPanier(produit: Produit) {
        return produit.quantite > 0;
    }

    async checkoutcommand() {
        this.panierService.checkoutCommand(this.getCommandLines(), this.table, this.commandNumber);
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
