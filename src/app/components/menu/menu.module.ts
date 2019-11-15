import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      { path: 'table', loadChildren: '../table/table.module#TablePageModule' },
      { path: 'produit', loadChildren: '../produit/produit.module#ProduitPageModule' },
      { path: 'commande', loadChildren: '../commande/commande.module#CommandePageModule' },
      { path: 'user', loadChildren: '../user/user.module#UserPageModule' },
      { path: 'fournisseur', loadChildren: '../fournisseur/fournisseur.module#FournisseurPageModule' },
      { path: 'depense', loadChildren: '../depense/depense.module#DepensePageModule' },
      { path: 'table-commande', loadChildren: '../table-commande/table-commande.module#TableCommandePageModule' },
      { path: 'profile', loadChildren: '../profile/profile.module#ProfilePageModule' }

    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuPageModule { }