import { InternalServerError, NotFoundError, UnauthorizedError } from "errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "infra/database";

export interface IUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export async function createUser(
  name: string,
  email: string,
  password: string
) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
      },
    });

    const { password: _, ...createdUser } = user;
    return createdUser;
  } catch (err) {
    console.log(err);
    throw new InternalServerError();
  }
}

export async function userLogin(
  email: string,
  password: string
) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
        active: true
      },
    });

    if (user) {
      const { password: hashedPassword } = user;

      const isValid = await bcrypt.compare(password, hashedPassword);

      if (isValid) {
        const token = jwt.sign({ id: user.id, type: "login" }, process.env.SECRET!, {
          expiresIn: "7d",
        });
        return { id: user.id, token }
      }
    }
  } catch (err) {
    console.log(err);
    throw new InternalServerError();
  }
  throw new UnauthorizedError("Usuário e/ou senha incorreta");
}

export async function findUserById(id: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { id, active: true },
    });

    if (user) {
      const { password, role: roleString, ...userEntity } = user;

      const role = roleString as UserRole

      return { role, ...userEntity };
    } else {
      throw new NotFoundError();
    }
  } catch (err) {
    console.log(err);
    throw new InternalServerError();
  }
}

export async function findUserByEmail(email: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (user) {
      const { password, ...userEntity } = user;
      return userEntity;
    } else {
      throw new NotFoundError();
    }
  } catch (err) {
    console.log(err);
    throw new InternalServerError();
  }
}

export async function updateUserPassword(id: string, password: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { id },
    });

    if (user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id },
        data: {
          password: hashedPassword,
        },
      });
    } else {
      throw new NotFoundError();
    }
  } catch (err) {
    console.log(err);
    throw new InternalServerError();
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return users;
  } catch (err) {
    console.log(err);
    throw new InternalServerError();
  }
}


export async function updateUser(
  id: string,
  name?: string,
  email?: string,
  password?: string,
  role?: string,
  active?: boolean,
  isAdmin?: boolean,
) {
  try {
    if (password) {
      password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: {
        id
      },
      data: {
        name,
        email,
        password,
        role: isAdmin ? role : undefined,
        active: isAdmin ? active : undefined
      },
    });

    const { password: _, ...updatedUser } = user;
    return updatedUser;
  } catch (err) {
    console.log(err);
    throw new InternalServerError();
  }
}
