import {Component, OnInit} from '@angular/core';
import {TableService} from '../../services/table.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingController, ModalController, ToastController} from '@ionic/angular';
import {Table} from '../../models/table';
import {ProduitService} from '../../services/produit.service';
import {CreateCommandePage} from '../create-commande/create-commande.page';
import {Produit} from '../../models/produit';
import {PanierService} from '../../services/panier.service';
import {LigneCommande} from '../../models/ligne-commande';
import {TableStatus} from '../../models/table-status';
import {Commande} from '../../models/commande';
import {NgForm} from '@angular/forms';

@Component({
    selector: 'app-table',
    templateUrl: './table.page.html',
    styleUrls: ['./table.page.scss'],
})
export class TablePage implements OnInit {

    table: Table;
    commandNumber: number;
    subtotal: number = 0;
    commande: Commande;

    constructor(public tableService: TableService, private router: Router, public loadingController: LoadingController, public produitService: ProduitService,
                public toastController: ToastController, public route: ActivatedRoute, public modalController: ModalController, public panierService: PanierService) {
        this.table = new Table();
        this.commande = new Commande();
    }

    ngOnInit() {
        this.getTables();
        this.getAllProduits();
        this.getCommandLines();
        this.getExistingPanier();
        this.getProduits();
    }

    getTables = async () => {
        const loading = await this.loadingController.create({
            message: 'Loading...'
        });
        await loading.present();
        this.tableService.getTables()
            .subscribe(res => {
                this.tableService.tables = res as Table[];
                for (let tab of this.tableService.tables) {
                    this.getTableStatus(tab);
                }
                console.log(this.tableService.tables);
                loading.dismiss();
            });
    };

    public getTableStatus(table: Table) {
        this.panierService.getCommandeTable(table).subscribe(res => {
            let ldc = res as LigneCommande[];
            if (ldc.length > 0 && ldc[0].commande.complete == false) {
                table.status = TableStatus.BUSY;
            } else {
                table.status = TableStatus.FREE;
            }
        });
    }

    async createCommand(table: Table) {
        const modal = await this.modalController.create({
            component: CreateCommandePage,
            cssClass: 'my-custom-modal-css',
            componentProps: {
                produits: this.produitService.produits,
                table: table as Table
            }
        });
        await modal.present();
    }

    async openCommande(table: Table) {
        this.table = table;
        this.subtotal = 0;
        this.commandNumber = undefined;
        this.panierService.panier = new Map<number, LigneCommande>();
        this.getCommandLines();
        this.getExistingPanier();
    }

    viderPanier(ngForm: NgForm) {
        ngForm.reset();
    }

    async getAllProduits() {
        this.produitService.getAll()
            .subscribe(res => {
                this.produitService.produits = res as Produit[];
                console.log(this.produitService.produits);
            });
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
            if (this.panierService.ligneCommandes.length > 0 && this.panierService.ligneCommandes[0].commande.complete === false) {
                this.commande = this.panierService.ligneCommandes[0].commande;
                this.commandNumber = this.commande.numCmd;
                this.getSubTotal(this.panierService.ligneCommandes);
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
            ligneCommande.produit = produit;
            ligneCommande.quantite = 1;
            produit.quantite--;
            ligneCommande.table = this.table;
            // this.table.status = TableStatus.BUSY;
            this.commandNumber = this.getRandomInt();
            this.panierService.ajouter(this.panierService.panier, ligneCommande);
            this.getSubTotal(this.getCommandLines());
            this.checkoutcommand(false).then(res => {
                // this.getTableStatus(this.table);
            });
        } else if (produit.quantite < 0) {
            this.presentToast('Produit fini en stock');
        }
    }

    public updatePanier(operation, ligneCommande: LigneCommande) {
        switch (operation) {
            case 'ajouter':
                if (ligneCommande.produit.quantite > 0 && this.commandNumber) {
                    this.panierService.ajouter(this.panierService.panier, ligneCommande);
                    this.getSubTotal(this.getCommandLines());
                    this.checkoutcommand(false);
                    break;
                } else {
                    this.presentToast('Produit fini en stock');
                    break;
                }
            case 'enlever':
                if (this.commandNumber) {
                    if (ligneCommande.quantite === 1) {
                        this.presentToast('Produit retiré de la commande');
                        this.commandNumber = undefined;
                    }
                    this.panierService.enlever(this.panierService.panier, ligneCommande);
                    this.getSubTotal(this.getCommandLines());
                    this.checkoutcommand(false);
                }
                break;
            case 'vider':
                this.panierService.supprimer(this.panierService.panier, ligneCommande);
                this.commandNumber = undefined;
                break;
            case 'enleverDuPanier':
                // this.panierService.updateCommandLine(this.getCommandLines(), ligneCommande, this.table, this.commandNumber);
                for (let prod of this.panierService.produits) {
                    if (prod.id === ligneCommande.produit.id) {
                        prod.quantite += ligneCommande.quantite;
                    }
                }
                this.panierService.panier.delete(ligneCommande.produit.id);
                this.getSubTotal(this.getCommandLines());
                this.checkoutcommand(false).then(res => {
                    this.getTableStatus(this.table);
                    this.commandNumber = undefined;
                });
                break;
            default:
                break;
        }
    }

    renderProdPanier(ldc: LigneCommande) {
        return ldc.quantite > 0;
    }

    async checkoutcommand(complete) {
        this.commande.complete = complete;
        this.commande.dateLivraison = new Date();
        this.commande.montant = this.subtotal;
        this.commande.numCmd = this.commandNumber;
        this.panierService.checkoutCommand(this.getCommandLines(), this.commande).subscribe(res => {
            console.log(this.commande = res as Commande);
        });
    }

    async completeOrder() {
        if (this.getCommandLines().length > 0) {
            this.checkoutcommand(true).then(res => {
                this.getTableStatus(this.table);
            });
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
}
