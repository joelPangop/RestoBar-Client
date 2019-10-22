import {Component, OnInit} from '@angular/core';
import {DepenseService} from '../../services/depense.service';
import {ToastController} from '@ionic/angular';
import {FournisseurService} from '../../services/fournisseur.service';
import {TypeDepense} from '../../models/type-depense';
import {Depense} from '../../models/depense';
import {NgForm} from '@angular/forms';
import {Fournisseur} from '../../models/fournisseur';
import {Produit} from '../../models/produit';
import {ProduitAchat} from '../../models/produit-achat';

@Component({
    selector: 'app-depense',
    templateUrl: './depense.page.html',
    styleUrls: ['./depense.page.scss'],
})
export class DepensePage implements OnInit {

    typeDepense: TypeDepense;
    options: string[];
    produits: Produit[];
    achatFournisseurs: ProduitAchat[];
    quantiteTotale: number = 0;
    montantTotale: number = 0;
    nomDepense: string;

    constructor(public depenseService: DepenseService, public fournisseurService: FournisseurService, private toastController: ToastController) {
        this.produits = [];
        this.achatFournisseurs = [];
    }

    ngOnInit() {
        this.options = Object.values(TypeDepense);
        this.typeDepense = TypeDepense.ACHAT;
        this.nomDepense = this.typeDepense;
        this.getFournisseurs();
        this.getDepenses();
    }

    getDepenses() {
        this.depenseService.getDepenses(this.typeDepense).subscribe(res => {
            this.depenseService.depenses = res as Depense[];
        });
    }

    getDepense(body: any) {
        this.depenseService.selectedDepense = body as Depense;
        this.typeDepense = this.depenseService.selectedDepense.typeDepense;
        this.getProduitsByFournisseur();
        this.depenseService.getDepense(this.depenseService.selectedDepense, this.typeDepense).subscribe(res =>{
            let dep = res as Depense;
            this.depenseService.selectedDepense = dep;
            this.achatFournisseurs = dep.produitAchats;
        });
        let mnt = this.depenseService.selectedDepense.montant;
        // for(let prod of this.produits){
        //     let prodAchat: ProduitAchat = new ProduitAchat();
        //     prodAchat.produit = prod;
        //     mnt-=(prodAchat.quantite * prodAchat.quantite);
        //     this.achatFournisseurs.push(prodAchat);
        // }
        // this.achatFournisseurs.forEach(e =>{ this.getMontant(e)});
    }

    compareFunction(c1: Fournisseur, c2: Fournisseur): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }

    compareProdFunction(c1: Produit, c2: Produit): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }

    getFournisseurs() {
        this.fournisseurService.getfournisseurs().subscribe(res => {
            this.fournisseurService.fournisseurs = res as Fournisseur[];
        });
    }

    getProduitsByFournisseur() {
        this.fournisseurService.getfournisseur(this.depenseService.selectedDepense.fournisseur).subscribe(res =>{
            this.depenseService.selectedDepense.fournisseur = res as Fournisseur;
            this.produits = this.depenseService.selectedDepense.fournisseur.produits;
        });

    }

    createDepense(form: NgForm) {
        // for(let prdAchat of this.achatFournisseurs){
        //     // let produit = new Produit();
        //     // produit = prdAchat.produit;
        //     this.depenseService.selectedDepense.produitAchats.push(prdAchat);
        // }
        this.montantTotale = 0;
        this.quantiteTotale = 0
        for(let p of this.depenseService.selectedDepense.produitAchats){
            this.montantTotale+=p.montant;
            this.quantiteTotale+=parseInt(""+p.quantite);
        }
        this.depenseService.selectedDepense.montant = this.montantTotale;
        this.depenseService.selectedDepense.quantite = this.quantiteTotale;
        this.depenseService.selectedDepense.typeDepense = this.typeDepense;
        console.log(form.value);
        if (form.value.id) {
            this.depenseService.updateDepense(this.depenseService.selectedDepense, this.typeDepense)
                .subscribe(res => {
                    console.log(res);
                    this.presentToast(res.toString());
                });
        } else {
            this.depenseService.selectedDepense.numDepense = this.getRandomInt();
            this.depenseService.selectedDepense.dateDepense = new Date();
            this.depenseService.createDepense(this.depenseService.selectedDepense)
                .subscribe(res => {
                    console.log(res);
                    this.resetForm(form);
                    this.presentToast(res.toString());
                });
            this.resetForm(form);
        }
    }

    deleteDepense(depense: Depense) {
        this.depenseService.deleteDepense(this.typeDepense, depense);
    }

    resetForm(form?: NgForm) {
        this.depenseService.selectedDepense = new Depense();
        form.reset();
    }

    async presentToast(msg: string) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000,
            cssClass: '.my-custom-toast-css',
            position: 'middle',
            color: '#771d19'
        });
        toast.present();
    }

    getMontant(produit: ProduitAchat) {
        this.montantTotale = 0;
        this.quantiteTotale = 0;
        produit.montant = produit.quantite * produit.produit.prix;
        this.getTotalMontant();
        this.getTotalQuantite();
    }

    getTotalMontant() {
        for (let m of this.achatFournisseurs) {
            this.montantTotale += m.montant;
        }
    }

    getTotalQuantite() {
        for (let m of this.achatFournisseurs) {
            this.quantiteTotale += parseInt(""+m.quantite);
        }
    }

    addProduit() {
        this.achatFournisseurs.push(new ProduitAchat());
    }

    getRandomInt() {
        return Math.floor(Math.random() * Math.floor(30000));
    }
}
