import { NextApiRequest, NextApiResponse } from "next";

export function onErrorHandler(
  error: any,
  request: NextApiRequest,
  response: NextApiResponse
) {
  response.status(error.statusCode).send(error);
}
