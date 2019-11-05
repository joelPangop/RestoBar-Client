import { Component, OnInit } from '@angular/core';
import { DepenseService } from '../../services/depense.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { FournisseurService } from '../../services/fournisseur.service';
import { TypeDepense } from '../../models/type-depense';
import { Depense } from '../../models/depense';
import { NgForm } from '@angular/forms';
import { Fournisseur } from '../../models/fournisseur';
import { Produit } from '../../models/produit';
import { ProduitAchat } from '../../models/produit-achat';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { DatePipe } from '@angular/common';

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
    endTime: Date;
    startTime: Date;

    constructor(public depenseService: DepenseService, public fournisseurService: FournisseurService,
        private loadingController: LoadingController,
        public userService: UserService, public datepipe: DatePipe,
        private toastController: ToastController) {
        this.produits = [];
        this.achatFournisseurs = [];
    }

    ngOnInit() {
        this.options = Object.values(TypeDepense);
        this.typeDepense = TypeDepense.ACHAT;
        this.nomDepense = this.typeDepense;
        this.getFournisseurs();
        this.achatFournisseurs = new Array();
        this.getDepenses();
        this.getUsers();
    }

    getDepenses() {
        this.achatFournisseurs = [];
        this.depenseService.getDepenses().subscribe(res => {
            this.achatFournisseurs = [];
            this.depenseService.depenses = res as Depense[];
        });
    }

    async getAllBytime() {
        let latest_startTime =this.datepipe.transform(this.startTime, 'yyyy-MM-dd');
        let latest_endTime =this.datepipe.transform(this.endTime, 'yyyy-MM-dd');
        await this.depenseService.getByTime(latest_startTime, latest_endTime).subscribe(res => {
            this.depenseService.depenses = res as Depense[];
        })
    }

    getDepense(body: any) {
        this.depenseService.selectedDepense = body as Depense;
        this.typeDepense = this.depenseService.selectedDepense.typeDepense;
        if (this.typeDepense === TypeDepense.ACHAT) {
            this.getProduitsByFournisseur();
        } else if (this.typeDepense === TypeDepense.SALAIRE) {
            this.getEmployeSalaire();
        }

        this.depenseService.getDepense(this.depenseService.selectedDepense).subscribe(res => {
            let dep = res as Depense;
            this.quantiteTotale = dep.quantite;
            this.montantTotale = dep.montant
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
    getUsers = async () => {
        const loading = await this.loadingController.create({
            message: 'Loading...'
        });
        await loading.present();
        this.userService.getUsers()
            .subscribe(res => {
                this.userService.users = res as User[];
                loading.dismiss();
            });
    };

    compareFunction(c1: Fournisseur, c2: Fournisseur): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }

    compareProdFunction(c1: Produit, c2: Produit): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }

    compareUserFunction(c1: User, c2: User): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }

    getFournisseurs() {
        this.fournisseurService.getfournisseurs().subscribe(res => {
            this.fournisseurService.fournisseurs = res as Fournisseur[];
        });
    }

    getProduitsByFournisseur() {
        this.fournisseurService.getfournisseur(this.depenseService.selectedDepense.fournisseur).subscribe(res => {
            this.depenseService.selectedDepense.fournisseur = res as Fournisseur;
            this.produits = this.depenseService.selectedDepense.fournisseur.produits;
        });
    }

    getEmployeSalaire() {
        this.userService.getUser(this.depenseService.selectedDepense.user).subscribe(res => {
            this.depenseService.selectedDepense.user = res as User;
        });
    }

    createDepense(form: NgForm) {

        // this.montantTotale = 0;
        // this.quantiteTotale = 0

        switch (this.typeDepense) {
            case TypeDepense.SALAIRE:
                this.depenseService.selectedDepense.montant = this.depenseService.selectedDepense.user.salaire;
                this.depenseService.selectedDepense.typeDepense = this.typeDepense;
                break;

            case TypeDepense.ACHAT:
                for (let p of this.depenseService.selectedDepense.produitAchats) {
                    this.montantTotale += p.montant;
                    this.quantiteTotale += parseInt("" + p.quantite);
                }
                this.depenseService.selectedDepense.montant = this.montantTotale;
                this.depenseService.selectedDepense.quantite = this.quantiteTotale;
                this.depenseService.selectedDepense.typeDepense = this.typeDepense;
                this.depenseService.selectedDepense.user = null;
                break;

            case TypeDepense.DIVERS:
                this.depenseService.selectedDepense.typeDepense = this.typeDepense;
                this.depenseService.selectedDepense.user = null;
                break;

        }

        console.log(form.value);
        if (form.value.id) {
            this.depenseService.updateDepense(this.depenseService.selectedDepense, this.typeDepense)
                .subscribe(res => {
                    console.log(res);
                    this.presentToast(res.toString());
                    this.getDepenses();
                });
        } else {
            if (this.typeDepense === TypeDepense.ACHAT) {
                this.achatFournisseurs.forEach(res => {
                    this.depenseService.selectedDepense.produitAchats.push(res as ProduitAchat);
                })
            }
            this.depenseService.selectedDepense.numDepense = this.getRandomInt();
            this.depenseService.selectedDepense.dateDepense = new Date();
            this.depenseService.createDepense(this.depenseService.selectedDepense)
                .subscribe(res => {
                    console.log(res);
                    this.resetForm(form);
                    this.presentToast(res.toString());
                    this.getDepenses();
                });
            this.resetForm(form);
        }

    }

    deleteDepense(depense: Depense) {
        this.depenseService.deleteDepense(depense)
            .subscribe(res => {
                this.presentToast(res.toString());
                this.getDepenses();
            });
    }

    resetForm(form?: NgForm) {
        this.depenseService.selectedDepense = new Depense();
        this.achatFournisseurs = [];
        this.montantTotale = 0
        this.quantiteTotale = 0;
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
            this.quantiteTotale += parseInt("" + m.quantite);
        }
    }

    addProduit() {
        this.achatFournisseurs.push(new ProduitAchat());
    }

    getRandomInt() {
        return Math.floor(Math.random() * Math.floor(30000));
    }
}
