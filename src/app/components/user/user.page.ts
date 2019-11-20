import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { LoadingController, ModalController, ToastController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { NgForm } from '@angular/forms';
import { Adresse } from 'src/app/models/adresse';
import { CategorieTelephone } from 'src/app/models/categorie-telephone';
import { Telephone } from 'src/app/models/telephone';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { RoleType } from 'src/app/models/role-type';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  options: string[];
  pdfObj = null;
  roleopts: String[];

  constructor(public userService: UserService, public loadingController: LoadingController, private plt: Platform, private file: File,
    private fileOpener: FileOpener,
    public toastController: ToastController, public route: ActivatedRoute, public modalController: ModalController) {

  }

  ngOnInit() {
    this.options = Object.keys(CategorieTelephone);
    this.roleopts = Object.keys(RoleType);
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
    this.userService.getUser(user.id)
      .subscribe(res => {
        this.userService.selectedUser = res as User;
        if (this.userService.selectedUser.adresse)
          this.userService.adresse = this.userService.selectedUser.adresse as Adresse;
        loading.dismiss();
      });
  };

  saveUser(form: NgForm) {
    this.userService.selectedUser.adresse = this.userService.adresse;
    this.userService.selectedUser.telephones = this.userService.telephones;
    if (form.value.id) {
      this.userService.updateUser(this.userService.selectedUser)
        .subscribe(res => {
          console.log(res);
          this.getUsers();
          this.presentToast("User modifié");
        });
    } else {
      this.userService.selectedUser.usernumber = this.getRandomInt();
      this.userService.selectedUser.password = "123456";
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
    this.userService.adresse = new Adresse();
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

  async addTelephone() {
    if (this.userService.telephones[this.userService.telephones.length - 1].numeroTelephone !== '') {
      this.userService.telephones.push(new Telephone());
    }
  }

  async removeTelephone(telephone: Telephone) {
    const index = this.userService.telephones.indexOf(telephone, 0);
    if (index > -1) {
      this.userService.telephones.splice(index, 1);
    }
  }

  async createPdf() {
    var docDefinition = {
      title: 'Informations personnelles',
      content: [
        { text: 'INFORMATIONS PERSONELLES', style: 'header' },
        { text: 'Noms: ', margin: [0, 10, 0, 0] },
        { text: 'Prenoms: ', margin: [0, 10, 0, 0] },
        { text: 'Username',  margin: [0, 10, 0, 0] },
        { text: 'Age',  margin: [0, 10, 0, 0] },
        { text: 'Adresse', style: 'subheader' },
        { text: 'Rue: ', margin: [0, 10, 0, 0] },
        { text: 'Compté: ', margin: [0, 10, 0, 0] },
        { text: 'Ville: ', margin: [0, 10, 0, 0] },
        { text: 'Region: ', margin: [0, 10, 0, 0] },
        { text: 'Pays: ', margin: [0, 10, 0, 0] },
        { text: 'Telephone', style: 'subheader' },
        {
          ul: [
            'Cellulaire: ',
            'Fix home:',
            'Bureau:',
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        }
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.downloadPdf();
  }

  async downloadPdf() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'myletter.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }

}
