import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  constructor(public userService: UserService, public loadingController: LoadingController, public toastController: ToastController, public route: ActivatedRoute, public modalController: ModalController) {

  }

  ngOnInit() {
    this.getUsers()
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

  getUser = async (user: User) => {
    const loading = await this.loadingController.create({
      message: 'Loading...'
    });
    await loading.present();
    this.userService.getUser(user)
      .subscribe(res => {
        this.userService.selectedUser = res as User;
        loading.dismiss();
      });
  };

  saveUser(form: NgForm) {
    if (form.value.id) {
      this.userService.updateUser(this.userService.selectedUser)
        .subscribe(res => {
          console.log(res);
          this.getUsers();
          this.presentToast("User modifié");
        });
    } else {
      this.userService.selectedUser.usernumber = this.getRandomInt();
      this.userService.createUser(this.userService.selectedUser)
        .subscribe(res => {
          console.log(res);
          this.resetForm(form);
          // this.userService.users.push(this.userService.selectedUser);
          this.getUsers();
          this.presentToast("User ajouté");
        });
      this.resetForm(form);
    }
    
  }

  deleteUser(user: User) {
    this.userService.deleteUser(user)
      .subscribe(res => {
        this.presentToast("user deleted");
        this.getUsers();
      })
  }

  resetForm(form?: NgForm) {
    this.userService.selectedUser = new User();
    form.reset();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'middle'

    });
    toast.present();
  }

  getRandomInt() {
    return Math.floor(Math.random() * Math.floor(4000));
  }

}
