/** Auth visual tokens */

export const AUTH_THEME = {
  /** Desktop max — เล็กลงจาก 1417×822 */
  cardWidth: 1080,
  /** สูงพอสำหรับฟอร์ม register โดยการ์ดขาว/น้ำเงินสูงเท่ากัน */
  cardHeight: 640,
  cardRadius: 20,
  panel: "#002250",
  panelWidth: 540,
  pageBg: "#0F002A",
  white: "#FFFFFF",
  inputSoft: "#EFEFEF",
  inputBorder: "#1A2744",
  title: "#002250",
  muted: "#8A94AD",
  link: "#3B6BD6",
  buttonWidth: 380,
  buttonHeight: 56,
  buttonRadius: 18,
  gradientFrom: "#1A6BBF",
  gradientTo: "#002250",
  shadow: "0 20px 48px rgba(0, 0, 0, 0.32)",
  panelShadow: "0 14px 32px rgba(0, 34, 80, 0.32)",
  buttonShadow: "0 8px 20px rgba(0, 34, 80, 0.4)",
} as const;

export const AUTH_COPY = {
  loginWelcomeTitle: "ยินดีต้อนรับกลับ",
  loginWelcomeSubtitle: "เข้าสู่ระบบเพื่อจัดการข้อมูลสาขาวิชาวิศวกรรมคอมพิวเตอร์",
  registerWelcomeTitle: "ยินดีต้อนรับ",
  registerWelcomeSubtitle: "สร้างบัญชีเพื่อเริ่มใช้งานเว็บไซต์สาขาวิชาวิศวกรรมคอมพิวเตอร์",
  loginTitle: "Sign in",
  registerTitle: "Create Account",
  registerHint: "use your email password",
  forgotPassword: "Forgot password?",
  rememberMe: "Remember me",
  loginSubmit: "Login",
  registerSubmit: "Sign Up",
  google: "Login With Google",
  or: "or",
  loginSuccess: "เข้าสู่ระบบสำเร็จ กำลังพาไปหน้าหลัก...",
  loginSuccessGoogle: "เข้าสู่ระบบด้วย Google สำเร็จ กำลังพาไปหน้าหลัก...",
  registerSuccess: "สร้างบัญชีสำเร็จ ยินดีต้อนรับ! กำลังพาไปหน้าหลัก...",
  registerSuccessGoogle: "สมัครด้วย Google สำเร็จ ยินดีต้อนรับ! กำลังพาไปหน้าหลัก...",
} as const;
