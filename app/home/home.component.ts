import { Component } from '@angular/core';

import { MasonService } from 'nativescript-ngx-mason';

import { DialogComponent } from './dialog.component';
import { MenuComponent } from './menu.component';
import { SheetComponent } from './sheet.component';
import { SidebarComponent } from './sidebar.component';
import { SnackbarComponent } from './snackbar.component';
import { ToasterComponent } from './toaster.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  title = 'nativescript-ngx-mason';
  private counter = 42;

  constructor(
    private masonService: MasonService,
  ) { }

  public getMessage() {
    return this.counter > 0 ?
      `${this.counter} taps left` :
      'Hoorraaay! You unlocked the NativeScript clicker achievement!';
  }

  public onTap() {
    this.counter--;
  }

  async openOffSidebar() {
    this.masonService.openOffSidebar(SidebarComponent);
  }

  async openSidebar() {
    this.masonService.openSidebar(SidebarComponent);
  }

  openToaster() {
    this.masonService.openToaster(ToasterComponent);
  }

  openSnackbar() {
    this.masonService.openSnackbar(SnackbarComponent, { timer: 3000 });
  }

  openMenu(args) {
    this.masonService.openMenu(MenuComponent, args, { timer: 3000 });
  }

  openSheet(args) {
    this.masonService.openBottomSheet(SheetComponent);
  }

  openDialog(args) {
    this.masonService.openBottomSheet(DialogComponent);
  }

}
