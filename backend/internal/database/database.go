package database

import (
	"encoding/json"

	"github.com/kmitl-pcc/ce-web/backend/internal/config"
	"github.com/kmitl-pcc/ce-web/backend/internal/models"
	"gorm.io/datatypes"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Connect(cfg config.Config) (*gorm.DB, error) {
	return gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{
		Logger:         logger.Default.LogMode(logger.Info),
		TranslateError: true, // ให้ unique violation กลายเป็น gorm.ErrDuplicatedKey
	})
}

func AutoMigrate(db *gorm.DB) error {
	if err := migrateContentsSchema(db); err != nil {
		return err
	}
	if err := db.AutoMigrate(models.All()...); err != nil {
		return err
	}
	// AutoMigrate ไม่ลด NOT NULL ของคอลัมน์เดิม — อนุญาต anonymous quiz attempt
	_ = db.Exec(`ALTER TABLE quiz_attempts ALTER COLUMN user_id DROP NOT NULL`).Error
	if err := seedExamSubjects(db); err != nil {
		return err
	}
	if err := seedExamQuestions(db); err != nil {
		return err
	}
	return nil
}

// seedExamSubjects เติมกลุ่มวิชาเดิม (iot/software/network/programming) ครั้งแรกที่สร้างตาราง
// เพื่อไม่ให้ exam_questions/exam_settings เก่าที่อ้างค่าพวกนี้หา subject ไม่เจอ
// หลังจากนี้ admin เพิ่ม/แก้ไข/ปิดใช้งานกลุ่มใหม่ผ่าน API ได้เลย ไม่ต้องแก้โค้ด
func seedExamSubjects(db *gorm.DB) error {
	var count int64
	if err := db.Model(&models.ExamSubject{}).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return nil
	}

	defaults := []models.ExamSubject{
		{Code: "iot", Name: "IoT", SortOrder: 1, IsActive: true},
		{Code: "software", Name: "Software", SortOrder: 2, IsActive: true},
		{Code: "network", Name: "Network", SortOrder: 3, IsActive: true},
		{Code: "programming", Name: "Programming", SortOrder: 4, IsActive: true},
	}
	return db.Create(&defaults).Error
}

// seedChoice โครง choice ที่เก็บเป็น jsonb ใน exam_questions ต้องตรงกับ dto.ExamChoice
type seedChoice struct {
	Key       string `json:"key"`
	Text      string `json:"text"`
	IsCorrect bool   `json:"is_correct"`
}

type seedQuestion struct {
	prompt  string
	choices []seedChoice
}

func choices(correctIdx int, texts ...string) []seedChoice {
	out := make([]seedChoice, 0, len(texts))
	for i, t := range texts {
		out = append(out, seedChoice{Key: string(rune('a' + i)), Text: t, IsCorrect: i == correctIdx})
	}
	return out
}

