import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'table', loadChildren: './components/table/table.module#TablePageModule' },
  { path: 'produit', loadChildren: './components/produit/produit.module#ProduitPageModule' },
  { path: 'commande', loadChildren: './components/commande/commande.module#CommandePageModule' },
  { path: 'user', loadChildren: './components/user/user.module#UserPageModule' },
  { path: 'edituser/:id', loadChildren: './components/edituser/edituser.module#EdituserPageModule' },
  { path: 'create-commande', loadChildren: './components/create-commande/create-commande.module#CreateCommandePageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
