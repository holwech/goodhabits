import { PublicClientApplication, SilentRequest, AuthenticationResult, Configuration, LogLevel, AccountInfo, InteractionRequiredAuthError, RedirectRequest, PopupRequest, EndSessionRequest } from "@azure/msal-browser";
import { SsoSilentRequest } from "@azure/msal-browser/dist/src/request/SsoSilentRequest";


/**
 * AuthModule for application - handles authentication in app.
 */
export class AuthModule {

    private msal: PublicClientApplication; // https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/classes/_src_app_publicclientapplication_.publicclientapplication.html
    private account?: AccountInfo; // https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-common/modules/_src_account_accountinfo_.html

    constructor(msal_config: Configuration) {
        this.msal = new PublicClientApplication(msal_config);

    }

    /**
     * Calls getAllAccounts and determines the correct account to sign into, currently defaults to first account found in cache.
     * TODO: Add account chooser code
     * 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    private getAccount(): AccountInfo | undefined {
        // need to call getAccount here?
        const currentAccounts = this.msal.getAllAccounts();

        if (currentAccounts.length > 1) {
            // Add choose account code here
            console.log("Multiple accounts detected, need to add choose account code.");
            return currentAccounts[0];
        } else if (currentAccounts.length === 1) {
            return currentAccounts[0];
        }
        console.log("No accounts detected");
        return undefined;
    }

    /**
     * Checks whether we are in the middle of a redirect and handles state accordingly. Only required for redirect flows.
     * 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md#redirect-apis
     */
    async loadAuthModule(): Promise<AuthenticationResult | null> {
        const resp = await this.msal.handleRedirectPromise();
        this.account = resp?.account!;
        return resp;
    }

    /**
     * Calls ssoSilent to attempt silent flow. If it fails due to interaction required error, it will prompt the user to login using popup.
     * @param request 
     */
    async attemptSsoSilent(silentLoginRequest: SsoSilentRequest) {
        await this.msal.ssoSilent(silentLoginRequest)
        this.account = this.getAccount();
        return this.account;
    }

    async loginPopup(loginRequest: PopupRequest) {
        const resp =  await this.msal.loginPopup(loginRequest);
        console.log(this.getAccount());
        this.account = resp.account!;
        return resp;
    }

    loginRedirect(loginRedirectRequest: RedirectRequest) {
        return this.msal.loginRedirect(loginRedirectRequest);
    }

    /**
     * Logs out of current account.
     */
    logout(): void {
        const logOutRequest: EndSessionRequest = {
            account: this.account
        };

        this.msal.logout(logOutRequest);
    }

    /**
     * Gets a token silently, or falls back to interactive popup.
     */
    public async getTokenPopup(silentRequest: SilentRequest, interactiveRequest: PopupRequest): Promise<string | undefined> {
        try {
            silentRequest.account = this.account;
            console.log(silentRequest);
            const response: AuthenticationResult = await this.msal.acquireTokenSilent(silentRequest);
            return response.accessToken;
        } catch (e) {
            console.log("silent token acquisition fails.");
            const resp = await this.msal.acquireTokenPopup(interactiveRequest);
            return resp.accessToken;
        }
    }

    /**
     * Gets a token silently, or falls back to interactive redirect.
     */
    public async getTokenRedirect(silentRequest: SilentRequest, interactiveRequest: RedirectRequest): Promise<string | undefined> {
        try {
            silentRequest.account = this.account;
            const response = await this.msal.acquireTokenSilent(silentRequest);
            return response.accessToken;
        } catch (e) {
            console.log("silent token acquisition fails.");
            if (e instanceof InteractionRequiredAuthError) {
                console.log("acquiring token using redirect");
                this.msal.acquireTokenRedirect(interactiveRequest);
            } else {
                throw e;
            }
        }
        return undefined;
    }
}