// seedExamQuestions เติมคลังข้อสอบตัวอย่างให้ครบทุกกลุ่มวิชา (โหมด mock) เฉพาะกลุ่มที่ยังไม่มีข้อสอบเลย
// เพื่อให้ฟีเจอร์ "สอบทุกหมวดหมู่พร้อมกัน" ใช้งานได้จริงตั้งแต่ครั้งแรกที่รันระบบ โดยไม่แตะกลุ่มที่ admin
// เพิ่มข้อสอบเองไว้แล้ว (เช่น software) และไม่เขียนทับ exam_settings ที่มีอยู่แล้ว
func seedExamQuestions(db *gorm.DB) error {
	bank := map[string][]seedQuestion{
		"iot": {
			{"โปรโตคอลใดที่นิยมใช้รับส่งข้อความระหว่างอุปกรณ์ IoT ที่ใช้พลังงานต่ำและแบนด์วิดท์จำกัด?",
				choices(1, "FTP", "MQTT", "SMTP", "Telnet")},
			{"RFID ย่อมาจากอะไร?",
				choices(2, "Radio Frequency Interface Device", "Rapid File Identification", "Radio Frequency Identification", "Remote Field Input Device")},
			{"เทคโนโลยีไร้สายใดต่อไปนี้เหมาะกับการส่งข้อมูลระยะไกลและใช้พลังงานต่ำ (LPWAN)?",
				choices(3, "Bluetooth", "Wi-Fi", "NFC", "LoRaWAN")},
			{"GPIO บนบอร์ดไมโครคอนโทรลเลอร์ย่อมาจากอะไร?",
				choices(0, "General Purpose Input/Output", "Global Power Input Output", "General Peripheral Interface Operation", "Grid Positioned I/O")},
			{"Edge Computing ในบริบทของ IoT หมายถึงอะไร?",
				choices(1, "การส่งข้อมูลทั้งหมดไปประมวลผลที่ cloud เท่านั้น", "การประมวลผลข้อมูลใกล้กับแหล่งกำเนิดข้อมูลก่อนส่งขึ้น cloud", "การเข้ารหัสข้อมูลที่ขอบเครือข่าย", "การสำรองข้อมูลไว้หลายศูนย์ข้อมูล")},
			{"เซนเซอร์ชนิดใดเหมาะสำหรับวัดอุณหภูมิ?",
				choices(2, "PIR", "LDR", "Thermistor/DHT22", "Ultrasonic")},
			{"ข้อใดคือความแตกต่างหลักระหว่าง Arduino กับ Raspberry Pi?",
				choices(0, "Arduino เป็นไมโครคอนโทรลเลอร์ ส่วน Raspberry Pi เป็นคอมพิวเตอร์ขนาดเล็กที่รันระบบปฏิบัติการได้", "ทั้งสองตัวเป็นอุปกรณ์ชนิดเดียวกันทุกประการ", "Raspberry Pi ใช้ไฟน้อยกว่า Arduino เสมอ", "Arduino รันระบบปฏิบัติการ Linux ได้เต็มรูปแบบ")},
			{"ข้อใดคือความเสี่ยงด้านความปลอดภัยที่พบบ่อยในอุปกรณ์ IoT?",
				choices(3, "การใช้โปรโตคอลที่เข้ารหัสเสมอ", "การอัปเดตเฟิร์มแวร์อัตโนมัติ", "การใช้รหัสผ่านที่ซับซ้อนเฉพาะอุปกรณ์", "การตั้งค่ารหัสผ่านเริ่มต้นจากโรงงานที่ไม่ถูกเปลี่ยน")},
			{"Zigbee เป็นมาตรฐานการสื่อสารไร้สายที่ออกแบบมาสำหรับงานประเภทใด?",
				choices(1, "การสตรีมวิดีโอความละเอียดสูง", "เครือข่ายเซนเซอร์/อุปกรณ์ IoT ที่ใช้พลังงานต่ำระยะสั้นถึงปานกลาง", "การเชื่อมต่ออินเทอร์เน็ตความเร็วสูงระยะไกล", "การสำรองข้อมูลขนาดใหญ่")},
			{"MQTT ทำงานบนสถาปัตยกรรมแบบใด?",
				choices(0, "Publish/Subscribe ผ่าน Broker", "Client-Server แบบ Request/Response เท่านั้น", "Peer-to-Peer โดยตรงเสมอ", "Master/Slave แบบ Polling")},
		},
		"network": {
			{"OSI Model แบ่งการทำงานของเครือข่ายออกเป็นกี่เลเยอร์?",
				choices(2, "5", "6", "7", "8")},
			{"เลเยอร์ใดใน OSI Model ที่รับผิดชอบการหาเส้นทาง (Routing) ของแพ็กเก็ต?",
				choices(1, "Data Link Layer", "Network Layer", "Transport Layer", "Session Layer")},
			{"โปรโตคอลใดใช้แปลงชื่อโดเมนให้เป็นหมายเลข IP?",
				choices(2, "DHCP", "ARP", "DNS", "SNMP")},
			{"ข้อใดอธิบายความแตกต่างระหว่าง TCP กับ UDP ได้ถูกต้อง?",
				choices(0, "TCP เชื่อมต่อและรับประกันการส่งถึง ส่วน UDP ไม่เชื่อมต่อและไม่รับประกัน", "TCP เร็วกว่า UDP เสมอในทุกกรณี", "UDP ใช้สำหรับ HTTP เท่านั้น", "TCP กับ UDP ทำงานที่เลเยอร์ Physical เหมือนกัน")},
			{"Subnet mask 255.255.255.0 ตรงกับ CIDR notation ใด?",
				choices(1, "/16", "/24", "/8", "/32")},
			{"อุปกรณ์เครือข่ายชนิดใดที่ใช้แบ่ง broadcast domain ออกจากกัน?",
				choices(2, "Hub", "Switch (Layer 2 ทั่วไป)", "Router", "Repeater")},
			{"พอร์ตมาตรฐานของ HTTP (ไม่เข้ารหัส) คือข้อใด?",
				choices(0, "80", "443", "21", "25")},
			{"VPN ย่อมาจากอะไร?",
				choices(3, "Verified Public Node", "Virtual Public Network", "Video Processing Node", "Virtual Private Network")},
			{"DHCP มีหน้าที่หลักคืออะไร?",
				choices(1, "เข้ารหัสข้อมูลระหว่างส่ง", "แจกจ่ายหมายเลข IP ให้อุปกรณ์ในเครือข่ายโดยอัตโนมัติ", "แปลงชื่อโดเมนเป็น IP", "จัดการ routing table ของ router")},
			{"ข้อใดคือที่อยู่ IP แบบ private ตามมาตรฐาน RFC 1918?",
				choices(2, "8.8.8.8", "172.217.0.0", "192.168.1.1", "1.1.1.1")},
		},
		"programming": {
			{"อัลกอริทึม Binary Search มีความซับซ้อนเวลาในกรณีเฉลี่ยเป็นเท่าใด?",
				choices(1, "O(n)", "O(log n)", "O(n^2)", "O(1)")},
			{"โครงสร้างข้อมูลใดทำงานแบบ Last In First Out (LIFO)?",
				choices(2, "Queue", "Linked List", "Stack", "Array")},
			{"ข้อใดต่อไปนี้คือภาษาที่ทำงานแบบตีความ (interpreted) เป็นหลัก?",
				choices(3, "C", "C++", "Rust", "Python")},
			{"ฟังก์ชัน recursive จำเป็นต้องมีอะไรเพื่อป้องกันการเรียกซ้ำไม่รู้จบ?",
				choices(0, "Base case", "Global variable", "Static typing", "Multiple return statements")},
			{"อัลกอริทึม Bubble Sort มีความซับซ้อนเวลาในกรณีแย่ที่สุดเป็นเท่าใด?",
				choices(1, "O(n log n)", "O(n^2)", "O(n)", "O(log n)")},
			{"คำสั่ง git ใดใช้รวมการเปลี่ยนแปลงจาก branch อื่นเข้ากับ branch ปัจจุบัน?",
				choices(2, "git clone", "git status", "git merge", "git init")},
			{"แนวคิด OOP ข้อใดหมายถึงการซ่อนรายละเอียดการทำงานภายในของอ็อบเจ็กต์?",
				choices(3, "Inheritance", "Polymorphism", "Abstraction", "Encapsulation")},
			{"คำสั่ง SQL ใดใช้สำหรับดึงข้อมูลจากตาราง?",
				choices(1, "UPDATE", "SELECT", "INSERT", "DELETE")},
			{"Big-O ของการเข้าถึงข้อมูลด้วย index ใน array คือเท่าใด?",
				choices(0, "O(1)", "O(n)", "O(log n)", "O(n^2)")},
			{"ข้อใดคือความแตกต่างระหว่าง compiler กับ interpreter?",
				choices(2, "ทั้งสองแปลโค้ดทีละบรรทัดเหมือนกัน", "Compiler รันโค้ดได้โดยไม่ต้องแปล", "Compiler แปลโค้ดทั้งหมดเป็นไฟล์ execute ก่อนรัน ส่วน interpreter แปลและรันทีละคำสั่ง", "Interpreter ทำงานได้เร็วกว่า compiler เสมอ")},
		},
	}

	for subject, questions := range bank {
		var existing int64
		if err := db.Model(&models.ExamQuestion{}).
			Where("subject = ? AND mode = ?", subject, models.ExamMock).
			Count(&existing).Error; err != nil {
			return err
		}
		if existing > 0 {
			continue // มีข้อสอบอยู่แล้ว (เช่น admin เพิ่มเอง) — ไม่เขียนทับ
		}

		rows := make([]models.ExamQuestion, 0, len(questions))
		for _, q := range questions {
			raw, err := json.Marshal(q.choices)
			if err != nil {
				return err
			}
			rows = append(rows, models.ExamQuestion{
				Subject:  models.TrackGroup(subject),
				Mode:     models.ExamMock,
				Prompt:   q.prompt,
				Choices:  datatypes.JSON(raw),
				IsActive: true,
			})
		}
		if err := db.Create(&rows).Error; err != nil {
			return err
		}

		var settingCount int64
		if err := db.Model(&models.ExamSetting{}).
			Where("subject = ? AND mode = ?", subject, models.ExamMock).
			Count(&settingCount).Error; err != nil {
			return err
		}
		if settingCount == 0 {
			timeLimit := 15
			setting := models.ExamSetting{
				Subject:          models.TrackGroup(subject),
				Mode:             models.ExamMock,
				QuestionCount:    len(rows),
				TimeLimitMinutes: &timeLimit,
				IsEnabled:        true,
			}
			if err := db.Create(&setting).Error; err != nil {
				return err
			}
		}
	}
	return nil
}

