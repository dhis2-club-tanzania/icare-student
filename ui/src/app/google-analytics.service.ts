import { Injectable } from '@angular/core';

declare var gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  sendAnalytics(moduleName: string ,eventAction: string, page:string) {
    const clientName = this.extractClientNameFromDomain(window.location.href);
    gtag('event', eventAction, {
      'page': page,
      'module_name': moduleName,
      'client_name': clientName
    });
  }
  private extractClientNameFromDomain(url: string): string {
    try {
      const parsedUrl = new URL(url); 
      const hostnameParts = parsedUrl.hostname.split('.'); 

      return hostnameParts[0];
    } catch (error) {
      console.error('Error parsing URL:', url, error);
      return ''; 
    }
  }
}
