import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';

import { registerElement } from 'nativescript-angular';
import { ModalDialogService } from 'nativescript-angular/modal-dialog';
import { ModalStack, overrideModalViewMethod } from 'nativescript-windowed-modal';

import {
  MasonBottomSheetComponent,
  MasonComponent,
  MasonDialogComponent,
  MasonMenuComponent,
  MasonOffSidebarComponent,
  MasonSidebarComponent,
  MasonSnackbarComponent,
  MasonToasterComponent,
} from './mason.component';
import {
  ActionBarQueryDirective,
  MasonBottomSheetComponentDirective,
  MasonComponentDirective,
  MasonDialogComponentDirective,
  MasonHelperService,
  MasonMenuComponentDirective,
  MasonOffSidebarComponentDirective,
  MasonPartialDirective,
  MasonQueryService,
  MasonSidebarComponentDirective,
  MasonSnackbarComponentDirective,
  MasonToasterComponentDirective,
} from './mason.directives';

overrideModalViewMethod();
registerElement('ModalStack', () => ModalStack);

const COMPONENTS = [
  MasonComponent,
  MasonOffSidebarComponent,
  MasonSidebarComponent,
  MasonToasterComponent,
  MasonSnackbarComponent,
  MasonMenuComponent,
  MasonBottomSheetComponent,
  MasonDialogComponent,
];

const DIRECTIVES = [
  ActionBarQueryDirective,
  MasonPartialDirective,
  MasonComponentDirective,
  MasonSidebarComponentDirective,
  MasonOffSidebarComponentDirective,
  MasonToasterComponentDirective,
  MasonSnackbarComponentDirective,
  MasonMenuComponentDirective,
  MasonBottomSheetComponentDirective,
  MasonDialogComponentDirective,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  providers: [
    MasonQueryService,
    MasonHelperService,
    ModalDialogService,
  ],
  entryComponents: [
    MasonSidebarComponent,
    MasonOffSidebarComponent,
    MasonToasterComponent,
    MasonSnackbarComponent,
    MasonMenuComponent,
  ],
  exports: [
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class MasonModule { }
