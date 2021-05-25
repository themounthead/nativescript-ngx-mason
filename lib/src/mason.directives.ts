
import {
  AfterViewInit, ContentChild, Directive, ElementRef, Inject, Injectable,
  OnDestroy, OnInit, ViewContainerRef, forwardRef,
} from '@angular/core';

import { ModalDialogParams, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { ExtendedShowModalOptions } from 'nativescript-windowed-modal';

import { isIOS, screen } from 'tns-core-modules/platform';
import { ActionBar } from 'tns-core-modules/ui/action-bar';
import { AnimationCurve } from 'tns-core-modules/ui/enums';
// import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { StackLayout } from 'tns-core-modules/ui/layouts';
import { Page } from 'tns-core-modules/ui/page';

import { Subscription } from 'rxjs';
import { combineLatest, debounceTime, filter, tap, throttleTime } from 'rxjs/operators';

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
import { IMasonRequest, MasonService } from './mason.service';
import { MasonStore } from './mason.store';

// import { Color } from 'tns-core-modules/color';

const MASON_MODAL_STACK_ID = '#masonModalStack';
const IOS_NOTCH_OFFSET = 46;

@Injectable({ providedIn: 'root' })
export class MasonQueryService {

  private actionBar: ActionBar;
  private masonPage;
  private masonHeader;
  private masonFooter;

  getActionBar() { return this.actionBar; }
  setActionBar(o) { this.actionBar = o; }
  getMasonPage() { return this.masonPage; }
  setMasonPage(o) { this.masonPage = o; }
  getMasonHeader() { return this.masonHeader; }
  setMasonHeader(o) { this.masonHeader = o; }
  getMasonFooter() { return this.masonFooter; }
  setMasonFooter(o) { this.masonFooter = o; }

}

@Injectable()
export class MasonHelperService {

  constructor(
    private page: Page,
  ) { }

  public getViewDimensions(contextView) {
    const scale = screen.mainScreen.scale;
    const screenHeight = screen.mainScreen.heightDIPs;
    const screenWidth = screen.mainScreen.widthDIPs;
    const pageHeight = this.page.getMeasuredHeight() / scale;
    const pageWidth = this.page.getMeasuredWidth() / scale;
    const contentHeight = contextView.getMeasuredHeight() / scale;
    const contentWidth = contextView.getMeasuredWidth() / scale;
    const pageInsetMargin = (screenHeight - pageHeight) / 2;
    console.dir({ screenHeight, screenWidth, pageHeight, pageWidth, contentHeight, contentWidth, pageInsetMargin });
    return { scale, screenHeight, screenWidth, pageHeight, pageWidth, contentHeight, contentWidth, pageInsetMargin };
  }

}

@Directive({
  selector: 'ActionBar',
})
export class ActionBarQueryDirective {

  constructor(
    @Inject(forwardRef(() => ElementRef)) private actionBar,
    @Inject(forwardRef(() => MasonQueryService)) private masonQueryService,
  ) {
    const actionBarEl = this.actionBar ? this.actionBar.nativeElement : null;
    this.masonQueryService.setActionBar(actionBarEl);
  }

}

@Directive({
  selector: '[partial-mason]',
})
export class MasonPartialDirective implements AfterViewInit {

  @ContentChild('pageView', { read: ElementRef, static: false }) pageView: ElementRef;
  @ContentChild('scrollView', { read: ElementRef, static: false }) scrollView: ElementRef;
  @ContentChild('contentView', { read: ElementRef, static: false }) contentView: ElementRef;
  @ContentChild('headerView', { read: ElementRef, static: false }) headerView: ElementRef;
  @ContentChild('footerView', { read: ElementRef, static: false }) footerView: ElementRef;

  constructor(
    @Inject(forwardRef(() => MasonQueryService)) private masonQueryService: MasonQueryService,
    @Inject(forwardRef(() => MasonComponent)) private masonComponent: MasonComponent,
    @Inject(forwardRef(() => Page)) private page: Page,
  ) { }

  ngAfterViewInit() {
    this.masonQueryService.setMasonPage(this.pageView.nativeElement);
    this.watchViewEmitters();
  }

  private watchViewEmitters() {
    this.masonComponent.headerReadyEmitter
      .pipe(
        tap(),
        combineLatest(this.masonComponent.footerReadyEmitter),
      )
      .subscribe(([headerEvt, footerEvt]) => {
        const actionBar = this.masonQueryService.getActionBar();
        if (actionBar) {
          actionBar.on('loaded', evt => setTimeout(() => { this.onViewsLoaded(evt, headerEvt, footerEvt); }, 100));
        } else {
          setTimeout(() => this.onViewsLoaded(null, headerEvt, footerEvt), 100);
        }
      });
  }

  private onViewsLoaded(actionBarEvt, headerEvt, footerEvt) {
    if (!this.scrollView || !this.contentView) { return; }
    const headerState = this.masonComponent.header;
    const footerState = this.masonComponent.footer;
    const actionBar = (actionBarEvt) ? <StackLayout>actionBarEvt.object : null;
    const headerView = (headerEvt) ? <StackLayout>headerEvt.object : null;
    const footerView = (footerEvt) ? <StackLayout>footerEvt.object : null;
    const scale = screen.mainScreen.scale;
    const pageHeight = this.page.getMeasuredHeight() / scale;
    const actionBarHeight = (actionBar) ? actionBar.getMeasuredHeight() / scale : 0;
    const headerHeight = (headerView) ? headerView.getMeasuredHeight() / scale : 0;
    const footerHeight = (footerView) ? footerView.getMeasuredHeight() / scale : 0;
    let scrollHeight = pageHeight - (actionBarHeight + headerHeight + footerHeight);
    scrollHeight = (isIOS) ? scrollHeight + IOS_NOTCH_OFFSET : scrollHeight;
    const contentHeight = scrollHeight + headerHeight;

    if (this.masonComponent.isDebug) {
      console.dir({ actionBarHeight, headerHeight, footerHeight, pageHeight, scrollHeight, contentHeight });
      this.markViewDebug();
    }

    if (headerState !== 'fixed' && footerState !== 'fixed') { return; }
    if (headerState === 'fixed' && footerState === 'fixed') {
      this.scrollView.nativeElement.height = scrollHeight;
      this.contentView.nativeElement.height = scrollHeight;
    }
    if (headerState === 'flow' && footerState === 'fixed') { this.contentView.nativeElement.height = contentHeight; }
    if (headerState === 'float' && footerState === 'fixed') { this.contentView.nativeElement.height = contentHeight; }
  }

  private markViewDebug() {
    this.headerView.nativeElement.className = 'debug';
    this.footerView.nativeElement.className = 'debug';
    this.contentView.nativeElement.className = 'debug';
    this.scrollView.nativeElement.className = 'debug';
  }

}

@Directive({
  selector: 'Mason',
})
export class MasonComponentDirective implements OnInit, AfterViewInit, OnDestroy {

  private viewContainerRef: ViewContainerRef;

  constructor(
    @Inject(forwardRef(() => MasonService)) private masonService: MasonService,
    @Inject(forwardRef(() => MasonComponent)) private masonComponent: MasonComponent,
    @Inject(forwardRef(() => ModalDialogService)) private modalDialogService: ModalDialogService,
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.viewContainerRef = this.masonComponent.viewContainerRef;
    this.watchMasonRequest();
  }

  ngOnDestroy() { }

  private watchMasonRequest() {
    this.masonService.watchMasonRequest$()
      .pipe(
        debounceTime(150),
        filter(request => ['TOGGLE', 'OPEN'].includes(request.type)),
      )
      .subscribe(request => {
        this.masonComponent.masonStore.setMasonRequest(request);
        this.openModalDialog(request);
      });
  }

  private async openModalDialog(request: IMasonRequest) {
    const result = await this.modalDialogService.showModal(request.component, {
      context: request.options ? request.options.context : null,
      closeCallback: null,
      viewContainerRef: this.viewContainerRef,
      dimAmount: request.options && request.options.dim ? request.options.dim : this.getOptionDimAmount(request),
      animation: request.options && request.options.animation ? request.options.animation : null,
    } as ExtendedShowModalOptions);
    this.masonService._setModalResponse(result);
  }

  private getOptionDimAmount(request: IMasonRequest) {
    const dim = ['SNACKBAR', 'TOASTER', 'MENU'].includes(request.name) ? 0 : 0.3;
    return dim;
  }

}

@Directive({
  selector: 'MasonSidebar',
})
export class MasonSidebarComponentDirective implements OnInit, AfterViewInit, OnDestroy {

  private masonStore: MasonStore;
  private contextView: StackLayout;

  private closeEmitterSub: Subscription;
  private contentEmitterSub: Subscription;
  private masonEmitterSub: Subscription;

  constructor(
    @Inject(forwardRef(() => MasonComponent)) private masonComponent: MasonComponent,
    @Inject(forwardRef(() => MasonSidebarComponent)) private masonContextComponent: MasonSidebarComponent,
    @Inject(forwardRef(() => MasonHelperService)) private masonHelper: MasonHelperService,
    @Inject(forwardRef(() => MasonService)) private masonService: MasonService,
    @Inject(forwardRef(() => ModalDialogParams)) private modalDialogParams: ModalDialogParams,
    @Inject(forwardRef(() => Page)) private page: Page,
  ) {
    this.masonStore = this.masonComponent.masonStore;
  }

  ngOnInit() {
    this.masonStore.setSidebarState(true);
    this.initSidebar();
    this.watchDismissEvent();
  }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this.masonStore.setSidebarState(false);
    this.contentEmitterSub.unsubscribe();
    this.closeEmitterSub.unsubscribe();
    this.masonEmitterSub.unsubscribe();
  }

  private initSidebar() {
    this.contentEmitterSub = this.masonContextComponent
      .modalContentEmitter
      .pipe(
        combineLatest(this.masonStore.getMasonRequest$),
      )
      .subscribe(([evt, request]) => {
        this.contextView = <StackLayout>evt.object;
        setTimeout(() => {
          const { pageHeight, contentWidth } = this.masonHelper.getViewDimensions(this.contextView);
          this.contextView.height = pageHeight;
          this.contextView.translateX = -1 * contentWidth;
          this.animateEntry();
          const timeout = 1 * this.masonContextComponent.timeout;
          if (timeout > 0) { setTimeout(() => this.animateExit(), timeout); }
        }, 100);
      });
  }

  private animateEntry() {
    this.page.animate({
      scale: { x: 0.95, y: 0.95 },
    });
    this.contextView.animate({
      duration: 200,
      translate: { x: 0, y: 0 },
      curve: AnimationCurve.easeInOut,
    });
  }

  private async animateExit() {
    const { contentWidth } = this.masonHelper.getViewDimensions(this.contextView);
    this.contextView.animate({
      duration: 250,
      translate: { x: -1 * contentWidth, y: 0 },
      curve: AnimationCurve.easeInOut,
    });
    await this.page.animate({
      scale: { x: 1, y: 1 },
    });
    this.modalDialogParams.closeCallback(this.modalDialogParams.context);
  }

  private watchDismissEvent() {
    this.closeEmitterSub = this.masonContextComponent
      .modalCloseEmitter
      .pipe(
        throttleTime(100),
        filter(evt => evt.object.id === MASON_MODAL_STACK_ID),
      )
      .subscribe(evt => {
        this.animateExit();
      });
    this.masonEmitterSub = this.masonService.watchMasonRequest$()
      .pipe(
        filter(request => request.name === 'SIDEBAR' && request.type === 'CLOSE'),
      )
      .subscribe(() => {
        this.animateExit();
      });
  }

}

