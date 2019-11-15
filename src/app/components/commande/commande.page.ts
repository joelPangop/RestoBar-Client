import { Component, OnInit } from '@angular/core';
import { CommandeService } from 'src/app/services/commande.service';
import { Commande } from 'src/app/models/commande';
import { DatePipe } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { ShowCommandePage } from '../show-commande/show-commande.page';

@Component({
  selector: 'app-commande',
  templateUrl: './commande.page.html',
  styleUrls: ['./commande.page.scss'],
})
export class CommandePage implements OnInit {

  startTime: Date;
  endTime: Date;
  customPickerOptions: any;

  constructor(public commandeService: CommandeService, public datepipe: DatePipe, public modalController: ModalController) {
    this.startTime = new Date();
    this.endTime = new Date();
    this.customPickerOptions = {
      buttons: [{
        text: 'Save',
        handler: () => console.log('Clicked Save!')
      }, {
        text: 'Log',
        handler: () => {
          console.log('Clicked Log. Do not Dismiss.');
          return false;
        }
      }]
    }
  }

  ngOnInit() {
    this.getAllCommandes();
  }

  async getAllCommandes() {
    await this.commandeService.getAll().subscribe(res => {
      this.commandeService.commandes = res as Commande[];
    })
  }

  async getAllBytime() {
    let latest_startTime = this.datepipe.transform(this.startTime, 'yyyy-MM-dd');
    let latest_endTime = this.datepipe.transform(this.endTime, 'yyyy-MM-dd');
    await this.commandeService.getByTime(latest_startTime, latest_endTime).subscribe(res => {
      this.commandeService.commandes = res as Commande[];
    })
  }

  async showCommande(commande: Commande) {
    const modal = await this.modalController.create({
      component: ShowCommandePage,
      cssClass: 'my-custom-show-commande',
      componentProps: {
        commande: commande
      }
    });
    await modal.present();
  }

}
