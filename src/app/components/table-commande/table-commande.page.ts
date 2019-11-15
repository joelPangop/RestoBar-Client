import { Component, OnInit } from '@angular/core';
import { TableService } from 'src/app/services/table.service';
import { CommandeService } from 'src/app/services/commande.service';
import { Table } from 'src/app/models/table';
import { Commande } from 'src/app/models/commande';
import { LigneCommande } from 'src/app/models/ligne-commande';
import { DatePipe } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { ShowCommandePage } from '../show-commande/show-commande.page';

@Component({
  selector: 'app-table-commande',
  templateUrl: './table-commande.page.html',
  styleUrls: ['./table-commande.page.scss'],
})
export class TableCommandePage implements OnInit {

  commandes: Commande[];
  someSet: Commande[] = [];

  ligneCommandes: LigneCommande[];

  cmdMap: Map<Commande, LigneCommande>;

  commandesByTable: Commande[];

  constructor(private tableService: TableService, private commandeService: CommandeService,
    public datepipe: DatePipe, public modalController: ModalController) {
    this.commandes = [];
    this.cmdMap = new Map<Commande, LigneCommande>();
    this.commandesByTable = [];
  }

  ngOnInit() {
    this.getTables();
  }

  getTables() {
    this.tableService.getTables().subscribe(res => {
      this.tableService.tables = res as Table[];
    })
  }

  getCommandes(table: Table) {
    this.commandesByTable = [];
    this.cmdMap = new Map<Commande, LigneCommande>();
    this.someSet = []

    this.commandeService.getCmdByTable(table.id).subscribe(res => {
      let ldc = res as LigneCommande[];
      for (let l of ldc) {
        this.cmdMap.set(l.commande, l);
        this.someSet.push(l.commande);
        l.commande.ligneCommandes = ldc;
      }
      for (let cmd of this.cmdMap.keys())
        this.commandesByTable.push(cmd);

      var obj = {};

      for (var i = 0, len = this.someSet.length; i < len; i++)
        obj[this.someSet[i]['numCmd']] = this.someSet[i];

      this.someSet = new Array();
      for (var key in obj)
        this.someSet.push(obj[key]);
    })
  }

  async showCommande(commande: Commande) {
    let ldc = this.cmdMap.get(commande);
    const modal = await this.modalController.create({
      component: ShowCommandePage,
      cssClass: 'my-custom-show-commande',
      componentProps: {
        commande: commande,
        ligneCommandes: commande.ligneCommandes
      }
    });
    await modal.present();
  }

}
