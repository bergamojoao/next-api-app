import { NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import jwt from "jsonwebtoken";

import { ForbiddenError, UnauthorizedError } from "errors";
import { findUserById, UserRole } from "./user";
import { NextAuthRequest } from "custom_typings/next";

export async function userAuthMiddleware(
  request: NextAuthRequest,
  _: NextApiResponse,
  next: NextHandler
) {
  let token = request.headers.authorization;

  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
    const result: any = jwt.verify(token, process.env.SECRET!);

    if (result["type"] == "login") {
      try {
        request.account = await findUserById(result["id"]);
        next();
      } catch (_) {
        throw new ForbiddenError();
      }
    } else {
    }
  } else {
    throw new UnauthorizedError(
      "Você precisa estar autenticado para acessar este conteúdo."
    );
  }
}

export async function adminAuthMiddleware(
  request: NextAuthRequest,
  _: NextApiResponse,
  next: NextHandler
) {
  let token = request.headers.authorization;

  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
    const result: any = jwt.verify(token, process.env.SECRET!);

    if (result["type"] == "login") {
      try {
        request.account = await findUserById(result["id"]);
        if (request.account.role == UserRole.ADMIN) {
          next();
        } else {
          throw new ForbiddenError();
        }
      } catch (_) {
        throw new ForbiddenError();
      }
    } else {
      throw new ForbiddenError();
    }
  } else {
    throw new UnauthorizedError(
      "Você precisa estar autenticado para acessar este conteúdo."
    );
  }
}

export async function recoveryMiddleware(
  request: NextAuthRequest,
  _: NextApiResponse,
  next: NextHandler
) {
  let { token } = request.query;

  if (token) {
    const result: any = jwt.verify(token as string, process.env.SECRET!);

    if (result["type"] == "recovery") {
      try {
        request.account = await findUserById(result["id"]);
        next();
      } catch (_) {
        throw new ForbiddenError();
      }
    } else {
      throw new ForbiddenError();
    }
  } else {
    throw new UnauthorizedError(
      "Você precisa estar autenticado para acessar este conteúdo."
    );
  }
}
