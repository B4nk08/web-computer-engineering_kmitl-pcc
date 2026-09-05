import { AuthExperience } from "@/features/auth/components/auth-experience";

/**
 * (auth) — login / register
 * ไม่มี Navbar / Footer — เต็มจอผ่าน AuthExperience
 */
export const metadata = {
  title: "Account | CE KMITL-PCC",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthExperience />
      {/* หน้า login/register ใช้สำหรับ metadata / URL เท่านั้น — UI อยู่ใน AuthExperience */}
      <div className="hidden" aria-hidden>
        {children}
      </div>
    </>
  );
}