@Directive({
  selector: 'MasonOffSidebar',
})
export class MasonOffSidebarComponentDirective implements OnInit, AfterViewInit, OnDestroy {

  private masonStore: MasonStore;
  private contextView: StackLayout;

  private closeEmitterSub: Subscription;
  private contentEmitterSub: Subscription;

  constructor(
    @Inject(forwardRef(() => MasonComponent)) private masonComponent: MasonComponent,
    @Inject(forwardRef(() => MasonOffSidebarComponent)) private masonContextComponent: MasonOffSidebarComponent,
    @Inject(forwardRef(() => MasonHelperService)) private masonHelper: MasonHelperService,
    @Inject(forwardRef(() => MasonService)) private masonService: MasonService,
    @Inject(forwardRef(() => ModalDialogParams)) private modalDialogParams: ModalDialogParams,
    @Inject(forwardRef(() => Page)) private page: Page,
  ) {
    this.masonStore = this.masonComponent.masonStore;
  }

  ngOnInit() {
    this.masonStore.setOffSidebarState(true);
    this.initOffSidebar();
    this.watchDismissEvent();
  }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this.contentEmitterSub.unsubscribe();
    this.closeEmitterSub.unsubscribe();
    this.masonStore.setOffSidebarState(false);
  }

  private initOffSidebar() {
    this.contentEmitterSub = this.masonContextComponent
      .modalContentEmitter
      .pipe(
        combineLatest(this.masonStore.getMasonRequest$),
      )
      .subscribe(([evt, request]) => {
        this.contextView = <StackLayout>evt.object;
        setTimeout(() => {
          const { contentWidth, pageHeight } = this.masonHelper.getViewDimensions(this.contextView);
          this.contextView.height = pageHeight;
          this.contextView.translateX = contentWidth;
          this.animateEntry();
          const timeout = 1 * this.masonContextComponent.timeout;
          if (timeout > 0) { setTimeout(() => this.animateExit(), timeout); }
        }, 10);
      });
  }

  private async animateEntry() {
    this.page.animate({
      scale: { x: 0.95, y: 0.95 },
    });
    this.contextView.animate({
      duration: 200,
      translate: { x: 0, y: 0 },
      curve: AnimationCurve.easeInOut,
    });
  }

  private async animateExit() {
    const { contentWidth } = this.masonHelper.getViewDimensions(this.contextView);
    this.contextView.animate({
      duration: 250,
      translate: { x: contentWidth, y: 0 },
      curve: AnimationCurve.easeInOut,
    });
    await this.page.animate({
      scale: { x: 1, y: 1 },
    });
    this.modalDialogParams.closeCallback(this.modalDialogParams.context);
  }

  private watchDismissEvent() {
    this.closeEmitterSub = this.masonContextComponent
      .modalCloseEmitter
      .pipe(
        throttleTime(100),
        filter(evt => evt.object.id === MASON_MODAL_STACK_ID),
      )
      .subscribe(evt => {
        this.animateExit();
      });
    this.masonService.watchMasonRequest$()
      .pipe(
        filter(request => request.name === 'OFFSIDEBAR' && request.type === 'CLOSE'),
      )
      .subscribe(() => {
        this.animateExit();
      });
  }

}

