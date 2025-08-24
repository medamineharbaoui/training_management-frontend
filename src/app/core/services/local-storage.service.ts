    import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
    import { isPlatformBrowser } from '@angular/common';

    @Injectable({ providedIn: 'root' })
    export class LocalStorageService {
      private isBrowser: boolean;

      constructor(@Inject(PLATFORM_ID) private platformId: object) {
        this.isBrowser = isPlatformBrowser(platformId);
      }

      getItem(key: string): string | null {
        if (this.isBrowser) {
          return localStorage.getItem(key);
        }
        return null; // Or return a default value/mock
      }

      setItem(key: string, value: string): void {
        if (this.isBrowser) {
          localStorage.setItem(key, value);
        }
      }
      // ... other localStorage methods
    }