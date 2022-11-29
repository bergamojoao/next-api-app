import nextConnect, { NextHandler } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "models/validator";
import { sendRecoveryEmail } from "models/recover-password";
import { onErrorHandler } from "models/controller";

export default nextConnect({
  attachParams: true,
  onError: onErrorHandler,
})
  .post(postValidationHandler, recoveryPostHandler)

function postValidationHandler(
  request: NextApiRequest,
  _: NextApiResponse,
  next: NextHandler
) {
  const cleanValues = validator(request.body, {
    email: "required",
  });

  request.body = cleanValues;

  next();
}

async function recoveryPostHandler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  await sendRecoveryEmail(request.body.email);
  response.status(200).send({
    message: "ok",
  });
}
