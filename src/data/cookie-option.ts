import { OptionsType } from "cookies-next";

const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
const expires = new Date(Date.now() + thirtyDaysInMilliseconds);

const cookieOptions: OptionsType = {
  expires, // Set the expiration to 30 days from now
  path: "/",
  secure: true,
  // httpOnly: true,
  sameSite: "strict",
};

export { cookieOptions };
