import { Injectable } from '@angular/core';

import { ComponentStore } from '@ngrx/component-store';

import { IMasonRequest } from './mason.service';

export interface IMasonStoreState {
  masonRequest: IMasonRequest;
  isHeaderActive: boolean;
  isFooterActive: boolean;
  isSidebarActive: boolean;
  isOffSidebarActive: boolean;
  isToasterActive: boolean;
  isSnackbarActive: boolean;
  isDialogActive: boolean;
  isMenuActive: boolean;
  isBottomSheetActive: boolean;
}

export const DEFAULT_STATE: IMasonStoreState = {
  masonRequest: undefined,
  isHeaderActive: undefined,
  isFooterActive: undefined,
  isSidebarActive: undefined,
  isOffSidebarActive: undefined,
  isToasterActive: undefined,
  isSnackbarActive: undefined,
  isDialogActive: undefined,
  isMenuActive: undefined,
  isBottomSheetActive: undefined,
};

@Injectable()
export class MasonStore extends ComponentStore<IMasonStoreState> {

  constructor() {
    super(DEFAULT_STATE);
  }

  readonly getMasonRequest$ = this.select(state => state.masonRequest);
  readonly setMasonRequest = this.updater((state: IMasonStoreState, masonRequest: IMasonRequest) => ({ ...state, masonRequest }));

  readonly isHeaderActive$ = this.select(state => state.isHeaderActive);
  readonly setHeaderState = this.updater((state: IMasonStoreState, isHeaderActive: boolean) => ({ ...state, isHeaderActive }));

  readonly isFooterActive$ = this.select(state => state.isFooterActive);
  readonly setFooterState = this.updater((state: IMasonStoreState, isFooterActive: boolean) => ({ ...state, isFooterActive }));

  readonly isSidebarActive$ = this.select(state => state.isSidebarActive);
  readonly setSidebarState = this.updater((state: IMasonStoreState, isSidebarActive: boolean) => ({ ...state, isSidebarActive }));

  readonly isOffSidebarActive$ = this.select(state => state.isOffSidebarActive);
  readonly setOffSidebarState = this.updater((state: IMasonStoreState, isOffSidebarActive: boolean) => ({ ...state, isOffSidebarActive }));

  readonly isToasterActive$ = this.select(state => state.isToasterActive);
  readonly setToasterState = this.updater((state: IMasonStoreState, isToasterActive: boolean) => ({ ...state, isToasterActive }));

  readonly isSnackbarActive$ = this.select(state => state.isSnackbarActive);
  readonly setSnackbarState = this.updater((state: IMasonStoreState, isSnackbarActive: boolean) => ({ ...state, isSnackbarActive }));

  readonly isDialogActive$ = this.select(state => state.isDialogActive);
  readonly setDialogState = this.updater((state: IMasonStoreState, isDialogActive: boolean) => ({ ...state, isDialogActive }));

  readonly isMenuActive$ = this.select(state => state.isMenuActive);
  readonly setMenuState = this.updater((state: IMasonStoreState, isMenuActive: boolean) => ({ ...state, isMenuActive }));

  readonly isBottomSheetActive$ = this.select(state => state.isBottomSheetActive);
  readonly setBottomSheetState = this.updater((state: IMasonStoreState, isBottomSheetActive: boolean) => ({ ...state, isBottomSheetActive }));

}
