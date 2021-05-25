import { Component } from '@angular/core';

import { MasonService } from 'nativescript-ngx-mason';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
})
export class SnackbarComponent {

  constructor(private masonService: MasonService) { }

  public closeModal() {
    this.masonService.dismissSnackbar();
  }

}
