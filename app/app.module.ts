import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';

import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { MasonModule } from 'nativescript-ngx-mason';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogComponent } from './home/dialog.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './home/menu.component';
import { SheetComponent } from './home/sheet.component';
import { SidebarComponent } from './home/sidebar.component';
import { SnackbarComponent } from './home/snackbar.component';
import { ToasterComponent } from './home/toaster.component';

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from 'nativescript-angular/forms';

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
// import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidebarComponent,
    ToasterComponent,
    SnackbarComponent,
    MenuComponent,
    SheetComponent,
    DialogComponent,
  ],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    MasonModule,
  ],
  entryComponents: [
    SidebarComponent,
    ToasterComponent,
    SnackbarComponent,
    MenuComponent,
    SheetComponent,
    DialogComponent,
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }
