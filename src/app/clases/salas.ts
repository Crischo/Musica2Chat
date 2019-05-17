import { Miembro } from './miembros';

export class Salas {
    nombre: string;
    miembros: Miembro[];
    mensajesNuevos: number;
    idSala: string;
    constructor() {
        this.mensajesNuevos = 0;
    }
}
