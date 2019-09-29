import {Injectable} from '@angular/core';
import {Table} from '../models/table';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TableService {
    const;
    URL = 'http:localhost//4000/table';
    tables: Table[];

    constructor(private http: HttpClient) {
        this.tables = [];
    }

    getTables() {
        return this.http.get(this.URL);
    }
}
