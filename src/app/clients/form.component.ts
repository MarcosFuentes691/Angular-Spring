import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Client } from './client';
import { ClientService } from './client.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public client: Client = new Client();
  public title = 'New Client';
  public errors: string[];

  constructor(
    private clientService: ClientService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadClient();
  }

  public loadClient(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.clientService.getClient(id).subscribe((client) => this.client = client);
      }
    });
  }

  public create(): void {
    this.clientService.create(this.client).subscribe(
      client => {
        console.log(client),
        swal.fire('New Client', `Client ${client.name} created successfully`, 'success'),
        this.router.navigate(['/clients'])
      },
      err => {
        this.errors = err.error.errors as string[];
        console.error('Code from backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }

  public update(): void {
    this.clientService.update(this.client).subscribe(
      client => {
        console.log(client),
        swal.fire('Client Updated', `Client ${client.name} updated successfully`, 'success'),
        this.router.navigate(['/clients'])
      }
    );
  }

}