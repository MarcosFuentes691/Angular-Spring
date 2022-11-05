import { Component, OnInit } from '@angular/core';
import { Client } from './client';
import { ClientService } from './client.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  clients: Client[];
  paginator: any;

  constructor(
    private clientService: ClientService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let page = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.clientService.getClients(page).pipe(
        tap(response => {
          console.log('ClientComponent: tap 3');
          (response.content as Client[]).forEach(client => console.log(client.name));
        }
      )).subscribe(response => {
        this.clients = response.content as Client[];
        this.paginator = response;
      });
    });
  }

  public delete(client: Client): void {
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the client ${client.name} ${client.surname}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.clientService.delete(client.id).subscribe(
          response => {
            this.clients = this.clients.filter(cli => cli !== client);
            swal.fire('Client Deleted', `Client ${client.name} deleted successfully`, 'success');
          }
        );
      }
    });
  }

}
