import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OuiIconRegistry } from '@oncehub/ui';

const icomoonTwentyByTwentyIcon =
  'https://d1azc1qln24ryf.cloudfront.net/135790/oncehub-20/symbol-defs.svg?r1x0js';
const icomoonTwentyFourByTwentyFourIcon =
  'https://d1azc1qln24ryf.cloudfront.net/135790/oncehub-24/symbol-defs.svg?v4dk5s';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-jsplumb-poc';

  constructor(
    private ouiIconRegistry: OuiIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadAllIcons();
  }

  loadAllIcons() {
    this.ouiIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        icomoonTwentyByTwentyIcon
      )
    );

    this.ouiIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        icomoonTwentyFourByTwentyFourIcon
      )
    );
  }
}
