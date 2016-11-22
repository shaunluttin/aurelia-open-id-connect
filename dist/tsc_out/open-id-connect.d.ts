import { RouterConfiguration } from "aurelia-router";
import { UserManager, User } from "oidc-client";
import { OpenIdConnectRouting } from "./open-id-connect-routing";
import { OpenIdConnectLogger } from "./open-id-connect-logger";
export declare class OpenIdConnect {
    private routerConfigurationService;
    private logger;
    userManager: UserManager;
    constructor(routerConfigurationService: OpenIdConnectRouting, logger: OpenIdConnectLogger, userManager: UserManager);
    configure(routerConfiguration: RouterConfiguration): void;
    login(): void;
    loginSilent(): Promise<User>;
    logout(): void;
    loginRedirectHandler(userManager: UserManager, logger: OpenIdConnectLogger): Promise<any>;
    loginSilentRedirectHandler(userManager: UserManager, logger: OpenIdConnectLogger): Promise<any>;
    postLogoutRedirectHandler(userManager: UserManager, logger: OpenIdConnectLogger): Promise<any>;
}
