import { AuthService } from "./../../services/auth.service";
import { Router } from "@angular/router";
import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Http } from "@angular/http";
import { AlertController } from '@ionic/angular';
//import { File } from '@ionic-native/file/ngx';







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
  //  ,private file: File
  
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



  
   fixBinary (bin) {
    var length = bin.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < length; i++) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }

  downloadFile(base: string, tipo: string, nomDoc: string) {
    /*
    const img: string = 'iVBORw0KGgoAAAANSUhEUgAAAcwAAAHMCAIAAADXuQ/RAAA5DUlEQVR4nOzdCZgVV5k//vf2Tje9QW9AAw00zU6AbGwJJIZsJJqYOFk0y8/4G33Uv467jqOOOm6j0ZmM+tcZHZ1Es4yJmghkTyCsIQn73g006ab3fd/7974QWyBN08t969Q59f089+FhxlB1blWd7606dZao3t5eAgAAHRGmCwAA4DKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgCKELACAIoQsAIAihCwAgKIo0wWAgOrtpbZOamilxjb5VDZQeT01t1NTO7W0U2sHdXSd+nRTWwd19sh/38N//vWfh4giIygqkuKiKTqSYqIoNppG8SeG4mMpMY4ykuQzOo6SRsmH/7NI3FGACQhZ8EJnN9U0UXENHSmjigaqbaLqJqproZYOidreXsVdc7zGxVDyKBozmtL4k0jTs2jSWPk/+X8C0BbqVb3AIZB6eqminsobqLCKTtbIp7SeGk5Fqk/wbS/f3vKtbvYYmpBKU9IpM5nGpeBuF8IPIQvhwddRxalUPVZBOwvpaIU88lskOpKmZtCCyfInZy7nbwwe8yAcELIwfByjxTV0uFQ+nK0lddTeabpM4RAVIXe1k9Np1njKy6JJadLICzA8CFkYso4uOl5JGw7StgIqqzddGn1jEujyXLpqNk3LkBdrAEOCkIXBKqml/cW0+206VCp/D6D0RMobRxdNonkT5fY2ZLo8YAWELPSvs5uqGungSdpbRKV18qlppu4e08Xyh4gQpcRLk8K4VJqbTbMnoA0XzgshC2dp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';
      const bytes: string = atob(img);
      const byteNumbers = new Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) {
        byteNumbers[i] = bytes.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      const blob: Blob = new Blob([byteArray], { type: 'image/png' });

  this.file.writeFile(this.file.dataDirectory, 'file.png', blob)
  saveAs(  this.file.writeFile(this.file.dataDirectory, 'file.png', blob)
  )
alert(  this.file.writeFile(this.file.dataDirectory, 'file.png', blob)
)
*/
/*
let imageSrcData = 'data:image/jpeg;base64,' +base;
let blob:Blob = this.b64toBlob(imageSrcData);

let fileName = nomDoc + "-" + Date.now()+".jpg";
let directory = 'Download';


  this.file.writeFile(directory,fileName, blob)

*/

    let reader = new FileReader();

    const byteCharacters = atob(base)
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: tipo + "" });


var binary = this.fixBinary(window.atob(base));// <-- Usamos la fn "fixBinary"
var the_file = new Blob([binary], {type: ''+tipo});// <-- Sacamos el encode
var imagen_firma = new File([the_file], nomDoc+'.'+tipo.split('/')[1], { type: ''+tipo });

saveAs(the_file);

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
        adjunto: "" + this.srcFoto,
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
