import { NextApiRequest, NextApiResponse } from "next";

import { IUser } from "models/user";

interface NextTokenRequest extends NextApiRequest {
  account: IUser;
}