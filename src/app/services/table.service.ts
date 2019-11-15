import { Injectable } from '@angular/core';
import { Table } from '../models/table';
import { HttpClient } from '@angular/common/http';
import { LigneCommande } from '../models/ligne-commande';

@Injectable({
    providedIn: 'root'
})
export class TableService {
    const;
    URL = 'http://localhost:4000/table';
    tables: Table[];
    ligneCommande: LigneCommande;

    constructor(private http: HttpClient) {
        this.tables = [];
        this.ligneCommande = new LigneCommande();
    }

    getTables() {
        return this.http.get(this.URL);
    }
    
}
