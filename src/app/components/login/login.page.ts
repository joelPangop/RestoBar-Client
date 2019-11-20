import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentialsForm: FormGroup;

  subject = '';
  body = '';
  to = 'joelpangop@gmail.com';

  constructor(private formBuilder: FormBuilder, private authService: AuthService,
    private emailComposer: EmailComposer, private msgService: MessageService,
    public navCtrl: NavController, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.credentialsForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6),
      Validators.maxLength(30)]]
    });
  }

  async onSubmit() {
    await this.authService.login(this.credentialsForm.value).subscribe(success => {
      if (success) {
        console.log(success);
        // this.navCtrl.navigateRoot("/");
      }
    });
  }

  register() {
    this.authService.register(this.credentialsForm.value).subscribe(res => {
      // Call Login to automatically login the new user
      this.authService.login(this.credentialsForm.value).subscribe();
    });
  }

  send() {

    this.body = "The user " + this.credentialsForm.value.username + " need a new password"
    let email = {
      to: this.to,
      cc: [],
      bcc: [],
      attachment: [],
      subject: this.subject,
      body: this.body,
      isHtml: true,
      app: 'gmail'
    }

    this.emailComposer.open(email);
  }

  sendMessage(): void {
    this.body = "The user " + this.credentialsForm.value.username + " need a new password"
    // Retrieve the validated form fields
    let to: string = this.to,
      cc: string = "",
      bcc: string = "",
      subject: string = this.subject,
      message: string = this.body;

    // Has the user selected an attachment?
    // if (this._attachment.length > 1) {
      // If so call the sendEmail method of the EmailProvider service, pass in
      // the retrieved form data and watch the magic happen! :)
      this.msgService.sendEmail(to, cc, bcc, '', subject, message);
    // }
    // else {
    //   // Inform the user that they need to add an attachment
    //   this.displayMessage('Error', 'You need to select an attachment');
    // }
  }


  displayMessage(title: string, subTitle: string): void {
    let alert: any = this.alertCtrl.create({
      message: subTitle,
      header: title,
      buttons: ['OK']
    });
    alert.present();
  }

}
