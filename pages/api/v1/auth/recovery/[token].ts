import nextConnect, { NextHandler } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "models/validator";
import { onErrorHandler } from "models/controller";
import { updateUserPassword } from "models/user";
import { recoveryMiddleware } from "models/authorization";
import { NextTokenRequest } from "custom_typings/next";

export default nextConnect({
  attachParams: true,
  onError: onErrorHandler,
})
.use(recoveryMiddleware)
.post(postValidationHandler, recoveryByTokenHandler);

function postValidationHandler(
  request: NextApiRequest,
  _: NextApiResponse,
  next: NextHandler
) {
  const cleanValues = validator(request.body, {
    password: "required",
  });

  request.body = cleanValues;

  next();
}

async function recoveryByTokenHandler(
  request: NextTokenRequest,
  response: NextApiResponse
) {
  await updateUserPassword(request.account.id, request.body.password);
  response.status(200).send({
    message: "ok",
  });
}
