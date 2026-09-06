import type { QuizQuestion } from "../types";

/**
 * student-quiz-questions.ts
 * ---------------------------
 * คำถามสำหรับ "Quizz แนะนำสาย" (เฉพาะนักศึกษาที่ล็อกอินแล้ว)
 * แต่ละตัวเลือกมี trackTag บอกว่าถ้าเลือกข้อนี้ จะโหวตให้สายไหน
 * ผลลัพธ์คำนวณจาก src/features/quiz/data/tracks.ts (นับคะแนนสายที่ถูกเลือกมากที่สุด)
 */

export const studentQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    text: "ถ้ากลุ่มของคุณต้องทำโปรเจกต์ส่งอาจารย์ (หรือทำงาน/ทำกิจกรรม) คุณมักจะรับหน้าที่ไหนก่อน?",
    choices: [
      { id: "A", text: "ออกแบบหน้าตา ทำ UI/UX วางระบบหน้าบ้าน", trackTag: "software" },
      { id: "B", text: "ออกแบบระบบวงจร ประกอบฮาร์ดแวร์ ต่ออุปกรณ์ให้ทำงาน", trackTag: "hardware" },
      { id: "C", text: "จัดการเครือข่าย เซิร์ฟเวอร์ หรือดูแลความปลอดภัยของระบบ", trackTag: "network" },
      { id: "D", text: "รวบรวมข้อมูล วิเคราะห์ ค้นหาความสัมพันธ์ในตัวเลขต่างๆ", trackTag: "data" },
    ],
  },
  {
    id: 2,
    text: "วิชาไหนที่คุณรู้สึกสนุกเวลาเรียนมากที่สุด?",
    choices: [
      { id: "A", text: "การเขียนโปรแกรม/พัฒนาแอปพลิเคชัน", trackTag: "software" },
      { id: "B", text: "อิเล็กทรอนิกส์ วงจรไฟฟ้า และไมโครคอนโทรลเลอร์", trackTag: "hardware" },
      { id: "C", text: "ระบบเครือข่ายคอมพิวเตอร์และการสื่อสารข้อมูล", trackTag: "network" },
      { id: "D", text: "สถิติ คณิตศาสตร์ หรือปัญญาประดิษฐ์", trackTag: "data" },
    ],
  },
  {
    id: 3,
    text: "เวลาคอมพิวเตอร์หรืออุปกรณ์มีปัญหา คุณมักจะ...",
    choices: [
      { id: "A", text: "ลองไล่ debug โค้ดหรือแอปที่ใช้งานอยู่ก่อน", trackTag: "software" },
      { id: "B", text: "เปิดเครื่องดูอุปกรณ์ภายในว่าตรงไหนเสีย", trackTag: "hardware" },
      { id: "C", text: "เช็คการเชื่อมต่ออินเทอร์เน็ต/เครือข่ายก่อนเป็นอันดับแรก", trackTag: "network" },
      { id: "D", text: "หาสาเหตุจากข้อมูล log หรือสถิติการใช้งานย้อนหลัง", trackTag: "data" },
    ],
  },
  {
    id: 4,
    text: "โปรเจกต์ในฝันของคุณคือแบบไหน?",
    choices: [
      { id: "A", text: "สร้างแอปหรือเว็บไซต์ที่คนใช้งานจริงจำนวนมาก", trackTag: "software" },
      { id: "B", text: "สร้างหุ่นยนต์หรืออุปกรณ์ IoT ที่จับต้องได้", trackTag: "hardware" },
      { id: "C", text: "ออกแบบระบบเครือข่ายองค์กรให้เร็วและปลอดภัย", trackTag: "network" },
      { id: "D", text: "สร้างโมเดล AI ที่ทำนายผลได้แม่นยำ", trackTag: "data" },
    ],
  },
  {
    id: 5,
    text: "เพื่อนมักจะขอให้คุณช่วยเรื่องอะไรบ่อยที่สุด?",
    choices: [
      { id: "A", text: "แก้บั๊กโค้ด หรือช่วยเขียนโปรแกรม", trackTag: "software" },
      { id: "B", text: "ประกอบ/ซ่อมอุปกรณ์อิเล็กทรอนิกส์", trackTag: "hardware" },
      { id: "C", text: "ตั้งค่า Wi-Fi เราเตอร์ หรือแก้ปัญหาเน็ตล่ม", trackTag: "network" },
      { id: "D", text: "ทำกราฟ วิเคราะห์ตัวเลขในรายงาน", trackTag: "data" },
    ],
  },
  {
    id: 6,
    text: "ถ้าต้องเลือกอ่านบทความหนึ่งบทความ คุณจะเลือกหัวข้อไหน?",
    choices: [
      { id: "A", text: "เทรนด์ภาษาโปรแกรมมิ่งและเฟรมเวิร์กใหม่ๆ", trackTag: "software" },
      { id: "B", text: "ชิปประมวลผลรุ่นใหม่ หรือเทคโนโลยีเซนเซอร์", trackTag: "hardware" },
      { id: "C", text: "ข่าวความปลอดภัยไซเบอร์และการโจมตีระบบ", trackTag: "network" },
      { id: "D", text: "โมเดล AI ตัวใหม่ที่กำลังเป็นกระแส", trackTag: "data" },
    ],
  },
  {
    id: 7,
    text: "งานแบบไหนที่คุณคิดว่าตัวเองจะอดทนทำได้นานที่สุด?",
    choices: [
      { id: "A", text: "นั่งเขียนและทดสอบโค้ดทีละส่วนจนกว่าจะรัน", trackTag: "software" },
      { id: "B", text: "ต่อวงจรและวัดค่าไฟซ้ำๆ จนอุปกรณ์ทำงาน", trackTag: "hardware" },
      { id: "C", text: "ไล่ตรวจสอบ log เพื่อหาจุดที่ระบบเครือข่ายมีปัญหา", trackTag: "network" },
      { id: "D", text: "ทำความสะอาดและจัดระเบียบชุดข้อมูลขนาดใหญ่", trackTag: "data" },
    ],
  },
  {
    id: 8,
    text: "ถ้าได้ไปดูงาน คุณอยากไปเยี่ยมชมแผนกไหนของบริษัทเทคโนโลยี?",
    choices: [
      { id: "A", text: "ทีมพัฒนาซอฟต์แวร์/แอปพลิเคชัน", trackTag: "software" },
      { id: "B", text: "ทีมออกแบบและผลิตฮาร์ดแวร์", trackTag: "hardware" },
      { id: "C", text: "ศูนย์ปฏิบัติการเครือข่ายและความปลอดภัย (NOC/SOC)", trackTag: "network" },
      { id: "D", text: "ทีมวิทยาศาสตร์ข้อมูลและ AI", trackTag: "data" },
    ],
  },
  {
    id: 9,
    text: "คำไหนอธิบายตัวคุณได้ดีที่สุด?",
    choices: [
      { id: "A", text: "ชอบสร้างสิ่งที่จับต้องได้บนหน้าจอ", trackTag: "software" },
      { id: "B", text: "ชอบลงมือประกอบและทดลองกับอุปกรณ์จริง", trackTag: "hardware" },
      { id: "C", text: "ชอบวางระบบให้ทุกอย่างเชื่อมต่อกันราบรื่น", trackTag: "network" },
      { id: "D", text: "ชอบตั้งคำถามและหาคำตอบจากข้อมูล", trackTag: "data" },
    ],
  },
  {
    id: 10,
    text: "ในทีมแฮกกาธอน คุณอยากรับบทบาทไหน?",
    choices: [
      { id: "A", text: "Developer เขียนโค้ดหลักของแอป", trackTag: "software" },
      { id: "B", text: "คนประกอบ Prototype ฮาร์ดแวร์/เซนเซอร์", trackTag: "hardware" },
      { id: "C", text: "คนดูแล Deploy เซิร์ฟเวอร์และความปลอดภัยของระบบ", trackTag: "network" },
      { id: "D", text: "Data Analyst วิเคราะห์ผลลัพธ์ให้ทีม", trackTag: "data" },
    ],
  },
  {
    id: 11,
    text: "เวลาเล่นเกมหรือใช้แอป คุณสนใจอะไรมากกว่ากัน?",
    choices: [
      { id: "A", text: "ระบบและกลไกการทำงานเบื้องหลังแอป", trackTag: "software" },
      { id: "B", text: "อุปกรณ์/คอนโทรลเลอร์ที่ใช้เล่น", trackTag: "hardware" },
      { id: "C", text: "ความเสถียรของการเชื่อมต่อออนไลน์", trackTag: "network" },
      { id: "D", text: "สถิติ อันดับ หรือข้อมูลผู้เล่นในเกม", trackTag: "data" },
    ],
  },
  {
    id: 12,
    text: "ถ้าต้องเลือกเรียนคอร์สออนไลน์เพิ่ม 1 คอร์ส จะเลือกอะไร?",
    choices: [
      { id: "A", text: "Web/Mobile Application Development", trackTag: "software" },
      { id: "B", text: "Embedded Systems และ IoT", trackTag: "hardware" },
      { id: "C", text: "Network Security", trackTag: "network" },
      { id: "D", text: "Machine Learning เบื้องต้น", trackTag: "data" },
    ],
  },
  {
    id: 13,
    text: "จุดแข็งของคุณใกล้เคียงข้อไหนที่สุด?",
    choices: [
      { id: "A", text: "คิดเป็นตรรกะ แตกปัญหาเป็นขั้นตอนได้ดี", trackTag: "software" },
      { id: "B", text: "ช่างสังเกตและถนัดงานประดิษฐ์/ซ่อมแซม", trackTag: "hardware" },
      { id: "C", text: "รอบคอบ ละเอียด ใส่ใจเรื่องความปลอดภัย", trackTag: "network" },
      { id: "D", text: "ชอบตัวเลขและมองเห็นแพทเทิร์นในข้อมูล", trackTag: "data" },
    ],
  },
  {
    id: 14,
    text: "อาชีพในฝันของคุณใกล้เคียงกับอะไรมากที่สุด?",
    choices: [
      { id: "A", text: "Software Engineer / Full-stack Developer", trackTag: "software" },
      { id: "B", text: "Embedded / Hardware Engineer", trackTag: "hardware" },
      { id: "C", text: "Network / Security Engineer", trackTag: "network" },
      { id: "D", text: "Data Scientist / AI Engineer", trackTag: "data" },
    ],
  },
  {
    id: 15,
    text: "เวลาทำงานกลุ่ม คุณมักถูกมอบหมายให้ทำอะไร?",
    choices: [
      { id: "A", text: "เขียนโค้ดส่วนหลักของระบบ", trackTag: "software" },
      { id: "B", text: "ประกอบ/ทดสอบอุปกรณ์ต้นแบบ", trackTag: "hardware" },
      { id: "C", text: "ตั้งค่าเซิร์ฟเวอร์และดูแลระบบให้ใช้งานได้", trackTag: "network" },
      { id: "D", text: "สรุปผลข้อมูลและทำรายงานวิเคราะห์", trackTag: "data" },
    ],
  },
  {
    id: 16,
    text: "ถ้ามีเวลาว่าง 1 วัน คุณอยากลองทำอะไร?",
    choices: [
      { id: "A", text: "ลองเขียนแอปเล็กๆ ของตัวเอง", trackTag: "software" },
      { id: "B", text: "ประกอบวงจรอิเล็กทรอนิกส์หรือหุ่นยนต์เล็กๆ", trackTag: "hardware" },
      { id: "C", text: "ศึกษาวิธีตั้งค่าระบบเครือข่ายที่บ้านให้ปลอดภัยขึ้น", trackTag: "network" },
      { id: "D", text: "ลองวิเคราะห์ข้อมูลชุดหนึ่งด้วยโปรแกรมสถิติ", trackTag: "data" },
    ],
  },
  {
    id: 17,
    text: "คุณคิดว่าตัวเองถนัดการแก้ปัญหาแบบไหนมากที่สุด?",
    choices: [
      { id: "A", text: "ปัญหาเชิงตรรกะในโค้ดที่รันแล้วได้ผลลัพธ์ผิด", trackTag: "software" },
      { id: "B", text: "ปัญหาที่ต้องจับต้องอุปกรณ์จริงเพื่อหาจุดเสีย", trackTag: "hardware" },
      { id: "C", text: "ปัญหาการเชื่อมต่อ/สิทธิ์การเข้าถึงระบบ", trackTag: "network" },
      { id: "D", text: "ปัญหาที่ต้องอาศัยการตีความข้อมูลจำนวนมาก", trackTag: "data" },
    ],
  },
  {
    id: 18,
    text: "เพจ/ช่องที่คุณติดตามบ่อยที่สุดเกี่ยวกับอะไร?",
    choices: [
      { id: "A", text: "สอนเขียนโปรแกรม/รีวิวเฟรมเวิร์ก", trackTag: "software" },
      { id: "B", text: "รีวิวอุปกรณ์ ชิ้นส่วนอิเล็กทรอนิกส์", trackTag: "hardware" },
      { id: "C", text: "ข่าวไอทีด้านความปลอดภัยไซเบอร์", trackTag: "network" },
      { id: "D", text: "เพจสาย AI/Data Science", trackTag: "data" },
    ],
  },
  {
    id: 19,
    text: "ถ้าต้องเลือกฝึกงาน คุณจะเลือกแผนกไหน?",
    choices: [
      { id: "A", text: "แผนกพัฒนาซอฟต์แวร์", trackTag: "software" },
      { id: "B", text: "แผนกวิศวกรรมฮาร์ดแวร์/การผลิต", trackTag: "hardware" },
      { id: "C", text: "แผนกโครงสร้างพื้นฐาน IT และเครือข่าย", trackTag: "network" },
      { id: "D", text: "แผนกวิเคราะห์ข้อมูลธุรกิจ", trackTag: "data" },
    ],
  },
  {
    id: 20,
    text: "สุดท้ายนี้ ถ้าให้เลือกคำจำกัดความตัวเองในสายวิศวกรรมคอมพิวเตอร์ คุณจะเลือกข้อไหน?",
    choices: [
      { id: "A", text: "นักสร้างซอฟต์แวร์ (Software Builder)", trackTag: "software" },
      { id: "B", text: "นักประดิษฐ์ฮาร์ดแวร์ (Hardware Maker)", trackTag: "hardware" },
      { id: "C", text: "ผู้ดูแลระบบเครือข่าย (Network Guardian)", trackTag: "network" },
      { id: "D", text: "นักวิเคราะห์ข้อมูล (Data Explorer)", trackTag: "data" },
    ],
  },
];
