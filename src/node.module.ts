import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UniversalModule, isBrowser, isNode } from 'angular2-universal/node'; // for AoT we need to manually split universal packages

import { AppModule, AppComponent } from './+app/app.module';
import { MaterialModule } from '@angular/material'

import { SharedModule } from './+app/shared/shared.module';
import { CacheService } from './+app/shared/cache.service';

// Will be merged into @angular/platform-browser in a later release
// see https://github.com/angular/angular/pull/12322
// import { Meta } from './angular2-meta';

export function getLRU() {
  return new Map();
}
export function getRequest() {
  return {};
}
export function getResponse() {
  return {};
}

// TODO(gdi2290): refactor into Universal
export const UNIVERSAL_KEY = 'UNIVERSAL_CACHE';

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    FormsModule,
    RouterModule.forRoot([], { useHash: false }),

    MaterialModule.forRoot(),
    UniversalModule, // BrowserModule, HttpModule, and JsonpModule are included

    SharedModule.forRoot(),
    AppModule,
  ],
  providers: [
    { provide: 'isBrowser', useValue: isBrowser },
    { provide: 'isNode', useValue: isNode },

    { provide: 'req', useFactory: getRequest },
    { provide: 'res', useFactory: getResponse },

    { provide: 'LRU', useFactory: getLRU, deps: [] },

    CacheService,

   // Meta,
  ]
})
export class MainModule {
  constructor(public cache: CacheService) {
  }

  /**
   * We need to use the arrow function here to bind the context as this is a gotcha
   * in Universal for now until it's fixed
   */
  universalDoDehydrate = (universalCache) => {
    universalCache[CacheService.KEY] = JSON.stringify(this.cache.dehydrate());
  }

 /**
  * Clear the cache after it's rendered
  */
  universalAfterDehydrate = () => {
    // comment out if LRU provided at platform level to be shared between each user
    this.cache.clear();
  }
}