@Directive({
  selector: 'MasonToaster',
})
export class MasonToasterComponentDirective implements OnInit, AfterViewInit, OnDestroy {

  private masonStore: MasonStore;
  private contextView: StackLayout;

  private closeEmitterSub: Subscription;
  private contentEmitterSub: Subscription;
  private masonEmitterSub: Subscription;

  constructor(
    @Inject(forwardRef(() => MasonComponent)) private masonComponent: MasonComponent,
    @Inject(forwardRef(() => MasonToasterComponent)) private masonContextComponent: MasonToasterComponent,
    @Inject(forwardRef(() => MasonHelperService)) private masonHelper: MasonHelperService,
    @Inject(forwardRef(() => MasonService)) private masonService: MasonService,
    @Inject(forwardRef(() => ModalDialogParams)) private modalDialogParams: ModalDialogParams,
  ) {
    this.masonStore = this.masonComponent.masonStore;
  }

  ngOnInit() {
    this.masonStore.setToasterState(true);
    this.initToaster();
    this.watchDismissEvent();
  }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this.masonStore.setToasterState(false);
    this.contentEmitterSub.unsubscribe();
    this.closeEmitterSub.unsubscribe();
    this.masonEmitterSub.unsubscribe();
  }

  private initToaster() {
    this.contentEmitterSub = this.masonContextComponent
      .modalContentEmitter
      .pipe(
        combineLatest(this.masonStore.getMasonRequest$),
      )
      .subscribe(([evt, request]) => {
        this.contextView = <StackLayout>evt.object;
        setTimeout(() => {
          const { contentHeight } = this.masonHelper.getViewDimensions(this.contextView);
          this.contextView.translateY = -1 * contentHeight;
          this.animateEntry();
          const timeout = this.masonContextComponent.timeout;
          if (timeout > 0) { setTimeout(() => this.animateExit(), timeout); }
        }, 10);
      });
  }

  private animateEntry() {
    const { pageInsetMargin } = this.masonHelper.getViewDimensions(this.contextView);
    this.contextView.animate({
      duration: 200,
      translate: { x: 0, y: pageInsetMargin },
      curve: AnimationCurve.easeInOut,
    });
  }

  private async animateExit() {
    const { contentHeight } = this.masonHelper.getViewDimensions(this.contextView);
    await this.contextView.animate({
      duration: 250,
      translate: { x: 0, y: -1 * contentHeight },
      curve: AnimationCurve.easeInOut,
    });
    this.modalDialogParams.closeCallback(this.modalDialogParams.context);
  }

  private watchDismissEvent() {
    this.closeEmitterSub = this.masonContextComponent
      .modalCloseEmitter
      .pipe(
        throttleTime(100),
        tap(),
        filter(evt => evt.object.id === MASON_MODAL_STACK_ID),
      )
      .subscribe(evt => {
        this.animateExit();
      });
    this.masonEmitterSub = this.masonService.watchMasonRequest$()
      .pipe(
        filter(request => request.name === 'TOASTER' && request.type === 'CLOSE'),
      )
      .subscribe(() => {
        this.animateExit();
      });
  }

}

