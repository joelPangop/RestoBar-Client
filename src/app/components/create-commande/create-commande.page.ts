import {Component, OnInit} from '@angular/core';
import {LoadingController, ModalController, NavParams, ToastController} from '@ionic/angular';
import {Produit} from '../../models/produit';
import {LigneCommande} from '../../models/ligne-commande';
import {PanierService} from '../../services/panier.service';
import {Table} from '../../models/table';
import {ProduitService} from '../../services/produit.service';
import {Commande} from '../../models/commande';
import {TableService} from '../../services/table.service';
import {Router} from '@angular/router';
import {TableStatus} from '../../models/table-status';
import {AuthService} from '../../services/auth.service';
import {FormBuilder, FormControl, FormGroup, NgForm} from '@angular/forms';
import {finalize} from 'rxjs/operators';

@Component({
    selector: 'app-create-commande',
    templateUrl: './create-commande.page.html',
    styleUrls: ['./create-commande.page.scss'],
})
export class CreateCommandePage implements OnInit {
    table: Table;
    commandNumber: number;
    subtotal = 0;
    private panierForm: FormGroup;
    loading: any;

    constructor(public panierService: PanierService, public modalController: ModalController,
                public produitService: ProduitService, public formBuilder: FormBuilder,
                public tableService: TableService, private router: Router, public loadingController: LoadingController,
                public navParams: NavParams, public toastController: ToastController) {
        this.table = this.navParams.get('table');
        this.panierForm = new FormGroup({update: new FormControl('')});

    }

    ngOnInit() {
        this.getCommandLines();
        this.getProduits();
    }

    public async getCommandLines() {
        this.panierService.commande = new Commande();

        await this.panierService.getCommandeByTable(this.table).subscribe(async res => {
            this.panierService.commande = res as Commande;
            this.subtotal = this.panierService.commande.montant;
            console.log(res);
            if (this.panierService.commande.ligneCommandes.length > 0) {
                this.commandNumber = this.panierService.commande.numCmd;
                this.getSubTotal(this.panierService.commande.ligneCommandes);
                for (const ldc of this.panierService.commande.ligneCommandes) {
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

    public async getProduits() {
        await this.produitService.getAll().subscribe(res => {
            this.panierService.produits = res as Produit[];
        });
    }

    public async addCommande(produit: Produit) {
        const ldc: LigneCommande = this.panierService.panier.get(produit.id);
        if (produit.quantite > 0 && !ldc) {
            this.loading = await this.loadingController.create({
                message: 'Loading...'
            });
            await this.loading.present();
            const ligneCommande: LigneCommande = new LigneCommande();
            this.commandNumber = this.getRandomInt();
            ligneCommande.produit = produit;
            ligneCommande.quantite = 1;
            produit.quantite--;
            await this.panierService.ajouter(ligneCommande);
            // this.panierService.ajouter(this.panierService.panier, ligneCommande);
            this.getSubTotal(this.panierService.commande.ligneCommandes);
            this.checkoutcommand(false);
        } else if (produit.quantite < 0) {
            this.presentToast('Produit fini en stock');
        }
    }

    public async updatePanier(operation, ligneCommande: LigneCommande) {
        this.loading = await this.loadingController.create({
            message: 'Loading...'
        });
        await this.loading.present();
        switch (operation) {
            case 'ajouter':
                if (ligneCommande.produit.quantite > 0) {
                    await this.panierService.ajouter(ligneCommande);
                    // await this.panierService.ajouter(this.panierService.panier, ligneCommande);
                    this.getSubTotal(this.panierService.commande.ligneCommandes);
                    this.checkoutcommand(false);
                    break;
                } else {
                    this.presentToast('Produit fini en stock');
                    break;
                }
            case 'enlever':
                if (ligneCommande.quantite === 1) {
                    this.presentToast('Produit retiré de la commande');
                }
                await this.panierService.enlever(ligneCommande);
                this.getSubTotal(this.panierService.commande.ligneCommandes);
                this.checkoutcommand(false);
                break;
            case 'vider':
                // await this.panierService.supprimer(ligneCommande);
                break;
            case 'enleverDuPanier':
                await this.panierService.supprimer(ligneCommande);
                await this.getSubTotal(this.panierService.commande.ligneCommandes);
                await this.checkoutcommand(false);
                this.commandNumber = this.panierService.commande.numCmd;
                break;
            default:
                break;
        }
    }

    renderProdPanier(ldc: LigneCommande) {
        return ldc.quantite > 0;
    }

    async checkoutcommand(complete) {
        this.panierService.commande.complete = complete;
        this.panierService.commande.dateLivraison = new Date();
        this.panierService.commande.table = this.table;
        this.panierService.commande.montant = this.subtotal;
        this.panierService.commande.numCmd = this.commandNumber;
        this.panierService.checkoutCommand().subscribe(res => {
            this.panierService.commande = res as Commande;
            this.loading.dismiss();
            console.log(res as Commande);
        });
    }

    async completeOrder() {
        this.checkoutcommand(true).then(async res => {
            this.table.status = TableStatus.FREE;
            await this.presentToast('Commande complétée');
            await this.close();
        });
    }

    getRandomInt() {
        return Math.floor(Math.random() * Math.floor(30000));
    }

    public getSubTotal(ligneCommandes: LigneCommande[]) {
        this.subtotal = 0;
        if (ligneCommandes != null) {
            for (const p of ligneCommandes) {
                this.subtotal += p.quantite * p.produit.prix;
            }
        }
    }

    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000,
            position: 'middle',
            color: 'transparent'
        });
        await toast.present();
    }

    async close() {
        const modal = this.navParams.get('modal');
        modal.dismiss(this.table);
    }

}
