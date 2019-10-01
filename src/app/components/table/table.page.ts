import {Component, OnInit} from '@angular/core';
import {TableService} from '../../services/table.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingController, ModalController, ToastController} from '@ionic/angular';
import {Table} from '../../models/table';
import {CreateCommandePageModule} from '../create-commande/create-commande.module';
import {ProduitService} from '../../services/produit.service';
import {CreateCommandePage} from '../create-commande/create-commande.page';
import {Produit} from '../../models/produit';

@Component({
    selector: 'app-table',
    templateUrl: './table.page.html',
    styleUrls: ['./table.page.scss'],
})
export class TablePage implements OnInit {

    constructor(public tableService: TableService, private router: Router, public loadingController: LoadingController, public produitService: ProduitService,
                public toastController: ToastController, public route: ActivatedRoute, public modalController: ModalController) {
    }

    ngOnInit() {
        this.getTables();
        this.getAllProduits();
    }

    getTables = async () => {
        const loading = await this.loadingController.create({
            message: 'Loading...'
        });
        await loading.present();
        this.tableService.getTables()
            .subscribe(res => {
                this.tableService.tables = res as Table[];
                console.log(this.tableService.tables);
                loading.dismiss();
            });
    };

    async createCommand(table: Table) {
        const modal = await this.modalController.create({
            component: CreateCommandePage,
            componentProps: {
                produits: this.produitService.produits,
                table: table as Table
            }
        });
        await modal.present();
    }

    async getAllProduits() {
        this.produitService.getAll()
            .subscribe(res => {
                this.produitService.produits = res as Produit[];
                console.log(this.produitService.produits);
            });
    }
}
