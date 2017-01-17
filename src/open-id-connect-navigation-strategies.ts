import { autoinject } from "aurelia-framework";
import { NavigationInstruction } from "aurelia-router";
import { UserManager } from "oidc-client";
import OpenIdConnectLogger from "./open-id-connect-logger";
import OpenIdConnectConfiguration from "./open-id-connect-configuration";

@autoinject
export default class OpenIdConnectNavigationStrategies {

    constructor(
        private logger: OpenIdConnectLogger,
        private openIdConnectConfiguration: OpenIdConnectConfiguration,
        private userManager: UserManager) { }

    public login(instruction: NavigationInstruction): Promise<any> {
        let args: any = {};
        return this.userManager.signinRedirect(args);
    }

    public logout(instruction: NavigationInstruction): Promise<any> {
        let args: any = {};
        return this.userManager.signoutRedirect(args);
    }

    public signInRedirectCallback(instruction: NavigationInstruction): Promise<any> {

        let callbackHandler: Function = () => {
            return this.userManager.getUser().then((user) => {
                // getUser()
                // Sign in only if we do not already have a user;
                // otherwise, we receive a 'No matching state found in storage' error.
                if (user === null || user === undefined) {
                    let args: any = {};
                    return this.userManager.signinRedirectCallback(args);
                }
            });
        };

        let postCallbackRedirect: Function = () => {
            instruction.config.moduleId = this.openIdConnectConfiguration.loginRedirectModuleId;
        };

        return this.runHandlers(callbackHandler, postCallbackRedirect);
    }

    public silentSignICallback(instruction: NavigationInstruction): Promise<any> {

        let callbackHandler: Function = () => {

            this.userManager.clearStaleState().then(() => {
                // clearStaleState()
                // Clear existing state first;
                // otherwise, we receive a 'No matching state found in storage' error. 
                let args: any = {};
                return this.userManager.signinSilentCallback(args);
            });

        };

        let postCallbackRedirect: Function = () => {
            instruction.config.moduleId = "THIS_HAPPENS_IN_A_CHILD_I_FRAME";
        };

        return this.runHandlers(callbackHandler, postCallbackRedirect);
    }

    public signoutRedirectCallback(instruction: NavigationInstruction): Promise<any> {
        let callbackHandler: Function = () => {
            let args: any = {};
            return this.userManager.signoutRedirectCallback(args);
        };

        let postCallbackRedirect: Function = () => {
            instruction.config.moduleId = this.openIdConnectConfiguration.logoutRedirectModuleId;
        };

        return this.runHandlers(callbackHandler, postCallbackRedirect);
    }

    private runHandlers(callbackHandler: Function, postCallbackRedirect: Function) {
        return callbackHandler()
            .then(() => postCallbackRedirect())
            .catch((err) => {
                postCallbackRedirect();
                throw err;
            });
    }
}