import {Injectable} from '@angular/core';
import {Table} from '../models/table';
import {HttpClient} from '@angular/common/http';
import {LigneCommande} from '../models/ligne-commande';

@Injectable({
    providedIn: 'root'
})
export class TableService {
    const;
    URL = 'http://localhost:4000/table';
    tables: Table[];
    newTable: Table;
    ligneCommande: LigneCommande;

    constructor(private http: HttpClient) {
        this.tables = [];
        this.ligneCommande = new LigneCommande();
        this.newTable = new Table();
    }

    getTables() {
        return this.http.get(this.URL);
    }

    createTable(table: Table) {
        return this.http.post(this.URL, table);
    }

    editTable(table: Table) {
        return this.http.put(this.URL + `/${table.id}`, table);
    }

    deleteTable(table: Table) {
        return this.http.delete(this.URL + `/${table.id}`);
    }

}
