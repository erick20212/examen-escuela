import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Escuela } from '../models/escuela';
import { Observable } from 'rxjs';
import { Facultad } from '../models/facultad';

@Injectable({
  providedIn: 'root'
})
export class EscuelaService {
  private apiUrl = 'http://localhost:8080/api/escuela';
  private facultadUrl = 'http://localhost:8080/api/facultad';

  constructor(private http: HttpClient) {}

  // Cargar todas las escuelas
  getEscuelas(): Observable<Escuela[]> {
    return this.http.get<Escuela[]>(this.apiUrl);
  }

  // Cargar todas las facultades
  getFacultades(): Observable<Facultad[]> {
    return this.http.get<Facultad[]>(this.facultadUrl);
  }

  // Crear una nueva escuela
  createEscuela(escuela: Escuela): Observable<Escuela> {
    // Crear el payload solo con el id de la facultad
    const payload = {
      nombre: escuela.nombre,
      facultad: { id: escuela.facultad.id }
    };
    return this.http.post<Escuela>(this.apiUrl, payload);
  }

  // Actualizar una escuela existente
  updateEscuela(escuela: Escuela): Observable<Escuela> {
    // Crear el payload solo con el id de la facultad
    const payload = {
      id: escuela.id,
      nombre: escuela.nombre,
      facultad: { id: escuela.facultad.id }
    };
    return this.http.put<Escuela>(`${this.apiUrl}/${escuela.id}`, payload);
  }

  // Eliminar una escuela
  deleteEscuela(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
