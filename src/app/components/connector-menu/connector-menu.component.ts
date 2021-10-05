import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-connector-menu',
  templateUrl: './connector-menu.component.html',
  styleUrls: ['./connector-menu.component.scss'],
})
export class ConnectorMenuComponent implements OnInit {
  constructor(public elementRef: ElementRef) {}

  ngOnInit(): void {}
}
