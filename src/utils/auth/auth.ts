import { AuthModule } from "./AuthModule";
import { FetchManager } from "./FetchManager";
import { GRAPH_CONFIG } from "./Constants";
import { MailInfo } from "./GraphReponseTypes";
import { AuthenticationResult, Configuration, LogLevel  } from "@azure/msal-browser";

/**
 * Configuration class for @azure/msal-browser: 
 * https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/modules/_src_config_configuration_.html
 */
const MSAL_CONFIG: Configuration = {
    auth: {
        clientId: "47b39d5c-ea91-4018-ba4b-06244c5de091"
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {	
                    return;	
                }	
                switch (level) {	
                    case LogLevel.Error:	
                        console.error(message);	
                        return;	
                    case LogLevel.Info:	
                        console.info(message);	
                        return;	
                    case LogLevel.Verbose:	
                        console.debug(message);	
                        return;	
                    case LogLevel.Warning:	
                        console.warn(message);	
                        return;	
                }
            }
        }
    }
};

// Add here scopes for access token to be used at MS Graph API endpoints.
const loginRequest = {
    scopes: []
};

const loginRedirectRequest = {
    ...loginRequest,
    redirectStartPage: window.location.href
};

const silentLoginRequest = {
    loginHint: "todo"
};

// Calendar
const calendarRequest = {
    scopes: ["Calendars.Read"]
};

const calendarRedirectRequest = {
    ...calendarRequest,
    redirectStartPage: window.location.href
};

const silentCalendarRequest = {
    scopes: ["openid", "profile", "Calendars.Read"],
    account: undefined,
    forceRefresh: false
};

// Mail
const mailRequest = {
    scopes: ["Mail.Read"]
};

const mailRedirectRequest = {
    ...mailRequest,
    redirectStartPage: window.location.href
};

const silentMailRequest = {
    scopes: ["openid", "profile", "Mail.Read"],
    account: undefined,
    forceRefresh: false
};

// Profile
const profileRequest = {
    scopes: ["User.Read"]
};

const profileRedirectRequest = {
    ...profileRequest,
    redirectStartPage: window.location.href
};

const silentProfileRequest = {
    scopes: ["openid", "profile", "User.Read"],
    account: undefined,
    forceRefresh: false
};

export const authModule: AuthModule = new AuthModule(MSAL_CONFIG);
const networkModule: FetchManager = new FetchManager();

// Load auth module when browser window loads. Only required for redirect flows.
window.addEventListener("load", async () => {
    authModule.loadAuthModule();
});

export function loginPopup(): Promise<AuthenticationResult> {
    return authModule.loginPopup(loginRequest);
}

export function loginRedirect(): Promise<void> {
    return authModule.loginRedirect(loginRedirectRequest);
}

export function signOut(): void {
    authModule.logout();
}

export async function seeProfile() {
    const token = await authModule.getTokenPopup(silentProfileRequest, profileRequest);
    if (token && token.length > 0) {
        return networkModule.callEndpointWithToken(GRAPH_CONFIG.GRAPH_ME_ENDPT, token);
    }
}

export async function readMail() {
    const token = await authModule.getTokenPopup(silentMailRequest, profileRequest);
    if (token && token.length > 0) {
        return networkModule.callEndpointWithToken(GRAPH_CONFIG.GRAPH_MAIL_ENDPT, token);
    }
}

export async function readCalendar() {
    const token = await authModule.getTokenPopup(silentCalendarRequest, calendarRequest);
    if (token && token.length > 0) {
        return networkModule.callEndpointWithToken(GRAPH_CONFIG.GRAPH_CALENDAR_ENDPOINT, token);
    }
}

export function attemptSsoSilent(): void {
    authModule.attemptSsoSilent(silentLoginRequest);
}
