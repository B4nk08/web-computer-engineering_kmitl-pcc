export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateLogin(values: {
  email: string;
  password: string;
}): string | null {
  if (!values.email.trim()) return "กรุณากรอกอีเมล";
  if (!isValidEmail(values.email)) return "รูปแบบอีเมลไม่ถูกต้อง";
  if (!values.password) return "กรุณากรอกรหัสผ่าน";
  return null;
}
