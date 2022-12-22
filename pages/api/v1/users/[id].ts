import nextConnect, { NextHandler } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { findUserById, updateUser, UserRole } from "models/user";
import validator from "models/validator";
import { onErrorHandler } from "models/controller";
import { userAuthMiddleware } from "models/authorization";
import { ForbiddenError } from "errors";
import { NextAuthRequest } from "custom_typings/next";
export default nextConnect({
  attachParams: true,
  onError: onErrorHandler,
})
  .use(userAuthMiddleware)
  .get(getValidationHandler, findUserByIdHandler)
  .put(putValidationHandler, updateUserHandler);

function getValidationHandler(
  request: NextAuthRequest,
  _: NextApiResponse,
  next: NextHandler
) {
  const cleanValues = validator(request.query, {
    id: "required",
  });

  request.query = cleanValues;

  next();
}

function putValidationHandler(
  request: NextAuthRequest,
  _: NextApiResponse,
  next: NextHandler
) {
  const cleanValues = validator(request.query, {
    id: "required",
  });

  request.query = cleanValues;

  const bodyValues = validator(request.body, {
    email: "optional",
    password: "optional",
    name: "optional",
    role: "optional",
    active: "optional",
  });

  request.body = bodyValues;

  next();
}

async function findUserByIdHandler(
  request: NextAuthRequest,
  response: NextApiResponse
) {
  const { id } = request.query;
  if (request.account.id == id || request.account.role == UserRole.ADMIN) {
    const result = await findUserById(id as string);
    response.status(200).json(result);
  } else {
    throw new ForbiddenError();
  }
}

async function updateUserHandler(
  request: NextAuthRequest,
  response: NextApiResponse
) {
  const { id } = request.query;
  const { email, password, name, role, active } = request.body;

  const isAdmin = request.account.role == UserRole.ADMIN;

  if (request.account.id == id || isAdmin) {
    const result = await updateUser(id as string, name, email, password, role, active, isAdmin);
    response.status(200).json(result);
  } else {
    throw new ForbiddenError();
  }

}
