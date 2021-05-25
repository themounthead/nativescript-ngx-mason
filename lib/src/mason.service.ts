import { Injectable } from '@angular/core';

import { AnimationCurve } from 'tns-core-modules/ui/enums';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';

import { Observable, Subject } from 'rxjs';

export interface IMasonRequest {
  name: 'SIDEBAR' | 'OFFSIDEBAR' | 'MENU' | 'TOASTER' | 'SNACKBAR' | 'BOTTOMSHEET' | 'DIALOG';
  type: 'OPEN' | 'CLOSE' | 'TOGGLE';
  event?: TouchGestureEventData;
  component?: any;
  options?: {
    context?: any;
    dim?: number;
    animation?: {
      curve: typeof AnimationCurve;
      delay: number;
      duration: number;
    };
  };
}

@Injectable({ providedIn: 'root' })
export class MasonService {

  private serviceRequestHandler = new Subject<IMasonRequest>();
  private serviceResponseHandler = new Subject<any>();

  public _setModalResponse = (result) => this.serviceResponseHandler.next(result);

  public watchMasonRequest$(): Observable<IMasonRequest> { return this.serviceRequestHandler.asObservable(); }
  public watchMasonResponse$(): Observable<IMasonRequest> { return this.serviceResponseHandler.asObservable(); }

  public async toggleSidebar(component, options?) { this.serviceRequestHandler.next({ name: 'SIDEBAR', type: 'TOGGLE', component, options }); }
  public async openSidebar(component, options?) { this.serviceRequestHandler.next({ name: 'SIDEBAR', type: 'OPEN', component, options }); }
  public async dismissSidebar(options?) { this.serviceRequestHandler.next({ name: 'SIDEBAR', type: 'CLOSE', options }); }

  public async toggleOffSidebar(component, options?) { this.serviceRequestHandler.next({ name: 'OFFSIDEBAR', type: 'TOGGLE', component, options }); }
  public async openOffSidebar(component, options?) { this.serviceRequestHandler.next({ name: 'OFFSIDEBAR', type: 'OPEN', component, options }); }
  public async dismissOffSidebar(options?) { this.serviceRequestHandler.next({ name: 'OFFSIDEBAR', type: 'CLOSE', options }); }

  public async toggleToaster(component, options?) { this.serviceRequestHandler.next({ name: 'TOASTER', type: 'TOGGLE', component, options }); }
  public async openToaster(component, options?) { this.serviceRequestHandler.next({ name: 'TOASTER', type: 'OPEN', component, options }); }
  public async dismissToaster(options?) { this.serviceRequestHandler.next({ name: 'TOASTER', type: 'CLOSE', options }); }

  public async toggleSnackbar(component, options?) { this.serviceRequestHandler.next({ name: 'SNACKBAR', type: 'TOGGLE', component, options }); }
  public async openSnackbar(component, options?) { this.serviceRequestHandler.next({ name: 'SNACKBAR', type: 'OPEN', component, options }); }
  public async dismissSnackbar(options?) { this.serviceRequestHandler.next({ name: 'SNACKBAR', type: 'CLOSE', options }); }

  public async toggleBottomSheet(component, options?) { this.serviceRequestHandler.next({ name: 'BOTTOMSHEET', type: 'TOGGLE', component, options }); }
  public async openBottomSheet(component, options?) { this.serviceRequestHandler.next({ name: 'BOTTOMSHEET', type: 'OPEN', component, options }); }
  public async dismissBottomSheet(options?) { this.serviceRequestHandler.next({ name: 'BOTTOMSHEET', type: 'CLOSE', options }); }

  public async toggleDialog(component, options?) { this.serviceRequestHandler.next({ name: 'DIALOG', type: 'TOGGLE', component, options }); }
  public async openDialog(component, options?) { this.serviceRequestHandler.next({ name: 'DIALOG', type: 'OPEN', component, options }); }
  public async dismissDialog(options?) { this.serviceRequestHandler.next({ name: 'DIALOG', type: 'CLOSE', options }); }

  public async toggleMenu(component, event, options?) { this.serviceRequestHandler.next({ name: 'MENU', type: 'TOGGLE', component, event, options }); }
  public async openMenu(component, event, options?) { this.serviceRequestHandler.next({ name: 'MENU', type: 'OPEN', component, event, options }); }
  public async dismissMenu(options?) { this.serviceRequestHandler.next({ name: 'MENU', type: 'CLOSE', options }); }

}
