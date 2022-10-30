import { Injectable } from '@angular/core';
import { Client } from './client';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private urlEndPoint: string = 'http://localhost:8080/api/clients';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.urlEndPoint);
  }

  create(client: Client): Observable<Client> {
    return this.http.post(this.urlEndPoint, client, {headers: this.httpHeaders}).pipe(
      map((response: any) => response.client as Client),
      catchError(e => {
        this.router.navigate(['/clients']);
        console.error(e.error.message);
        swal.fire(e.error.message, e.error.error, 'error');
        return of(null);
      }
    ));
  }

  getClient(id): Observable<Client> {
    return this.http.get<Client>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clients']);
        console.error(e.error.message);
        swal.fire(e.error.message, e.error.error, 'error');
        return of(null);
      }
    ));
  }

  update(client: Client): Observable<Client> {
    return this.http.put(`${this.urlEndPoint}/${client.id}`, client, {headers: this.httpHeaders}).pipe(
      map((response: any) => response.client as Client),
      catchError(e => {
        this.router.navigate(['/clients']);
        console.error(e.error.message);
        swal.fire(e.error.message, e.error.error, 'error');
        return of(null);
      }
    ));
  }

  delete(id: number): Observable<Client> {
    return this.http.delete<Client>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders});
  }

}
