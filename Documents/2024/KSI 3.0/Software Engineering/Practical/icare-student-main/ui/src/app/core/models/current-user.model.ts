export interface LoggedInSession {
  sessionId: string;
  authenticated: boolean;
  user: any;
  locale: string;
  allowedLocales: string[];
  sessionLocation: any;
  encodedCredentials: string;
}
