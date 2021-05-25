import { Component } from '@angular/core';

import { MasonService } from 'nativescript-ngx-mason';

import { ToasterComponent } from './toaster.component';

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
})
export class SheetComponent {

  constructor(private masonService: MasonService) { }

  public closeModal() {
    this.masonService.dismissOffSidebar('Testing');
  }

  public openToaster() {
    this.masonService.openToaster(ToasterComponent);
  }

}
