import { Facultad } from './facultad';

export interface Escuela {
    id: number;
    nombre: string;
    facultad: Facultad;
}