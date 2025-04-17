import { DatePipe } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { OidcSecurityService, PublicEventsService } from "angular-auth-oidc-client";
import { NotificationService } from "./modules/auth/services/Notification/notification.service";
import { BuyersPartnumbersListService } from "./modules/dashboard/services/Buyers-PartnumbersList/buyers-partnumbers-list.service";
import { CommitsService } from "./modules/dashboard/services/Commits/commits.service";
import { SupplyVisibilityCommentService } from "./modules/dashboard/services/Supply-Visibility-Comment/supply-visibility-comment.service";
import { SupplyVisibilityNotesService } from "./modules/dashboard/services/Supply-Visibility-Notes/supply-visibility-notes.service";
import { SupplyVisibilityPredefinedCommentService } from "./modules/dashboard/services/Supply-Visibility-Predefined-Comment/supply-visibility-predefined-comment.service";
import { SupplyVisibilityService } from "./modules/dashboard/services/Supply-Visibility/supply-visibility.service";
import { ConfigService } from "./services/config.service";
import { DateService } from "./services/Date/date.service";

export const APP_SERVICES = [
    ConfigService,
    SupplyVisibilityService,
    DatePipe,
    CommitsService,
    SupplyVisibilityCommentService,
    SupplyVisibilityPredefinedCommentService,
    SupplyVisibilityNotesService,
    BuyersPartnumbersListService,
    TranslateService,
    DateService,
    OidcSecurityService,
    PublicEventsService,
    NotificationService
];