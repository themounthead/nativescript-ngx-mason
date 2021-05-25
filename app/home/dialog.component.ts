import { Component } from '@angular/core';

import { MasonService } from 'nativescript-ngx-mason';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
})
export class DialogComponent {

  constructor(private masonService: MasonService) { }

  public closeModal() {
    this.masonService.dismissMenu();
  }

}
