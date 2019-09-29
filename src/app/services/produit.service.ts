import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  URL_API = 'http://localhost:4000/produit';

  constructor(private http: HttpClient) { }

  getProduitById(id: number) {
    const url = this.URL_API + '/' + id;
    return this.http.get(url);
}
}
