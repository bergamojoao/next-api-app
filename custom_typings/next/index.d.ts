import { NextApiRequest, NextApiResponse } from "next";

import { IUser } from "models/user";

interface NextAuthRequest extends NextApiRequest {
  account: IUser;
}