import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';

import { MasonStore } from './mason.store';

type TViewConfig = 'fixed' | 'float' | 'flow';
type TToolbarConfig = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

@Component({
  selector: 'Mason',
  templateUrl: './mason.component.html',
  styleUrls: ['./mason.component.scss'],
  providers: [MasonStore],
})
export class MasonComponent implements OnInit, AfterViewInit {

  @Input() header: TViewConfig = 'flow';
  @Input() footer: TViewConfig = 'flow';
  @Input() toolbar: TToolbarConfig = 'bottom-right';
  @Input() debug;

  @Output() headerReadyEmitter = new EventEmitter();
  @Output() footerReadyEmitter = new EventEmitter();

  get toolbarVAlign() { return this.toolbar.split('-')[0]; }

  get toolbarHAlign() { return this.toolbar.split('-')[1]; }

  get isDebug() { return this.debug || this.debug === ''; }

  get debugClass() { return this.debug || this.debug === '' ? 'debug' : ''; }

  constructor(
    public masonStore: MasonStore,
    public viewContainerRef: ViewContainerRef,
  ) { }

  ngOnInit() { }

  ngAfterViewInit() { }

}

@Component({
  selector: 'MasonSidebar',
  template: `
    <ModalStack id="#masonModalStack" dismissEnabled="false" (tap)="modalCloseEmitter.emit($event)">
      <StackLayout #modalContentView
         (loaded)="modalContentEmitter.emit($event)"
          horizontalAlignment="left"
          (tap)="modalCloseEmitter.emit($event)"
      >
        <ng-content></ng-content>
      </StackLayout>
    </ModalStack>
  `,
  styleUrls: [],
})
export class MasonSidebarComponent {

  @Input() timeout = -1;

  @Output() modalContentEmitter = new EventEmitter();
  @Output() modalCloseEmitter = new EventEmitter();

}

@Component({
  selector: 'MasonOffSidebar',
  template: `
    <ModalStack id="#masonModalStack" dismissEnabled="false" (tap)="modalCloseEmitter.emit($event)">
      <StackLayout #modalContentView
        (loaded)="modalContentEmitter.emit($event)"
        horizontalAlignment="right"
        (tap)="modalCloseEmitter.emit($event)"
      >
        <ng-content></ng-content>
      </StackLayout>
    </ModalStack>
   `,
})
export class MasonOffSidebarComponent {

  @Input() timeout = -1;

  @Output() modalContentEmitter = new EventEmitter();
  @Output() modalCloseEmitter = new EventEmitter();

}

@Component({
  selector: 'MasonToaster',
  template: `
    <ModalStack id="#masonModalStack" dismissEnabled="false" (tap)="modalCloseEmitter.emit($event)" verticalPosition="top">
      <StackLayout #modalContentView
        (loaded)="modalContentEmitter.emit($event)"
        verticalAlignment="top"
        horizontalAlignment="center"
        (tap)="modalCloseEmitter.emit($event)"
      >
        <ng-content></ng-content>
      </StackLayout>
    </ModalStack>
   `,
})
export class MasonToasterComponent {

  @Input() timeout = 2500;

  @Output() modalContentEmitter = new EventEmitter();
  @Output() modalCloseEmitter = new EventEmitter();

}

@Component({
  selector: 'MasonSnackbar',
  template: `
    <ModalStack id="#masonModalStack" dismissEnabled="false" (tap)="modalCloseEmitter.emit($event)" verticalPosition="bottom">
      <StackLayout #modalContentView
        (loaded)="modalContentEmitter.emit($event)"
        verticalAlignment="bottom"
        horizontalAlignment="center"
        (tap)="modalCloseEmitter.emit($event)"
      >
        <ng-content></ng-content>
      </StackLayout>
    </ModalStack>
   `,
})
export class MasonSnackbarComponent {

  @Input() timeout = 2500;

  @Output() modalContentEmitter = new EventEmitter();
  @Output() modalCloseEmitter = new EventEmitter();

}

@Component({
  selector: 'MasonBottomSheet',
  template: `
    <ModalStack id="#masonModalStack" dismissEnabled="false" (tap)="modalCloseEmitter.emit($event)" verticalPosition="bottom">
      <StackLayout #modalContentView
        (loaded)="modalContentEmitter.emit($event)"
        verticalAlignment="bottom"
        horizontalAlignment="stretch"
        (tap)="modalCloseEmitter.emit($event)"
      >
        <ng-content></ng-content>
      </StackLayout>
    </ModalStack>
   `,
})
export class MasonBottomSheetComponent {

  @Input() timeout = -1;

  @Output() modalContentEmitter = new EventEmitter();
  @Output() modalCloseEmitter = new EventEmitter();

}

@Component({
  selector: 'MasonDialog',
  template: `
    <ModalStack id="#masonModalStack" dismissEnabled="false" (tap)="modalCloseEmitter.emit($event)" verticalPosition="center">
      <StackLayout #modalContentView
        (loaded)="modalContentEmitter.emit($event)"
        verticalAlignment="center"
        horizontalAlignment="center"
        (tap)="modalCloseEmitter.emit($event)"
      >
        <ng-content></ng-content>
      </StackLayout>
    </ModalStack>
   `,
})
export class MasonDialogComponent {

  @Input() timeout = -1;

  @Output() modalContentEmitter = new EventEmitter();
  @Output() modalCloseEmitter = new EventEmitter();

}

@Component({
  selector: 'MasonMenu',
  template: `
    <ModalStack id="#masonModalStack" dismissEnabled="false" (tap)="modalCloseEmitter.emit($event)" verticalPosition="top" horizontalPosition="left">
      <StackLayout #modalContentView
        (loaded)="modalContentEmitter.emit($event)"
        verticalAlignment="top"
        horizontalAlignment="left"
        (tap)="modalCloseEmitter.emit($event)"
      >
        <ng-content></ng-content>
      </StackLayout>
    </ModalStack>
   `,
})
export class MasonMenuComponent {

  @Input() timeout = -1;
  @Input() position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'bottom-left';

  @Output() modalContentEmitter = new EventEmitter();
  @Output() modalCloseEmitter = new EventEmitter();

}
