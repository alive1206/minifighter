import { getPrisma } from "./prisma";
import { cookies } from "next/headers";
import { UserRole, UserStatus } from "@prisma/client";

export class AuthUser {
  id!: string;
  name!: string;
  email!: string;
  role!: UserRole;
  status!: UserStatus;
  image!: string | null;
}

declare module "next" {
  interface NextApiRequest {
    user: AuthUser;
  }
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const tokenCookie =
    cookieStore.get("next-auth.session-token") ||
    cookieStore.get("__Secure-next-auth.session-token");
  if (!tokenCookie || !tokenCookie.value) return null;
  const user = await getPrisma().user.findFirst({
    where: {
      sessions: {
        some: {
          sessionToken: tokenCookie.value,
        },
      },
    },
  });
  if (
    user &&
    user.status != UserStatus.Actived &&
    user.role != UserRole.SuperAdmin
  ) {
    await getPrisma().user.update({
      where: { id: user.id },
      data: {
        status: UserStatus.Actived,
        role: UserRole.SuperAdmin,
      },
    });
    user.status = UserStatus.Actived;
    user.role = UserRole.SuperAdmin;
  }
  return user as AuthUser | null;
}
