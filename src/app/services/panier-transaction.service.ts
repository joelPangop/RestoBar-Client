import {Injectable} from '@angular/core';
import {LigneCommande} from '../models/ligne-commande';
import {GestionPanier} from './gestion-panier';
import {ProduitPanier} from '../models/produit-panier';
import {Produit} from '../models/produit';
import {Table} from '../models/table';
import {ProduitService} from './produit.service';
import {CommandeService} from './commande.service';
import {Commande} from '../models/commande';
import {Storage} from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class PanierTransactionService {

    panier: Map<number, LigneCommande> = new Map<number, LigneCommande>();

    constructor(private produitService: ProduitService, private commandeService: CommandeService, private  storage: Storage) {
        this.panier = new Map<number, LigneCommande>();
    }

    public async updatePanier(lignecmd: LigneCommande, operation: string, produitToStock: Produit) {
        switch (operation) {
            case 'ajouter':
                this.getPanier().then(res => {
                    GestionPanier.ajouter(res as Map<number, LigneCommande>, lignecmd, produitToStock);
                    this.panier = res;
                    sessionStorage.setItem('panier', JSON.stringify(this.strMapToObj(this.panier)));
                });
                break;
            case 'enlever':
                this.getPanier().then(res => {
                    GestionPanier.enlever(res as Map<number, LigneCommande>, lignecmd, produitToStock);
                    this.panier = res;
                    sessionStorage.setItem('panier', JSON.stringify(this.strMapToObj(this.panier)));
                });
                break;
            case 'vider':
                this.getPanier().then(res => {
                    GestionPanier.supprimer(res as Map<number, LigneCommande>, lignecmd, produitToStock);
                    this.panier = res;
                    sessionStorage.setItem('panier', JSON.stringify(this.strMapToObj(this.panier)));
                });
                break;

            case 'enleverDuPanier':
                this.getPanier().then(res => {
                    res.delete(produitToStock.id);
                    this.panier = res;
                    sessionStorage.setItem('panier', JSON.stringify(this.strMapToObj(this.panier)));
                });
                break;
            default:
                break;
        }
    }
     strMapToObj(strMap) {
        let obj = Object.create(null);
        for (let [k,v] of strMap) {
            // We don’t escape the key '__proto__'
            // which can cause problems on older engines
            obj[k] = v;
        }
        return obj;
    }
     objToStrMap(obj) {
        let strMap = new Map<number, LigneCommande>();
        for (let k of Object.keys(obj)) {
            strMap.set(+k, obj[k]);
        }
        return strMap;
    }

    jsonToStrMap(jsonStr) {
        return this.objToStrMap(JSON.parse(jsonStr));
    }
    public async getPanier() {
        let panier: Map<number, LigneCommande> = null;
        if (sessionStorage.getItem('panier')) {
            const sessionPanier = this.jsonToStrMap(sessionStorage.getItem('panier')) as Map<number, LigneCommande>;
            panier = sessionPanier;
            console.log(panier.size);
        } else {
            panier = new Map<number, LigneCommande>();
        }
        return panier;
    }

    public async viderPanier() {
        const panier: Map<number, LigneCommande> = await this.getPanier();
        GestionPanier.vider(panier);
    }

    public async getNbArticles() {
        const panier: Map<number, LigneCommande> = await this.getPanier();
        await sessionStorage.setItem('nbArticles', JSON.stringify(this.strMapToObj(GestionPanier.nbArticles(panier))));
    }

    public async getPanierProduits() {
        let listPanierProds: ProduitPanier[] = null;
        let montant = 0;
        const panier: Map<number, LigneCommande> = await this.getPanier();

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
        sessionStorage.setItem('panier', JSON.stringify(this.strMapToObj(panier.entries())));
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

    public getSubTotal(ligneCommandes: LigneCommande[]) {
        let subtotal: number = 0;
        if (ligneCommandes != null) {
            for (const p of ligneCommandes) {
                subtotal += p.quantite * p.produit.prix;
            }
        }
        return subtotal;
    }
}
