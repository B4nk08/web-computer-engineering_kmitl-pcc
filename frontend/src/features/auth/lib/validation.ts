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

export function validateRegister(values: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): string | null {
  if (!values.name.trim()) return "กรุณากรอกชื่อ";
  if (!values.email.trim()) return "กรุณากรอกอีเมล";
  if (!isValidEmail(values.email)) return "รูปแบบอีเมลไม่ถูกต้อง";
  if (values.password.length < 8) return "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
  if (values.password !== values.confirmPassword) {
    return "รหัสผ่านยืนยันไม่ตรงกัน";
  }
  return null;
}
