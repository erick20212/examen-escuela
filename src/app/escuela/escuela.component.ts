// escuela.component.ts
import { Component, OnInit } from '@angular/core';
import { Escuela } from '../models/escuela';
import { Facultad } from '../models/facultad';
import { EscuelaService } from '../services/escuela.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SiderbarComponent } from '../siderbar/siderbar.component';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-escuela',
  standalone: true,
  imports: [
    TableModule, 
    DialogModule, 
    ButtonModule, 
    ToolbarModule, 
    CommonModule, 
    FormsModule, 
    ToastModule, 
    ConfirmDialogModule,
    SiderbarComponent,
    CardModule,
    DropdownModule
  ],
  templateUrl: './escuela.component.html',
  styleUrls: ['./escuela.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class EscuelaComponent implements OnInit {
  escuelas: Escuela[] = [];
  escuela: Escuela = { id: 0, nombre: '', facultad: { id: 0, nombre: '' } }; // Inicialización completa
  facultades: Facultad[] = [];
  escuelaDialog: boolean = false;
  submitted: boolean = false;

  constructor(
    private escuelaService: EscuelaService, 
    private messageService: MessageService, 
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadEscuelas();
    this.loadFacultades();
  }

  loadEscuelas(): void {
    this.escuelaService.getEscuelas().subscribe(
      (data: Escuela[]) => {
        this.escuelas = data;
      },
      (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las escuelas', life: 3000 });
        console.error("Error al cargar escuelas:", error);
      }
    );
  }

  loadFacultades(): void {
    this.escuelaService.getFacultades().subscribe(
      (data: Facultad[]) => {
        this.facultades = data;
      },
      (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las facultades', life: 3000 });
        console.error("Error al cargar facultades:", error);
      }
    );
  }

  openNew() {
    this.escuela = { id: 0, nombre: '', facultad: { id: 0, nombre: '' } }; // Inicializar correctamente
    this.submitted = false;
    this.escuelaDialog = true;
  }

  hideDialog() {
    this.escuelaDialog = false;
    this.submitted = false;
  }

  saveEscuela() {
    this.submitted = true;
  
    if (this.escuela.nombre.trim() && this.escuela.facultad.id) {
      
        this.escuela.facultad = this.facultades.find(fac => fac.id === this.escuela.facultad.id) || { id: 0, nombre: '' };

        if (this.escuela.id) {
            this.escuelaService.updateEscuela(this.escuela).subscribe(
                () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Escuela actualizada', life: 3000 });
                    this.loadEscuelas();
                    this.escuelaDialog = false;
                },
                (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la Escuela', life: 3000 });
                    console.error("Error al actualizar la escuela:", error);
                }
            );
        } else {
            this.escuelaService.createEscuela(this.escuela).subscribe(
                () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Escuela creada', life: 3000 });
                    this.loadEscuelas();
                    this.escuelaDialog = false;
                },
                (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la Escuela', life: 3000 });
                    console.error("Error al crear la escuela:", error);
                }
            );
        }
  
        this.escuela = { id: 0, nombre: '', facultad: { id: 0, nombre: '' } };
    } else {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Completa todos los campos requeridos', life: 3000 });
    }
}

  editEscuela(escuela: Escuela) {
    this.escuela = { ...escuela };
    this.escuelaDialog = true;
  }

  deleteEscuela(escuela: Escuela) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar esta Escuela?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.escuelaService.deleteEscuela(escuela.id).subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Escuela eliminada', life: 3000 });
            this.loadEscuelas();
          },
          (error: any) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la Escuela', life: 3000 });
            console.error("Error al eliminar la escuela:", error);
          }
        );
      }
    });
  }
}
