import { Component } from '@angular/core';
import { AsesorService } from './asesor.service';
import { Asesor } from './asesor.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'microservicio-generador';
  constructor(private asesorService: AsesorService) {}

  generatePDF(): void {
    console.log('Clic en el botón Generar PDF');
    this.asesorService.getAsesores().subscribe(
      (response) => {
        const asesores = response; // La respuesta de la API es la matriz de asesores
        this.asesorService.generatePDF(asesores);
        // También puedes enviar el archivo PDF al servidor principal
        // this.asesorService.uploadFile(new File([pdf.output('blob')], 'asesores.pdf'));
      },
      (error) => {
        console.error('Error al obtener los asesores', error);
      }
    );
  }  
}
