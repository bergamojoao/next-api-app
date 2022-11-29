import { InternalServerError, NotFoundError } from "errors";
import jwt from "jsonwebtoken";
import { prisma } from "infra/database";
import { sendEmail } from "infra/email";

export async function sendRecoveryEmail(
  email: string
): Promise<boolean> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      const token = jwt.sign(
        { id: user.id, type: "recovery" },
        process.env.SECRET!,
        {
          expiresIn: "1h",
        }
      );
      const link = `${process.env.RECOVERY_PASSWORD_REDIRECT}${token}`;
      const emailText = `Olá, ${user.name}. O link para recuperar sua senha é: ${link}`;
      await sendEmail(user.email, "Recuperação de Senha", emailText);
      return true;
    }
  } catch (err) {
    console.log(err);
    throw new InternalServerError();
  }
  throw new NotFoundError();
}
