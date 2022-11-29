import nextConnect, { NextHandler } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { findUserById, UserRole } from "models/user";
import validator from "models/validator";
import { onErrorHandler } from "models/controller";
import { userAuthMiddleware } from "models/authorization";
import { ForbiddenError } from "errors";
import { NextTokenRequest } from "custom_typings/next";
export default nextConnect({
  attachParams: true,
  onError: onErrorHandler,
})
.use(userAuthMiddleware)
.get(getValidationHandler, findUserByIdHandler);

function getValidationHandler(
  request: NextApiRequest,
  _: NextApiResponse,
  next: NextHandler
) {
  const cleanValues = validator(request.query, {
    id: "required",
  });

  request.query = cleanValues;

  next();
}

async function findUserByIdHandler(
  request: NextTokenRequest,
  response: NextApiResponse
) {
  const { id } = request.query;
  if(request.account.id == id || request.account.role == UserRole.ADMIN){
    const result = await findUserById(id as string);
    response.status(200).json(result);
  }else{
    throw new ForbiddenError();
  }
}