@Directive({
  selector: 'MasonSnackbar',
})
export class MasonSnackbarComponentDirective implements OnInit, AfterViewInit, OnDestroy {

  private masonStore: MasonStore;
  private contextView: StackLayout;

  private closeEmitterSub: Subscription;
  private contentEmitterSub: Subscription;
  private masonEmitterSub: Subscription;

  constructor(
    @Inject(forwardRef(() => MasonComponent)) private masonComponent: MasonComponent,
    @Inject(forwardRef(() => MasonSnackbarComponent)) private masonContextComponent: MasonSnackbarComponent,
    @Inject(forwardRef(() => MasonHelperService)) private masonHelper: MasonHelperService,
    @Inject(forwardRef(() => MasonService)) private masonService: MasonService,
    @Inject(forwardRef(() => ModalDialogParams)) private modalDialogParams: ModalDialogParams,
  ) {
    this.masonStore = this.masonComponent.masonStore;
  }

  ngOnInit() {
    this.masonStore.setSnackbarState(true);
    this.initSnackbar();
    this.watchDismissEvent();
  }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this.masonStore.setSnackbarState(false);
    this.contentEmitterSub.unsubscribe();
    this.closeEmitterSub.unsubscribe();
    this.masonEmitterSub.unsubscribe();
  }

  private initSnackbar() {
    this.contentEmitterSub = this.masonContextComponent
      .modalContentEmitter
      .pipe(
        combineLatest(this.masonStore.getMasonRequest$),
      )
      .subscribe(([evt, request]) => {
        this.contextView = <StackLayout>evt.object;
        setTimeout(() => {
          const { contentHeight } = this.masonHelper.getViewDimensions(this.contextView);
          this.contextView.translateY = contentHeight;
          this.animateEntry();
          const timeout = this.masonContextComponent.timeout;
          if (timeout > 0) { setTimeout(() => this.animateExit(), timeout); }
        }, 10);
      });
  }

  private animateEntry() {
    const { pageInsetMargin } = this.masonHelper.getViewDimensions(this.contextView);
    this.contextView.animate({
      duration: 200,
      translate: { x: 0, y: -1 * pageInsetMargin },
      curve: AnimationCurve.easeInOut,
    });
  }

  private async animateExit() {
    const { contentHeight } = this.masonHelper.getViewDimensions(this.contextView);
    await this.contextView.animate({
      duration: 250,
      translate: { x: 0, y: contentHeight },
      curve: AnimationCurve.easeInOut,
    });
    this.modalDialogParams.closeCallback(this.modalDialogParams.context);
  }

  private watchDismissEvent() {
    this.closeEmitterSub = this.masonContextComponent
      .modalCloseEmitter
      .pipe(
        throttleTime(100),
        tap(),
        filter(evt => evt.object.id === MASON_MODAL_STACK_ID),
      )
      .subscribe(evt => {
        this.animateExit();
      });
    this.masonEmitterSub = this.masonService.watchMasonRequest$()
      .pipe(
        filter(request => request.name === 'SNACKBAR' && request.type === 'CLOSE'),
      )
      .subscribe(() => {
        this.animateExit();
      });
  }

}

