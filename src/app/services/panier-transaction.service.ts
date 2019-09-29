import {Injectable} from '@angular/core';
import {Request, Response} from 'express';
import {LigneCommande} from '../models/ligne-commande';
import {Session} from 'protractor';
import {GestionPanier} from './gestion-panier';
import {ProduitPanier} from '../models/produit-panier';
import {Produit} from '../models/produit';
import {Table} from '../models/table';
import {ProduitService} from './produit.service';
import {CommandeService} from './commande.service';
import {Commande} from '../models/commande';

@Injectable({
    providedIn: 'root'
})
export class PanierTransactionService {

    constructor(private produitService: ProduitService, private commandeService: CommandeService) {
    }

    updatePanier(lignecmd: LigneCommande, operation: string) {

        switch (operation) {
            case 'ajouter':
                GestionPanier.ajouter(this.getPanier(), lignecmd);
                break;
            case 'enlever':
                GestionPanier.enlever(this.getPanier(), lignecmd);
                break;
            case 'vider':
                GestionPanier.supprimer(this.getPanier(), lignecmd);
                break;
            default:
                break;
        }
        sessionStorage.setAttribute('panier', this.getPanier());
    }

    public getPanier() {
        let panier: Map<number, LigneCommande> = null;

        if (sessionStorage.getItem('panier') == null) {
            panier = new Map<number, LigneCommande>();
            sessionStorage.setAttribute('panier', panier);
        } else {
            panier = sessionStorage.getAttribute('panier') as Map<number, LigneCommande>;
            console.log(panier.size);
        }
        return panier;
    }

    public viderPanier() {
        const panier: Map<number, LigneCommande> = this.getPanier();
        GestionPanier.vider(panier);
    }

    public getNbArticles() {
        const panier: Map<number, LigneCommande> = this.getPanier();
        sessionStorage.setAttribute('nbArticles', GestionPanier.nbArticles(panier));
    }

    public async getPanierProduits() {
        let listPanierProds: ProduitPanier[] = null;
        let montant = 0;
        const panier: Map<number, LigneCommande> = this.getPanier();

        if (panier != null) {
            listPanierProds = new Array();

            for (const [key, value] of panier.entries()) {
                let prod: Produit = null;
                await this.produitService.getProduitById(key).subscribe(res => {
                    prod = res as Produit;
                });
                const cmd: LigneCommande = value;
                const panierProd: ProduitPanier = new ProduitPanier();
                panierProd.produitModel = prod;
                panierProd.titre = prod.nomProduit;
                panierProd.type = prod.type;
                panierProd.quantite = cmd.quantite;
                panierProd.prix = prod.prix;

                montant += prod.prix * cmd.quantite;
                panierProd.montant = montant;
                listPanierProds.push(panierProd);
            }
        }
        return listPanierProds;
    }

    public getPanierProduitsList() {
        let listPanierProds: ProduitPanier[] = null;
        let montant = 0;
        const panier: Map<number, LigneCommande> = new Map<number, LigneCommande>();

        const table: Table = new Table();
        let commandes: Commande[] = null;
        this.commandeService.getCmdByUserId(table.id).subscribe(res => {
            commandes = res as Commande[];
        });
        for (const c of commandes) {
            let ldcs: LigneCommande[] = null;
            this.commandeService.getLdcBycmd(c.id).subscribe(res => {
                ldcs = res as LigneCommande[];
            });
            for (const l of ldcs) {
                panier.set(l.produit.id, l);
            }
        }
        sessionStorage.setAttribute('panier', panier);
        if (panier != null) {
            listPanierProds = [];

            for (const [key, value] of panier.entries()) {
                let p: Produit = null;
                this.produitService.getProduitById(key).subscribe(res => p = res as Produit);
                const cmd: LigneCommande = value;
                const panierProd: ProduitPanier = new ProduitPanier();
                panierProd.produitModel = p;

                panierProd.titre = p.nomProduit;
                panierProd.type = p.type;
                panierProd.quantite = cmd.quantite;
                panierProd.prix = p.prix;

                montant += p.prix * cmd.quantite;
                panierProd.montant = montant;
                panierProd.prix = p.prix;

                listPanierProds.push(panierProd);
            }
        }

        return listPanierProds;
    }

    public getSubTotal() {
        let subtotal = 0;

        const listPanierProds: ProduitPanier[] = this.getPanierProduitsList();

        if (listPanierProds != null) {
            for (const p of listPanierProds) {
                subtotal += p.quantite * p.prix;
            }
        }
        return subtotal;
    }
}
