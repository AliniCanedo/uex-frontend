import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  name: string | null;

  constructor() {
    this.name = null;
  }
  
  ngOnInit() {
    this.name = localStorage.getItem('name');
  }
}