@Directive({
  selector: 'MasonBottomSheet',
})
export class MasonBottomSheetComponentDirective implements OnInit, AfterViewInit, OnDestroy {

  private masonStore: MasonStore;
  private contextView: StackLayout;

  private closeEmitterSub: Subscription;
  private contentEmitterSub: Subscription;
  private masonEmitterSub: Subscription;

  constructor(
    @Inject(forwardRef(() => MasonComponent)) private masonComponent: MasonComponent,
    @Inject(forwardRef(() => MasonBottomSheetComponent)) private masonContextComponent: MasonBottomSheetComponent,
    @Inject(forwardRef(() => MasonHelperService)) private masonHelper: MasonHelperService,
    @Inject(forwardRef(() => MasonService)) private masonService: MasonService,
    @Inject(forwardRef(() => ModalDialogParams)) private modalDialogParams: ModalDialogParams,
  ) {
    this.masonStore = this.masonComponent.masonStore;
  }

  ngOnInit() {
    this.masonStore.setBottomSheetState(true);
    this.initBottomSheet();
    this.watchDismissEvent();
  }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this.masonStore.setBottomSheetState(false);
    this.contentEmitterSub.unsubscribe();
    this.closeEmitterSub.unsubscribe();
    this.masonEmitterSub.unsubscribe();
  }

  private initBottomSheet() {
    this.contentEmitterSub = this.masonContextComponent
      .modalContentEmitter
      .pipe(
        combineLatest(this.masonStore.getMasonRequest$),
      )
      .subscribe(([evt, request]) => {
        this.contextView = <StackLayout>evt.object;
        setTimeout(() => {
          const { contentHeight, pageWidth } = this.masonHelper.getViewDimensions(this.contextView);
          this.contextView.width = pageWidth;
          this.contextView.translateY = contentHeight;
          this.animateEntry();
          const timeout = 1 * this.masonContextComponent.timeout;
          if (timeout > 0) { setTimeout(() => this.animateExit(), timeout); }
        }, 10);
      });
  }

  private animateEntry() {
    const { pageInsetMargin } = this.masonHelper.getViewDimensions(this.contextView);
    this.contextView.animate({
      duration: 200,
      translate: { x: 0, y: -1 * pageInsetMargin },
      curve: AnimationCurve.easeInOut,
    });
  }

  private async animateExit() {
    const { contentHeight } = this.masonHelper.getViewDimensions(this.contextView);
    await this.contextView.animate({
      duration: 250,
      translate: { x: 0, y: contentHeight },
      curve: AnimationCurve.easeInOut,
    });
    this.modalDialogParams.closeCallback(this.modalDialogParams.context);
  }

  private watchDismissEvent() {
    this.closeEmitterSub = this.masonContextComponent
      .modalCloseEmitter
      .pipe(
        throttleTime(100),
        tap(),
        filter(evt => evt.object.id === MASON_MODAL_STACK_ID),
      )
      .subscribe(evt => {
        this.animateExit();
      });
    this.masonEmitterSub = this.masonService.watchMasonRequest$()
      .pipe(
        filter(request => request.name === 'BOTTOMSHEET' && request.type === 'CLOSE'),
      )
      .subscribe(() => {
        this.animateExit();
      });
  }

}

