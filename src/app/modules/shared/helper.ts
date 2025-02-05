import { Router } from "@angular/router";

export class Helper {
    public static openInNewTab(url: string, router: Router) {
        const serializedUrl = router.serializeUrl(router.createUrlTree([url]));
        window.open(serializedUrl, '_blank');
      }
}