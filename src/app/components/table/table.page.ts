import {Component, OnInit} from '@angular/core';
import {TableService} from '../../services/table.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingController, ModalController, ToastController} from '@ionic/angular';
import {Table} from '../../models/table';
import {ProduitService} from '../../services/produit.service';
import {CreateCommandePage} from '../create-commande/create-commande.page';
import {PanierService} from '../../services/panier.service';
import {TableStatus} from '../../models/table-status';
import {Commande} from '../../models/commande';
import {Utils} from '../../services/utils';

@Component({
    selector: 'app-table',
    templateUrl: './table.page.html',
    styleUrls: ['./table.page.scss'],
})
export class TablePage implements OnInit {
    table: Table;
    commandNumber: number;
    subtotal = 0;
    commande: Commande;

    // tslint:disable-next-line:max-line-length
    constructor(public tableService: TableService, private router: Router, public loadingController: LoadingController, public produitService: ProduitService,
                public toastController: ToastController, public route: ActivatedRoute, public modalController: ModalController, public panierService: PanierService) {
        this.table = new Table();
        this.commande = new Commande();
    }

    ngOnInit() {
        this.getTables();
    }

    getTables = async () => {
        const loading = await this.loadingController.create({
            message: 'Loading...'
        });
        await loading.present();
        await this.tableService.getTables()
            .subscribe(async res => {
                this.tableService.tables = res as Table[];
                for (const tab of this.tableService.tables) {
                    tab.status = TableStatus.FREE;
                    await this.getTableStatus(tab);
                }
                console.log(this.tableService.tables);
                await loading.dismiss();
            });
    };

    public async getTableStatus(table: Table) {
        await this.panierService.getCommandeByTable(table).subscribe(res => {
            const cmd = res as Commande;
            if (cmd.ligneCommandes.length > 0 && cmd.complete === false) {
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
            },
            backdropDismiss: false
        });

        modal.onDidDismiss()
            .then((data) => {
                const tableUpdated = data.data as Table; // Here's your selected table!
                // this.getTableStatus(tableUpdated);
                if (this.panierService.commande.ligneCommandes.length > 0 && this.panierService.commande.complete === false) {
                    tableUpdated.status = TableStatus.BUSY;
                }
                this.panierService.commande = new Commande();
            });

        return await modal.present();
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

    async createTable() {
        this.tableService.newTable.noTable = this.tableService.tables.length + 1;
        this.tableService.createTable(this.tableService.newTable).subscribe(res => {
            const newTable = res as Table;
            newTable.status = TableStatus.FREE;
            this.tableService.tables.push(newTable);
            this.tableService.newTable = new Table();
        });
    }

    async deleteTable(table: Table) {
        if (table.status === TableStatus.FREE) {
            this.tableService.deleteTable(table).subscribe(res => {
                Utils.deleteItemFromArray(this.tableService.tables, table);
            });
        }
    }

}
