import { Injectable } from '@angular/core';
import { Client } from './client';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
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

  getClients(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('ClientService: tap 1');
        (response.content as Client[]).forEach(client => console.log(client.name));
      }),
      map((response: any) => {
        (response.content as Client[]).map(client => {
          // client.name = client.name.toUpperCase();
          return client;
        });
        return response;
      }),
      tap(response => {
        console.log('ClientService: tap 2');
        (response.content as Client[]).forEach(client => console.log(client.name));
      })
    );
  }

  create(client: Client): Observable<Client> {
    return this.http.post(this.urlEndPoint, client, {headers: this.httpHeaders}).pipe(
      map((response: any) => response.client as Client),
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        this.router.navigate(['/clients']);
        console.error(e.error.message);
        swal.fire(e.error.message, e.error.error, 'error');
        return throwError(e);
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
        if (e.status == 400) {
          return throwError(e);
        }
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
