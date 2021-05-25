import { Component } from '@angular/core';

import { MasonService } from 'nativescript-ngx-mason';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
})
export class ToasterComponent {

  constructor(private masonService: MasonService) { }

  public closeModal() {
    this.masonService.dismissToaster();
  }

}
