import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from 'src/environments/environment.prod';
import { CallNumber } from "@ionic-native/call-number/ngx";

@Component({
  selector: 'app-miembros-sala',
  templateUrl: './miembros-sala.page.html',
  styleUrls: ['./miembros-sala.page.scss'],
})
export class MiembrosSalaPage implements OnInit {

  sala: any;
  miembroSeleccionado: any;
  fotoSeleccionado: any;
  personaSeleccionada: any;
  isPersonaSeleccionada: Boolean = false;
  constructor(private http: Http,
    private callNumber: CallNumber) { }

  ngOnInit() {
    this.refreshSala();
  }

  refreshSala() {
    if (JSON.parse(sessionStorage.getItem('sala')) === null) {
      return false;
    }
    this.sala = JSON.parse(sessionStorage.getItem('sala'));
    return true;
  }

  seleccionarMiembro(miembro: any) {
    this.miembroSeleccionado = miembro;
    this.fotoSeleccionado = {tipoArchivo: null};
    this.getFotoPerfil(miembro.idPersona);
    this.getMiembroSeleccionadoInfo(miembro.idPersona);
  }

  getMiembroSeleccionadoInfo(id: number) {
    this.isPersonaSeleccionada = false;
    this.http.get(environment.api + 'persona/leer?id=' + id.toString()).toPromise().then(
      r => {
        this.isPersonaSeleccionada = true;
        this.personaSeleccionada = r.json()[0];
      }
    ).catch( e => console.log (e) );
  }

  getFotoPerfil(id: number) {
    this.http.get(environment.api + 'fotoperfil/leer_filtrado?columna=idPersona&tipo_filtro=coincide&filtro=' + id.toString()).toPromise().then(
      r => {
        this.fotoSeleccionado = r.json()[0];
      }
    ).catch( e => console.log (e) );
  }

  makeCall(telefono: string) {
    this.callNumber
      .callNumber(telefono, true)
      .then(res => {})
      .catch(err => {
        console.log(err);
      });
  }
}
