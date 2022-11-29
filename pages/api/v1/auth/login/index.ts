import nextConnect, { NextHandler } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { userLogin } from "models/user";
import validator from "models/validator";
import { onErrorHandler } from "models/controller";

export default nextConnect({
  attachParams: true,
  onError: onErrorHandler,
}).post(postValidationHandler, loginHandler);

function postValidationHandler(
  request: NextApiRequest,
  _: NextApiResponse,
  next: NextHandler
) {
  const cleanValues = validator(request.body, {
    email: "required",
    password: "required",
  });

  request.body = cleanValues;

  next();
}

async function loginHandler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { email, password } = request.body;
  const { id, token } = await userLogin(email, password);
  response.status(200).json({ id, token });
}
