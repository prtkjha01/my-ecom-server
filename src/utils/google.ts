import { OAuth2Client } from "google-auth-library";

export const google = new OAuth2Client(process.env.OAUTH_CLIENT_ID);
export const verifyGoogleToken = async (token: string) => {
  try {
    const ticket = await google.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID,
    });

    return ticket.getPayload();
  } catch (error: any) {
    throw new Error(error);
  }
};
