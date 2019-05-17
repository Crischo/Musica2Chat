import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from './../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: Http) { }
  login(email: String, password: String): Promise<any> {
    const data = {email: email, clave: password};
    return this.http.post(environment.api + 'login/cuenta', JSON.stringify(data)).toPromise()
    .then( r =>
      r.json()
    ).catch( error => {
      error.json();
    });
  }

  foto(id: number): Promise<any> {
    const data = {columna: 'idPersona', tipo_filtro: 'coincide', filtro: id};
    return this.http.post(environment.api + 'fotoperfil/leer_filtrado', JSON.stringify(data)).toPromise()
    .then( r =>
      r.json()
    ).catch( error => {
      error.json();
    });
  }
}
