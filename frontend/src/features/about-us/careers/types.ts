/** เส้นทางอาชีพหลังจบการศึกษา */
export type CareerPath = {
  id: string;
  title: string;
  role: string;
  detail: string;
  imageUrl: string;
  clusterCode: string;
  /**
   * ฐานเงินเดือนแยกตามระดับ (ผูกทั้งตำแหน่ง seniority + ประสบการณ์โดยประมาณ)
   * Junior ≈ 0–2 ปี · Mid ≈ 3–5 ปี · Senior ≈ 5 ปีขึ้นไป
   */
  salaryJunior: string;
  salaryMid: string;
  salarySenior: string;
  /** ค่าเดี่ยวเก่า — ใช้ถ้ายังไม่แยกระดับ */
  salary: string;
  /** ทักษะที่ควรมี */
  skills: string;
  /** โอกาสเติบโต / หมายเหตุเพิ่ม */
  outlook: string;
};

export type CareerSalaryRow = {
  level: string;
  experience: string;
  amount: string;
};

export function careerSalaryRows(item: CareerPath): CareerSalaryRow[] {
  const rows: CareerSalaryRow[] = [];
  if (item.salaryJunior.trim()) {
    rows.push({
      level: "Junior",
      experience: "ประมาณ 0–2 ปี",
      amount: item.salaryJunior.trim(),
    });
  }
  if (item.salaryMid.trim()) {
    rows.push({
      level: "Mid-level",
      experience: "ประมาณ 3–5 ปี",
      amount: item.salaryMid.trim(),
    });
  }
  if (item.salarySenior.trim()) {
    rows.push({
      level: "Senior",
      experience: "ประมาณ 5 ปีขึ้นไป",
      amount: item.salarySenior.trim(),
    });
  }
  if (rows.length === 0 && item.salary.trim()) {
    rows.push({
      level: "โดยประมาณ",
      experience: "ยังไม่แยกระดับ",
      amount: item.salary.trim(),
    });
  }
  return rows;
}
