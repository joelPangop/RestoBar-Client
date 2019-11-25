import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, RouterEvent} from '@angular/router';
import {AuthService} from 'src/app/services/auth.service';
import {ToastController, NavController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {UserService} from 'src/app/services/user.service';
import {User} from 'src/app/models/user';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.page.html',
    styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

    // tslint:disable-next-line:ban-types
    username: String = '';

    pages = [];
    selectedPath = '';

    constructor(private authService: AuthService, private storage: Storage, private router: Router,
                private toastController: ToastController, private navCtrl: NavController, private userService: UserService) {
        this.router.events.subscribe((event: RouterEvent) => {
            if (event && event.url) {
                this.selectedPath = event.url;
            }
        });
    }

    ngOnInit() {
        this.getUser();
        this.ionViewWillEnter();
    }

    getUser() {
        this.userService.getUser(this.authService.user.userId).subscribe(res => {
            this.authService.currentUser = res as User;
            this.authService.isAdmin();
        });
    }

    ionViewWillEnter() {
        if (this.authService.isAdmin()) {
            this.pages = [
                {
                    title: 'Tables',
                    url: '/menu/table'
                },
                {
                    title: 'Depenses',
                    url: '/menu/depense'
                },
                {
                    title: 'Utilisateurs',
                    url: '/menu/user'
                },
                {
                    title: 'Commandes',
                    url: '/menu/commande'
                },
                {
                    title: 'Fournisseurs',
                    url: '/menu/fournisseur'
                },
                {
                    title: 'Commandes par table',
                    url: '/menu/table-commande'
                },
                {
                    title: 'Profile',
                    url: '/menu/profile'
                }
            ];
        } else {
            this.pages = [
                {
                    title: 'Tables',
                    url: '/menu/table'
                },
                {
                    title: 'Profile',
                    url: '/menu/profile'
                }
            ];
        }
        this.username = this.authService.currentUser.username;
    }

    ionViewCanEnter() {
        return this.authService.isAuthenticated();
    }

    logout() {
        this.authService.logout();
        this.clearToken();
    }


    clearToken() {
        // ONLY FOR TESTING!
        this.storage.remove('access_token');

        let toast = this.toastController.create({
            message: 'JWT removed',
            duration: 3000
        });
        toast.then(toast => toast.present());
    }

    openPage(page) {
        this.storage.set('page', page.url);
        this.router.navigate([page.url]);
    }

}
