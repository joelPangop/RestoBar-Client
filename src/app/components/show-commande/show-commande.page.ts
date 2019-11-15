import { Component, OnInit } from '@angular/core';
import { Commande } from 'src/app/models/commande';
import { NavParams } from '@ionic/angular';
import { LigneCommande } from 'src/app/models/ligne-commande';

@Component({
  selector: 'app-show-commande',
  templateUrl: './show-commande.page.html',
  styleUrls: ['./show-commande.page.scss'],
})
export class ShowCommandePage implements OnInit {

  commande: Commande;
  ligneCommandes: LigneCommande[];

  constructor(public navParams: NavParams) {
    this.commande = this.navParams.get('commande');
    this.ligneCommandes = this.navParams.get('ligneCommandes');
    console.log(this.ligneCommandes);
   }

  ngOnInit() {
  }

}
