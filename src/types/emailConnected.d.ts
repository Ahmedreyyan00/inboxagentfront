export interface GooglePayload {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    at_hash: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    iat: number;
    exp: number;
  }
  
  export interface GoogleIntegration {
    connected: boolean;
    token: string;
    payload: GooglePayload;
    _id: string;
    createdAt: string; // or Date
    updatedAt: string; // or Date
  }
  
  export interface IEmailIntegration {
    _id: string;
    user: string;
    __v: number;
    google: GoogleIntegration;
  }
  