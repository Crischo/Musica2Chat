import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyAEnGCT9CTj6af9436tBi0dnpDhW1a6IjQ",
  authDomain: "chat3-f6358.firebaseapp.com",
  databaseURL: "https://chat3-f6358.firebaseio.com",
  projectId: "chat3-f6358",
  storageBucket: "",
  messagingSenderId: "169759824186"
  };
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    firebase.initializeApp(config);
  }
}
