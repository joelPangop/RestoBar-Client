import { Component } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  constructor(private router: Router) {

      // this.router.navigateByUrl("/menu");
  }

}
