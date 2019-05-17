import { Component, OnInit } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  password: String = '';
  email: String = '';
  busy: Promise<any>;
  esperando: boolean;

  constructor(public toastController: ToastController, public authDataServise: AuthService, public router: Router) { }

  ngOnInit() {
    this.email = '';
    this.password = '';
    this.esperando = false;
  }

  login() {
    if ( !this.esperando ) {
      this.esperando = true;
      this.busy = this.authDataServise.login(this.email, this.password).then( r => {
        this.esperando = false;
        if (r.idRol === 0) {
          this.presentToastWithOptions('Credenciales Incorrectos', 'middle', 'Aceptar', 'danger').then(
            r_rollNull => {
              r_rollNull.onDidDismiss().then( r2 => {
                sessionStorage.clear();
                this.router.navigate(['/login']);
              });
            }
          );
        } else {
          sessionStorage.setItem('isLoggedin', 'true');
          const userData = { idRol: r.idRol, Persona: r.Persona };
          sessionStorage.setItem('user', JSON.stringify(userData));
          this.router.navigate(['/main']);
        }
      }).catch( e => {
        this.esperando = false;
        this.presentToastWithOptions('Credenciales Incorrectos', 'middle', 'Aceptar', 'danger').then(
          r => {
            r.onDidDismiss().then( r2 => {
              sessionStorage.clear();
              this.router.navigate(['/login']);
            });
          }
        );
      });
    }
  }

  async presentToastWithOptions(message, position, closeButtonText, color) {
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: true,
      position: position,
      color: color,
      closeButtonText: closeButtonText
    });
    toast.present();
    return toast;
  }
}
