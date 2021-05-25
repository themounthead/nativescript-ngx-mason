import { Component } from '@angular/core';

import { MasonService } from 'nativescript-ngx-mason';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent {

  constructor(private masonService: MasonService) { }

  public closeModal() {
    this.masonService.dismissMenu();
  }

}
