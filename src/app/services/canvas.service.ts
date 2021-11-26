import { ElementRef, Injectable } from '@angular/core';
import { ElementNode } from '../models/element';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  elementNodes = [];
  groupNodes = [];
  connections = [];
  public setLocation(elementRef: ElementRef, elementNode: ElementNode) {
    elementRef.nativeElement.style.top = elementNode?.top + 'px';
    elementRef.nativeElement.style.left = elementNode?.left + 'px';
  }
}
