import { Component, OnInit } from '@angular/core';
import { CommandeService } from 'src/app/services/commande.service';
import { Commande } from 'src/app/models/commande';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-commande',
  templateUrl: './commande.page.html',
  styleUrls: ['./commande.page.scss'],
})
export class CommandePage implements OnInit {

  startTime: Date;
  endTime: Date;

  constructor(public commandeService: CommandeService, public datepipe: DatePipe) {
    this.startTime = new Date();
    this.endTime = new Date();
   }

  ngOnInit() {
    this.getAllCommandes();
  }

  async getAllCommandes() {
    await this.commandeService.getAll().subscribe(res => {
      this.commandeService.commandes = res as Commande[];
    })
  }

  async getAllBytime(){
    let latest_startTime =this.datepipe.transform(this.startTime, 'yyyy-MM-dd');
    let latest_endTime =this.datepipe.transform(this.endTime, 'yyyy-MM-dd');
    await this.commandeService.getByTime(latest_startTime, latest_endTime).subscribe(res => {
      this.commandeService.commandes = res as Commande[];
    })
  }

}
