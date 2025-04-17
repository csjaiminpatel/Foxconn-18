import { AuthenticationState } from "./modules/auth/store/authentication.state";
import { LanguageState } from "./modules/auth/store/language/language.state";
import { ApprovedVendorListState } from "./modules/dashboard/stores/approved-vendor-list/approved-vendor-list.state";
import { BufferRulesState } from "./modules/dashboard/stores/buffer-rule/buffer-rules.state";
import { SupplyVisibilityState } from "./modules/dashboard/stores/supply-visibility/supply-visibility.state";

export const APP_STATES = [ 
    AuthenticationState,
    LanguageState,
    ApprovedVendorListState,
    BufferRulesState,
    SupplyVisibilityState
];