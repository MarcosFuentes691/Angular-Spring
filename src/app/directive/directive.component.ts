import { Component} from '@angular/core';

@Component({
  selector: 'app-directive',
  templateUrl: './directive.component.html',
  styleUrls: ['./directive.component.css']
})
export class DirectiveComponent {

  courseList: string[] = ['Angular', 'React', 'Vue', 'Ember'];

  showList: boolean = true;
  
  setShowList() {
    this.showList = !this.showList;
  }

  constructor() { }

}
