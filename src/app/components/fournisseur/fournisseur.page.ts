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
import {Telephone} from 'src/app/models/telephone';
import {CategorieTelephone} from 'src/app/models/categorie-telephone';

@Component({
    selector: 'app-fournisseur',
    templateUrl: './fournisseur.page.html',
    styleUrls: ['./fournisseur.page.scss'],
})
export class FournisseurPage implements OnInit {

    TypeDepense: typeof TypeDepense = TypeDepense;
    options: string[];
    phoneOptions: string[];
    produits: Produit[];
    productNames: string[];

    constructor(public fournisseurService: FournisseurService, private toastController: ToastController,
                public produitService: ProduitService, public modalController: ModalController) {
        this.produits = [];
        this.productNames = [];
    }

    ngOnInit() {
        this.options = Object.values(TypeProduit);
        this.phoneOptions = Object.values(CategorieTelephone);
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
        if (body.telephones) {
            this.fournisseurService.telephones = body.telephones;
        }
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
            for (const prod of this.produitService.produits) {
                this.productNames.push(prod.nomProduit);
            }
            console.log(this.produitService.produits);
        });
    }

    getProduit(event, prod: Produit) {
        console.log(event.target.value);
        this.produitService.getProduitById(prod.id).subscribe(res => {
            this.produitService.produit = res as Produit;
        });
    }

    deleteProduit(produit: Produit) {
        this.produitService.findCommandeByProduit(produit).subscribe(res => {
            if (res) {
                this.presentToast('Produit assigné à une ou plusieurs commandes');
            } else {
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
        form.value.telephones = this.fournisseurService.telephones;
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
            if (!this.productNames.includes(this.produitService.produit.nomProduit)) {
                this.produitService.createProduit(this.produitService.produit)
                    .subscribe(res => {
                        console.log(res);
                        this.resetForm(form);
                        console.log(res);
                    });
                this.produitService.produits.push(this.produitService.produit);
                form.reset();
            } else {
                this.presentToast('Produit deja existant');
            }
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
        this.fournisseurService.telephones = [];
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

    async addTelephone() {
        if (this.fournisseurService.telephones.length > 0) {
            if (this.fournisseurService.telephones[this.fournisseurService.telephones.length - 1].numeroTelephone !== '') {
                this.fournisseurService.telephones.push(new Telephone());
            }
        } else {
            this.fournisseurService.telephones.push(new Telephone());
        }
    }

    async removeTelephone(telephone: Telephone) {
        const index = this.fournisseurService.telephones.indexOf(telephone, 0);
        if (index > -1) {
            this.fournisseurService.telephones.splice(index, 1);
        }
    }

}
