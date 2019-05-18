import { AuthService } from "./../../services/auth.service";
import { Router } from "@angular/router";
import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Http } from "@angular/http";
import { AlertController } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule
} from "@angular/forms";
import { ToastController, NavController, NavParams } from "@ionic/angular";
import { saveAs } from "file-saver/FileSaver";
//clases
import { ClasePersona } from "../../clases/Clase-Persona";
import { Salas } from "../../clases/salas";

// Servicio
import { SalasService } from "../../services/salas.service";
// instancia a la Base de datos
import * as firebase from "firebase";

@Component({
  selector: "app-main",
  templateUrl: "./main.page.html",
  styleUrls: ["./main.page.scss"]
})
export class MainPage implements OnInit {
  @ViewChild("fileInput") fileInput;
  @ViewChild("refresh") refresh;
  
  user: any;
  srcFoto: string;

  userName: string = "";
  srcFotoPerfil: string = "";

  form: FormGroup;

  fotoNombre: string = "";
  fotoType: string = "";
  fotoFile: any = "";
  fotoArchivo: string = "";
  message: string = "";
  messages = [];
  messagesRef: any;

  salaElegida: any = "yavirac";

  salas: Salas[] = [];

  constructor(
    public navCtrl: NavController,
    private http: Http,
    public alertController: AlertController,
    private salaService: SalasService
  ) {
    this.user = JSON.parse(sessionStorage.getItem("user")).Persona;
    this.userName =
      this.user.nombre1 +
      " " +
      this.user.nombre2 +
      " " +
      this.user.apellido1 +
      " " +
      this.user.apellido2;
    console.log(this.userName);
    this.salaService
      .getSalas(this.user.id)
      .then(r => {
        this.salas = JSON.parse(r) as Salas[];
        console.log("salas " + this.salas[0]);
      })
      .catch(e => console.log(e));


  }

 writeMessage() {
   this.presentAlertPrompt();
 }
verifyImage() {
  if (this.fotoFile === '' || this.fotoFile === null) {
    return 'Sin Adjunto';
  }
  if (this.fotoType.split('/')[0] === 'image') {
    return '<img src="data:' + this.fotoType + ';base64,' + this.fotoFile + '" width="100px" height="100px">'
  } else {
    return '<img src="./../../../assets/google_docs-logo2.jpg" width="64px" height="auto">';
  }
}

 async presentAlertPrompt() {
  const alert = await this.alertController.create({
    header: 'Mensaje Nuevo',
    message: this.verifyImage(),
    inputs: [
      {
        name: 'message',
        id: 'message',
        type: 'text',
        placeholder: 'Escriba su mensaje',
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      },
      {
        text: 'Enviar',
        handler: data => {
          this.message = data.message;
          this.sendMessage();
        }
      }
    ]
  });

  await alert.present();
}

eliminarAdjunto() {
  this.fotoNombre = "";
  this.fotoType = "";
  this.fotoFile = "";
  this.fotoArchivo = "";
}

adjuntarArchivo() {
  this.fileInput.nativeElement.click();
}

  checkForMessages() {
      
  
  this.messagesRef = firebase
    .database()
    .ref("/mensajes")
    .orderByChild("salaID")
    .equalTo(this.salaElegida);
    this.messagesRef.on("value", snap => {
        let data = snap.val();
        this.getMessages();
        console.log("cambio en BDD");
        if ( typeof this.refresh !== 'undefined') {
            this.refresh.nativeElement.click();
        }
    });

    if ( typeof this.refresh !== 'undefined') {
      this.refresh.nativeElement.click();
  }
}

refrescandoSala(): Boolean {
  const refrescarSala = JSON.parse(sessionStorage.getItem("refrescarSala"));
  if ( refrescarSala) {
    sessionStorage.setItem("refrescarSala", JSON.stringify(false));
    this.isSalaSelected();
    return false;
  } else {
    return false;
  }
}

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem("user")).Persona;

  }

  CodificarArchivo(event) {
    const reader = new FileReader();
    //dgsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
    console.log("tamaño "+event.target.files[0].size);
    if(event.target.files[0].size>7340032){
alert("El archivo es muy pesado ");
    }else{
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.fotoNombre = file.name;
          this.fotoType = file.type;
          this.fotoFile = reader.result.toString().split(",")[1];
          this.srcFoto = this.fotoFile;
          this.writeMessage();
        };
      }
    }
   
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get("avatar").setValue({
          filename: file.name,
          filetype: file.type,

          value: reader.result.toString().split(",")[1]
        });
      };
      console.log("tipo de archivo " + file.type);
    }
  }

  getMessages() {
   
   // this.salaElegida = JSON.parse(sessionStorage.getItem('idSala'));
    let messagesRef = firebase
      .database()
      .ref("/mensajes")
      .orderByChild("salaID")
      .equalTo(this.salaElegida);

    messagesRef.on("value", snap => {
      let data = snap.val();
      this.messages = [];
      for (let key in data) {
        this.messages.push(data[key]);
      }
      this.messages.reverse();
    });
  }
  downloadFile(base: string, tipo: string, nomDoc: string) {
    console.log("nombre: " + base + " tipo: " + tipo + " nomDoc " + nomDoc);

    let reader = new FileReader();

    const byteCharacters = atob(base);

    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: tipo + "" });

    saveAs(blob, nomDoc + "");
  }

  sendMessage() {
    let empty = "";


    if (this.message.trim() === "") {
      alert("No puede enviar un mensaje vacio");
      this.message = "";
    } else {

     //   this.salaElegida = JSON.parse(sessionStorage.getItem('idSala'));
     
      let messageRef = firebase
        .database()
        .ref()
        .child("mensajes");
      //validacion tipo nulo
      if (this.fotoType === "") {
        this.fotoType = "image";
        this.fotoNombre = "documento";
      }
      messageRef.push({
        nombre: "" + this.userName,
        mensaje: "" + this.message,
        fecha: "" + Date.now(),

        salaID: this.salaElegida,
        foto: "" + this.srcFoto,
        nomDoc: "" + this.fotoNombre,
        tipo: "" + this.fotoType
      });

      this.srcFoto = "";
      this.message = "";
      this.fotoType = "image";
      this.fotoNombre = "";
    }
  }

  isSalaSelected(): Boolean {
      if (JSON.parse(sessionStorage.getItem('idSala')) === null) {
          this.salaElegida = "yavirac";
          this.checkForMessages();
          return false;
      }
      this.salaElegida = JSON.parse(sessionStorage.getItem('idSala'));
      this.checkForMessages();
      return true;
  }
}