@Directive({
  selector: 'MasonMenu',
})
export class MasonMenuComponentDirective implements OnInit, AfterViewInit, OnDestroy {

  private masonStore: MasonStore;
  private contextView: StackLayout;

  private closeEmitterSub: Subscription;
  private contentEmitterSub: Subscription;
  private masonEmitterSub: Subscription;

  constructor(
    @Inject(forwardRef(() => MasonComponent)) private masonComponent: MasonComponent,
    @Inject(forwardRef(() => MasonMenuComponent)) private masonContextComponent: MasonMenuComponent,
    @Inject(forwardRef(() => MasonHelperService)) private masonHelper: MasonHelperService,
    @Inject(forwardRef(() => MasonService)) private masonService: MasonService,
    @Inject(forwardRef(() => ModalDialogParams)) private modalDialogParams: ModalDialogParams,
  ) {
    this.masonStore = this.masonComponent.masonStore;
  }

  ngOnInit() {
    this.masonStore.setMenuState(true);
    this.initMenu();
    this.watchDismissEvent();
  }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this.masonStore.setMenuState(false);
    this.contentEmitterSub.unsubscribe();
    this.closeEmitterSub.unsubscribe();
    this.masonEmitterSub.unsubscribe();
  }

  private initMenu() {
    this.contentEmitterSub = this.masonContextComponent
      .modalContentEmitter
      .pipe(
        combineLatest(this.masonStore.getMasonRequest$),
      )
      .subscribe(([evt, request]) => {
        setTimeout(() => {
          this.contextView = <StackLayout>evt.object;
          const { screenWidth, screenHeight, scale } = this.masonHelper.getViewDimensions(this.contextView);
          const menuParentRef = request.event.object as any;
          const sourceX = menuParentRef.getLocationInWindow().x;
          const sourceY = menuParentRef.getLocationInWindow().y;
          const sourceHeight = menuParentRef.getMeasuredHeight() / scale;
          const sourceWidth = menuParentRef.getMeasuredWidth() / scale;
          const contextWidth = this.contextView.getMeasuredWidth() / scale;
          const contextHeight = this.contextView.getMeasuredHeight() / scale;
          console.dir({ sourceX, sourceY, sourceHeight, sourceWidth, contextHeight, contextWidth, screenHeight, screenWidth });

          const position = this.masonContextComponent.position;
          const offsetX = 5;
          const offsetY = 15;
          this.contextView.translateX = (position.includes('left')) ? sourceX + offsetX : sourceX + sourceWidth - contextWidth;
          this.contextView.translateY = (position.includes('bottom')) ? sourceY + sourceHeight + offsetY : sourceY - contextHeight + offsetY;
          this.contextView.originX = 0;
          this.contextView.scaleX = 0;
          this.contextView.scaleY = 0;

          this.animateEntry();
          const timeout = 1 * this.masonContextComponent.timeout;
          if (timeout > 0) { setTimeout(() => this.animateExit(), timeout); }
        }, 10);
      });
  }

  private async animateEntry() {
    this.contextView.animate({
      duration: 200,
      scale: { x: 1, y: 1 },
      curve: AnimationCurve.ease,
    });
  }

  private async animateExit() {
    this.modalDialogParams.closeCallback(this.modalDialogParams.context);
  }

  private watchDismissEvent() {
    this.closeEmitterSub = this.masonContextComponent
      .modalCloseEmitter
      .pipe(
        throttleTime(100),
        tap(),
        filter(evt => evt.object.id === MASON_MODAL_STACK_ID),
      )
      .subscribe(evt => {
        this.animateExit();
      });
    this.masonEmitterSub = this.masonService.watchMasonRequest$()
      .pipe(
        filter(request => request.name === 'SNACKBAR' && request.type === 'CLOSE'),
      )
      .subscribe(() => {
        this.animateExit();
      });
  }

}

