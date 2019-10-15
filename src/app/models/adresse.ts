export class Adresse {
    construction() {
        this.nomRue = '';
        this.appNum = 0;
        this.compte = '';
        this.ville = '';
        this.region = '';
        this.pays = '';
    }

    id: number;
    nomRue: string;
    appNum: number;
    compte: string;
    ville: string;
    region: string;
    pays: string;
}
