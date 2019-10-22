import {Component, OnInit} from '@angular/core';
import {FournisseurService} from '../../services/fournisseur.service';
import {TypeDepense} from '../../models/type-depense';
import {Fournisseur} from '../../models/fournisseur';
import {NgForm} from '@angular/forms';
import {ModalController, ToastController} from '@ionic/angular';
import {Adresse} from '../../models/adresse';
import {ProduitService} from '../../services/produit.service';
import {Produit} from '../../models/produit';
import {TypeProduit} from '../../models/type-produit';

@Component({
    selector: 'app-fournisseur',
    templateUrl: './fournisseur.page.html',
    styleUrls: ['./fournisseur.page.scss'],
})
export class FournisseurPage implements OnInit {

    TypeDepense: typeof TypeDepense = TypeDepense;
    options: string[];
    produits: Produit[];

    constructor(private fournisseurService: FournisseurService, private toastController: ToastController,
                private produitService: ProduitService, public modalController: ModalController) {
        this.produits = [];
    }

    ngOnInit() {
        this.options = Object.values(TypeProduit);
        this.getAllProduits();
        this.getFournisseurs();
    }

    compareFunction(c1: Produit, c2: Produit): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }

    getFournisseurs() {
        this.fournisseurService.getfournisseurs()
            .subscribe(res => {
                this.fournisseurService.fournisseurs = res as Fournisseur[];
                console.log(this.fournisseurService.fournisseurs);
            });
    }

    getFournisseur(body: any) {
        this.fournisseurService.selectedFournisseur = body as Fournisseur;
        this.fournisseurService.adresse = body.adresse;
    }

    deleteFournisseur(body: Fournisseur) {
        this.fournisseurService.deleteFournisseur(body)
            .subscribe(res => {
                this.fournisseurService.fournisseurs = res as Fournisseur[];
            });
    }

    async getAllProduits() {
        await this.produitService.getAll().subscribe(res => {
            this.produitService.produits = res as Produit[];
            console.log(this.produitService.produits);
        });
    }

    getProduit(event, prod: Produit) {
        console.log(event.target.value);
        this.produitService.getProduitById(prod.id).subscribe(res => {
            this.produitService.produit = res as Produit;
        });
    }

    deleteProduit(produit: Produit){
        this.produitService.findCommandeByProduit(produit).subscribe(res =>{
            if(res){
                this.presentToast("Produit assigné à une ou plusieurs commandes");
            }else {
                this.produitService.deleteProduit(produit).subscribe(res => {
                    console.log(res);
                    let arr = this.produitService.produits;
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].id === produit.id) {
                            arr.splice(i, 1);
                            i--;
                        }
                    }
                    this.resetProduit();
                });
            }
        });
    }

    addFournisseur(form: NgForm) {
        console.log(form.value);
        if (form.value.id) {
            this.fournisseurService.updateFournisseur(form.value)
                .subscribe(res => {
                    console.log(res);
                    this.resetForm(form);
                    this.presentToast('Updated Successfully');
                });
        } else {
            this.fournisseurService.createFournisseur(form.value)
                .subscribe(res => {
                    console.log(res);
                    this.resetForm(form);
                    this.presentToast('Save Successfully');
                });
            this.resetFournisseur();
        }
    }

    addProduit(form: NgForm) {
        console.log(form.value);
        if (this.produitService.produit.id) {
            this.produitService.editProduit(this.produitService.produit)
                .subscribe(res => {
                    console.log(res);
                    this.resetForm(form);
                    this.presentToast('Updated Successfully');
                });
        } else {
            this.produitService.createProduit(this.produitService.produit)
                .subscribe(res => {
                    console.log(res);
                    this.resetForm(form);
                    console.log(res);
                });
            this.produitService.produits.push(this.produitService.produit);
            form.reset();
        }
    }

    resetForm(form?: NgForm) {
        this.fournisseurService.selectedFournisseur = new Fournisseur();
        this.fournisseurService.adresse = new Adresse();
    }

    resetFournisseur() {
        this.fournisseurService.selectedFournisseur = new Fournisseur();
        this.fournisseurService.adresse = new Adresse();
        this.produitService.produit = new Produit();
    }

    resetProduit() {
        this.produitService.produit = new Produit();
    }

    async presentToast(msg: string) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000,
            position: 'middle',
            color: 'transparent'
        });
        toast.present();
    }

}
