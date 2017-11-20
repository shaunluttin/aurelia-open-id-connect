import { autoinject } from "aurelia-framework";
import { RouterConfiguration } from "aurelia-router";
import {
    User,
    UserManager,
    UserManagerEvents,
} from "oidc-client";
import OpenIdConnectLogger from "./open-id-connect-logger";
import OpenIdConnectRouting from "./open-id-connect-routing";

@autoinject
export default class OpenIdConnect {

    constructor(
        private openIdConnectRouting: OpenIdConnectRouting,
        public logger: OpenIdConnectLogger,
        public userManager: UserManager) { }

    public configure(routerConfiguration: RouterConfiguration) {

        if (typeof routerConfiguration === "undefined" || routerConfiguration === null) {
            throw new Error("routerConfiguration parameter must not be undefined or null");
        }

        this.openIdConnectRouting.configureRouter(routerConfiguration);
    }

    public async login(): Promise<void> {
        const args: any = {};
        await this.userManager.signinRedirect(args);
    }

    public async logout(): Promise<void> {
        const args: any = {};
        await this.userManager.signoutRedirect(args);
    }

    public loginSilent(): Promise<User> {
        const args: any = {};
        return this.userManager.signinSilent(args);
    }

    public getUser(): Promise<User> {
        return this.userManager.getUser();
    }

    public handlers(key: keyof UserManagerEvents, handler: eventHandler) {
        if (!key.startsWith("add") && !key.startsWith("remove")) {
            let message = "The 'handlers' method expects a 'key' argument ";
            message += "that starts with either 'add' or 'remove'. Instead we ";
            message += "recevied " + key;
            throw new TypeError(message);
        }

        const addOrRemoveEventHandler: any = this.userManager.events[key];
        addOrRemoveEventHandler(handler);
    }
}

export type eventHandler = (...ev: any[]) => void;
