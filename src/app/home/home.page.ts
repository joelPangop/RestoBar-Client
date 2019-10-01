import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router,private platform: Platform) {
    this.router.navigateByUrl("/table");
  }

}
