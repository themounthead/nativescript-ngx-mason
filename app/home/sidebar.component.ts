import { Component } from '@angular/core';

import { MasonService } from 'nativescript-ngx-mason';

import { ToasterComponent } from './toaster.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {

  constructor(private masonService: MasonService) { }

  public closeModal() {
    this.masonService.dismissOffSidebar('Testing');
  }

  public openToaster() {
    this.masonService.openToaster(ToasterComponent);
  }

}
