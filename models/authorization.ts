import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import jwt from "jsonwebtoken";

import { ForbiddenError, UnauthorizedError } from "errors";
import { findUserById, UserRole } from "./user";

export async function userAuthMiddleware(
  request: NextApiRequest,
  _: NextApiResponse,
  next: NextHandler
) {
  let token = request.headers.authorization;

  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
    const result: any = jwt.verify(token, process.env.SECRET!);

    if (result["type"] == "login") {
      request.account = await findUserById(result["id"]);
      next();
    } else {
      throw new ForbiddenError();
    }
  } else {
    throw new UnauthorizedError(
      "Você precisa estar autenticado para acessar este conteúdo."
    );
  }
}

export async function adminAuthMiddleware(
  request: NextApiRequest,
  _: NextApiResponse,
  next: NextHandler
) {
  let token = request.headers.authorization;

  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
    const result: any = jwt.verify(token, process.env.SECRET!);

    if (result["type"] == "login") {
      request.account = await findUserById(result["id"]);

      if (request.account == UserRole.ADMIN) {
        next();
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
  request: NextApiRequest,
  _: NextApiResponse,
  next: NextHandler
) {
  let { token } = request.query;

  if (token) {
    const result: any = jwt.verify(token as string, process.env.SECRET!);

    if (result["type"] == "recovery") {
      request.account = await findUserById(result["id"]);
      next();
    } else {
      throw new ForbiddenError();
    }
  } else {
    throw new UnauthorizedError(
      "Você precisa estar autenticado para acessar este conteúdo."
    );
  }
}
