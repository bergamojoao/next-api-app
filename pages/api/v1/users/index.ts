import nextConnect, { NextHandler } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "models/user";
import validator from "models/validator";
import { onErrorHandler } from "models/controller";
import { adminAuthMiddleware } from "models/authorization";
export default nextConnect({
  attachParams: true,
  onError: onErrorHandler,
})
.post(adminAuthMiddleware, postValidationHandler, createUserHandler);

function postValidationHandler(
  request: NextApiRequest,
  _: NextApiResponse,
  next: NextHandler
) {
  const cleanValues = validator(request.body, {
    email: "required",
    password: "required",
    name: "required",
  });

  request.body = cleanValues;

  next();
}

async function createUserHandler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { email, password, name } = request.body;
  const result = await createUser(name, email, password);
  response.status(200).json(result);
}
