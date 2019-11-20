import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams, ToastController } from '@ionic/angular';
import { Produit } from '../../models/produit';
import { LigneCommande } from '../../models/ligne-commande';
import { PanierService } from '../../services/panier.service';
import { Table } from '../../models/table';
import { ProduitService } from '../../services/produit.service';
import { Commande } from '../../models/commande';
import { TableService } from '../../services/table.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-create-commande',
    templateUrl: './create-commande.page.html',
    styleUrls: ['./create-commande.page.scss'],
})
export class CreateCommandePage implements OnInit {
    table: Table;
    commandNumber: number;
    subtotal: number = 0;
    commande: Commande;

    constructor(public panierService: PanierService, public modalController: ModalController,
        public produitService: ProduitService,
        public tableService: TableService, private router: Router, public loadingController: LoadingController,
        public navParams: NavParams, public toastController: ToastController) {
        this.table = this.navParams.get('table');
        this.commande = new Commande();
    }

    ngOnInit() {
        this.getCommandLines();
        this.getExistingPanier();
        this.getProduits();

    }

    public getCommandLines() {
        const ligneCommandes: LigneCommande[] = [];
        for (const [key, value] of this.panierService.panier.entries()) {
            // if (value.commande.table.noTable === this.table.noTable) {
            ligneCommandes.push(value as LigneCommande);
            // }
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
            const commandes: Commande[] = res;
            for (let cmd of commandes) {
                if (cmd.complete === false) {
                    this.panierService.ligneCommandes = cmd.ligneCommandes;
                    this.commande = cmd
                }
            }
            if (this.panierService.ligneCommandes.length > 0 && this.panierService.commande.complete === false) {
                this.commande = this.panierService.commande;
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
            this.commandNumber = this.getRandomInt();
            ligneCommande.produit = produit;
            ligneCommande.quantite = 1;
            produit.quantite--;
            this.panierService.ajouter(this.panierService.panier, ligneCommande);
            this.getSubTotal(this.getCommandLines());
            this.checkoutcommand(false);
        } else if (produit.quantite < 0) {
            this.presentToast('Produit fini en stock');
        }
    }

    public updatePanier(operation, ligneCommande: LigneCommande) {
        switch (operation) {
            case 'ajouter':
                if (ligneCommande.produit.quantite > 0) {
                    this.panierService.ajouter(this.panierService.panier, ligneCommande);
                    // for(let ldc of this.getCommandLines()){
                    //     if(ldc.produit.id === ligneCommande.produit.id) {
                    //         if (ligneCommande.commande) {
                    //             this.commande.id = ligneCommande.commande.id;
                    //         }
                    //     }
                    // }
                    this.getSubTotal(this.getCommandLines());
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
                this.panierService.enlever(this.panierService.panier, ligneCommande);
                this.getSubTotal(this.getCommandLines());
                this.checkoutcommand(false);
                break;
            case 'vider':
                this.panierService.supprimer(this.panierService.panier, ligneCommande);
                break;
            case 'enleverDuPanier':
                // this.panierService.updateCommandLine(this.getCommandLines(), ligneCommande, this.table, this.commandNumber);
                this.panierService.panier.delete(ligneCommande.produit.id);
                this.getSubTotal(this.getCommandLines());

                this.checkoutcommand(false);
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
        this.commande.table = this.table;
        this.commande.montant = this.subtotal;
        this.commande.numCmd = this.commandNumber;
        this.panierService.checkoutCommand(this.getCommandLines(), this.commande).subscribe(res => {
            console.log(this.commande = res as Commande);
        });;
    }

    async completeOrder() {
        this.checkoutcommand(true);
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