func columnExists(db *gorm.DB, table, column string) bool {
	var count int64
	_ = db.Raw(`
		SELECT COUNT(*) FROM information_schema.columns
		WHERE table_schema = current_schema()
		  AND table_name = ?
		  AND column_name = ?
	`, table, column).Scan(&count).Error
	return count > 0
}

// migrateContentsSchema: ลบ slug, ย้าย image_url → file_url, เปลี่ยน type เก่า
func migrateContentsSchema(db *gorm.DB) error {
	if !db.Migrator().HasTable("contents") {
		return nil
	}

	_ = db.Exec(`ALTER TABLE contents DROP COLUMN IF EXISTS slug`).Error

	hasImage := columnExists(db, "contents", "image_url")
	hasFile := columnExists(db, "contents", "file_url")
	if hasImage && !hasFile {
		if err := db.Exec(`ALTER TABLE contents RENAME COLUMN image_url TO file_url`).Error; err != nil {
			return err
		}
	} else if hasImage && hasFile {
		_ = db.Exec(`UPDATE contents SET file_url = image_url WHERE (file_url IS NULL OR file_url = '') AND COALESCE(image_url, '') <> ''`).Error
		_ = db.Exec(`ALTER TABLE contents DROP COLUMN IF EXISTS image_url`).Error
	}

	_ = db.Exec(`UPDATE contents SET type = 'about_us' WHERE type = 'video'`).Error
	_ = db.Exec(`UPDATE contents SET type = 'curriculum' WHERE type = 'page'`).Error
	return nil
}
