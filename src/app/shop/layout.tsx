import { PrivateRouter } from "@/providers";
import { UserRole } from "@prisma/client";

type Props = {
  children?: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <PrivateRouter roles={[UserRole.SuperAdmin, UserRole.Admin, UserRole.User]}>
      {children}
    </PrivateRouter>
  );
};

export default Layout;
