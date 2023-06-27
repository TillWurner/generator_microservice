import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as Papa from 'papaparse';
import { Asesor } from './asesor.model';
import { HttpHeaders } from '@angular/common/http';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';
import html2canvas from 'html2canvas';



@Injectable({
  providedIn: 'root'
})
export class AsesorService {
  private apiUrl = 'http://35.199.108.5/api'; // URL de la API del servidor principal
  private apiUrl2 = 'http://35.199.108.5/upload'; // URL de la API POST

  constructor(private http: HttpClient) { }

  getAsesores(): Observable<any> {
    const url = `${this.apiUrl}`; // Endpoint para obtener los asesores
    return this.http.get(url);
  }

  generatePDF(asesores: Asesor[]): void {
    console.log('Generando PDF');
    console.log('Asesores:', asesores);
    const doc = new jsPDF();
    const content = this.generatePDFContent(asesores);
  
    const generatePDFFunction = () => {
      const element = document.createElement('div');
      element.appendChild(content);
    
      document.body.appendChild(element);
    
      html2canvas(element)
        .then((canvas) => {
          console.log('html2canvas completado');
    
          document.body.removeChild(element);
    
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 210; // A4 paper size
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
          doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          doc.save('asesores.pdf');
        })
        .catch((error) => {
          console.error('Error al convertir contenido a imagen:', error);
        });
    };    
  
    if (document.readyState === 'complete') {
      setTimeout(generatePDFFunction, 500); // Esperar 500 milisegundos (ajusta este valor si es necesario)
    } else {
      window.addEventListener('DOMContentLoaded', () => {
        setTimeout(generatePDFFunction, 500); // Esperar 500 milisegundos (ajusta este valor si es necesario)
      });
    }
  }
  
  
  

  private generatePDFContent(asesores: Asesor[]): HTMLElement {
    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Teléfono</th>
          <th>Código</th>
        </tr>
      </thead>
      <tbody>
        ${asesores
          .map(
            (asesor) => `
            <tr>
              <td>${asesor.nombre}</td>
              <td>${asesor.correo}</td>
              <td>${asesor.telefono}</td>
              <td>${asesor.codigo}</td>
            </tr>
          `
          )
          .join('')}
      </tbody>
    `;

    return table;
  }
  
  generateCSV(asesores: Asesor[]): void {
    const csvData = asesores.map((asesor) => ({
      nombre: asesor.nombre,
      correo: asesor.correo,
      telefono: asesor.telefono,
      codigo: asesor.codigo,
    }));

    const csv = Papa.unparse(csvData);
    const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = csvUrl;
    link.setAttribute('download', 'asesores.csv');
    link.click();
  }

  
  uploadFile(formData: FormData): void {
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
  
    this.http.post(`${this.apiUrl2}/upload`, formData, { headers }).subscribe(
      (response) => console.log('Archivo enviado al servidor principal'),
      (error) => console.error('Error al enviar el archivo al servidor principal', error)
    );
  }
  

}