@Directive({
  selector: 'MasonDialog',
})
export class MasonDialogComponentDirective implements OnInit, AfterViewInit, OnDestroy {

  private masonStore: MasonStore;
  private contextView: StackLayout;

  private closeEmitterSub: Subscription;
  private contentEmitterSub: Subscription;
  private masonEmitterSub: Subscription;

  constructor(
    @Inject(forwardRef(() => MasonComponent)) private masonComponent: MasonComponent,
    @Inject(forwardRef(() => MasonDialogComponent)) private masonContextComponent: MasonDialogComponent,
    @Inject(forwardRef(() => MasonService)) private masonService: MasonService,
    @Inject(forwardRef(() => ModalDialogParams)) private modalDialogParams: ModalDialogParams,
  ) {
    this.masonStore = this.masonComponent.masonStore;
  }

  ngOnInit() {
    this.masonStore.setDialogState(true);
    this.initDialog();
    this.watchDismissEvent();
  }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this.masonStore.setDialogState(false);
    this.contentEmitterSub.unsubscribe();
    this.closeEmitterSub.unsubscribe();
    this.masonEmitterSub.unsubscribe();
  }

  private initDialog() {
    this.contentEmitterSub = this.masonContextComponent
      .modalContentEmitter
      .pipe(
        combineLatest(this.masonStore.getMasonRequest$),
      )
      .subscribe(([evt, request]) => {
        this.contextView = <StackLayout>evt.object;
        setTimeout(() => {
          this.contextView.scaleX = 0;
          this.contextView.scaleY = 0;
          this.animateEntry();
          const timeout = 1 * this.masonContextComponent.timeout;
          if (timeout > 0) { setTimeout(() => this.animateExit(), timeout); }
        }, 10);
      });
  }

  private async animateEntry() {
    this.contextView.animate({
      duration: 200,
      scale: { x: 1, y: 1 },
      curve: AnimationCurve.ease,
    });
  }

  private async animateExit() {
    this.modalDialogParams.closeCallback(this.modalDialogParams.context);
  }

  private watchDismissEvent() {
    this.closeEmitterSub = this.masonContextComponent
      .modalCloseEmitter
      .pipe(
        throttleTime(100),
        tap(),
        filter(evt => evt.object.id === MASON_MODAL_STACK_ID),
      )
      .subscribe(evt => {
        this.animateExit();
      });
    this.masonEmitterSub = this.masonService.watchMasonRequest$()
      .pipe(
        filter(request => request.name === 'DIALOG' && request.type === 'CLOSE'),
      )
      .subscribe(() => {
        this.animateExit();
      });
  }

}
