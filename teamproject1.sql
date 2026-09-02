-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Mar 05, 2025 at 08:18 AM
-- Server version: 5.7.44
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `teamproject`
--

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `email` varchar(255) NOT NULL,
  `years` int(11) NOT NULL,
  `student_id` varchar(10) NOT NULL,
  `title` varchar(10) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `birthdate` date NOT NULL,
  `gender` varchar(10) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `passwords` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`email`, `years`, `student_id`, `title`, `full_name`, `nickname`, `birthdate`, `gender`, `phone`, `passwords`) VALUES
('64200002@kmitl.ac.th', 4, '64200002', 'นาย', 'กฎทบวง เณรวงษ์', 'เมน', '0000-00-00', 'ชาย', '', '$2a$12$VSLkrUlsww3/32nVXHNjEO2G52YDLpPhaup7VA1v/6iYNlOT5Pxay'),
('64200030@kmitl.acth', 4, '64200030', 'นาย', 'จีรวัฒน์ ศรีบุรินทร์', 'อั้น', '2001-12-24', 'ชาย', '0983318289', '$2a$12$jBp8myj3Mim.gGo6n/qSAunZ7xgZtsJbYi7Dp6ZTHoSBvNCy7RLI.'),
('64200035@kmitl.ac.th', 4, '64200035', 'นางสาว', 'ชณิดาภรณ์ หนูรักษ์', '', '0000-00-00', 'หญิง', '', '$2a$12$ZD9nbgWD8V4b0jb..CQHVe9ZlA.i/1wNH9a7S4cQelMxkGsOaHDk.'),
('64200039@kmitl.ac.th', 4, '64200039', 'นาย', 'ชยากุล ธรรมสวาสดิ์', '', '0000-00-00', 'ชาย', '', '$2a$12$EYlNAfOO06xgn2FP3tDjeeVn3OzNvFX0dpVH3i4kYTY9OyR6rCzLm'),
('64200042@kmitl.ac.th', 4, '64200042', 'นาย', 'ชัชวาลย์ ขวัญเมือง', 'เบสท์', '2003-04-15', 'ชาย', '0971363171', '$2a$12$x7DTeld7nC/UjtFazsowpOPXrPcVj/JxJl2EGnZ4h3HoR9uVRwn4.'),
('64200055@kmitl.ac.th', 4, '64200055', 'นาย', 'ณัฏฐ์ แจ้งจิตร', '', '0000-00-00', 'ชาย', '', '$2a$12$jWT57Ck5ISZbHguVfEh/0eYoowRH.dYQT185IKCgTUbZ9btzI1xTi'),
('64200058@kmitl.ac.th', 4, '64200058', 'นาย', 'ณัฐนันท์ กัญจนกาญจน์', '', '0000-00-00', 'ชาย', '', '$2a$12$yG8Oigs7tA9h0lT.MOaRw.U6gSD7t4HRKKSvWjtaFiE3vrMC0ZT7i'),
('64200061@kmitl.ac.th', 4, '64200061', 'นาย', 'ณัฐพงศ์ สิงห์เขา', '', '0000-00-00', 'ชาย', '', '$2a$12$cZ035ZnfkuAPwpK9B.vB1.1wEffWOifcPVbnOrLIJpZgquPIkoUlO'),
('64200063@kmitl.ac.th', 4, '64200063', 'นาย', 'ณัฐภัทร เขียวอุดม', '', '0000-00-00', 'ชาย', '', '$2a$12$feESwQK5n8fjn1uVHV4t/.S7S1xIm0UkXyLiFR4h4QlCG803M7SFu'),
('64200081@kmitl.ac.th', 4, '64200081', 'นาย', 'ธนรัฐ ปัจฉิมบุตร', 'พาย', '2002-09-25', 'ชาย', '0622139891', '$2a$12$iYcJ8TwOZ13wDEnOx4Jfu.nPBDTOvvpCHLVb3seBqHDTO6F3iiSXi'),
('64200087@kmitl.ac.th', 4, '64200087', 'นาย', 'ธนาวุธ เจริญผล', '', '0000-00-00', 'ชาย', '', '$2a$12$YAKY.r9rFFmZlXLcyRCTteM3LZzKVmc0k./i7E9CYtHDG8sHG9b3G'),
('64200094@kmitl.ac.th', 4, '64200094', 'นางสาว', 'ธิติสุดา วงศ์วิเศษศักดิ์', 'อ้อเเอ้', '0000-00-00', 'หญิง', '', '$2a$12$A8xFKx30Af263nK8XXq8yOfT8B5ZBGRgUFeidSjrLJmaqj8t2m94S'),
('64200106@kmitl.ac.th', 4, '64200106', 'นาย', 'นราวิชญ์ ชูช่วย', 'ทาม', '0000-00-00', 'ชาย', '', '$2a$12$YTNtuEtAszx8OG0n34VJc.RgIXVPNXps02wkbDDLrN7lc5ZHeq5YG'),
('64200112@kmitl.ac.th', 4, '64200112', 'นางสาว', 'นัชนันท์ งามพริ้ง', '', '0000-00-00', 'หญิง', '', '$2a$12$D2rqV0D2643FFSGmkhEUR.dWjI/Jcf7DjzLOAfGquk0a3sp/Otx7m'),
('64200123@kmitl.ac.th', 4, '64200123', 'นาย', 'บวรลักษณ์ ศิลป์สกุลเจริญ', 'บวร', '0000-00-00', 'ชาย', '', '$2a$12$xXJQZnFzSxe/6vQ7Q20RbOOPZC2AnKSRmaIakt9Ek2wFws8W3tO6e'),
('64200129@kmitl.ac.th', 4, '64200129', 'นาย', 'ปรัชญ์สพล ยอดดำเนิน', '', '0000-00-00', 'ชาย', '', '$2a$12$EBeokN8KIm3oZsN7xdz9uulr4ibySfoY7/rJyeX4d6BNfk5dkyW92'),
('64200130@kmitl.ac.th', 4, '64200130', 'นาย', 'ปรัชญา ใจห้าว', '', '0000-00-00', 'ชาย', '', '$2a$12$XVpa6zuqDp2WaOdmMv74Ru4eboFINGUUWNAm3s/sOZd1DeKT/4PZq'),
('64200135@kmitl.ac.th', 4, '64200135', 'นางสาว', 'ปาริฉัตร ชุมจันทร์', '', '0000-00-00', 'หญิง', '', '$2a$12$nI74xCT6SxrRTL25enhWeebbiplYhZyquqYie6O4qhdA2JA4hCwhS'),
('64200137@kmitl.ac.th', 4, '64200137', 'นาย', 'ปุญญพัฒน์ สุวรรณสิทธิ์', '', '0000-00-00', 'ชาย', '', '$2a$12$yHoaPxm0tdV2hyMcLHTWAu1tXhSr/2obPeOfNmQI0g8WVWbB70MDm'),
('64200146@kmitl.ac.th', 4, '64200146', 'นาย', 'พรหมพริษฐ์ พรหมรักษ์', '', '0000-00-00', 'ชาย', '', '$2a$12$M2.o.HYqe8daM1k9Yyy/BO9XMjQviuQRJDlc8IY1COoKTreKl8miu'),
('64200152@kmitl.ac.th', 4, '64200152', 'นาย', 'พสิษฐ์ กิจเจริญ', '', '0000-00-00', 'ชาย', '', '$2a$12$LPi/CsiJXE84cu7doH9ANObdTvRmh/4oxembXAkixc7y4pG8FMzO.'),
('64200160@kmitl.ac.th', 4, '64200160', 'นาย', 'พีระพล เอียดเลื่อน', '', '0000-00-00', 'ชาย', '', '$2a$12$fJPDHMQu3lyMvNaDoPmfQuHDvMAvosh2jrSLHjq0qPwfneHIXFrvi'),
('64200185@kmitl.ac.th', 4, '64200185', 'นางสาว', 'เมขลา สุดเหลือ', 'ไอซ์', '0000-00-00', 'หญิง', '', '$2a$12$jA1e4cUtwl37uJw9dpSi/OGzepRbTG2dJEcXYV5eAWtOdFDgtGI3C'),
('64200191@kmitl.ac.th', 4, '64200191', 'นางสาว', 'รวิสรา ขยายแย้ม', 'มิวสิค', '0000-00-00', 'หญิง', '', '$2a$12$hUvzbRm8brZ4Z/7EmRydpOhXhFzjZULc9nc8AqrJ2wriqxg1UdzmS'),
('64200192@kmitl.ac.th', 4, '64200192', 'นาย', 'รัชชานนท์ รัชตะวรรณ', '', '0000-00-00', 'ชาย', '', '$2a$12$ZubYmAGtcTybJ83HECGZWeCk2OtyffRikszqqudUGHlEeaMaEB0.C'),
('64200193@kmitl.ac.th', 4, '64200193', 'นางสาว', 'รัญชิดา เนตรอนงค์', '', '0000-00-00', 'หญิง', '', '$2a$12$20Fa9biJxKEoz8FfsmsHe.xR.HQEFmzVoJUPXovcR0mDTDTWVEy16'),
('64200203@kmitl.ac.th', 4, '64200203', 'นาย', 'เลิศวุฒิ จิรรัชวณิช', 'ไกด์', '0000-00-00', 'ชาย', '', '$2a$12$KxYwY.9pgf.hWrWyVxLsa.E9mVqOrQXbIncTfru7hHFZE08QpzEEm'),
('64200220@kmitl.ac.th', 4, '64200220', 'นาย', 'วุฒิภัทร อึ๊งเหมอนันต์', '', '0000-00-00', 'ชาย', '', '$2a$12$Cw.KlJzWrWYRsCaYMuSI0elGH8nzaSinFLsQVoS2EZhwmR/3YWyHu'),
('64200222@kmitl.ac.th', 4, '64200222', 'นางสาว', 'ศรัณญา ศรีกัน', '', '0000-00-00', 'หญิง', '', '$2a$12$gE3KOWjp7TyaYYI/SYGiXehDeQCjW5.e2YMbsMl2Cbl2z/GeTdrF6'),
('64200226@kmitl.ac.th', 4, '64200226', 'นาย', 'ศศิพงศ์ จิตต์เอื้อเฟื้อ', 'เบียร์', '0000-00-00', 'ชาย', '', '$2a$12$iUJT0iAi50Tzo/k0HVye9OVrHwLjTJQ.9whAQMHLoyrPicdx1YID.'),
('64200230@kmitl.ac.th', 4, '64200230', 'นาย', 'ศิวกร ไชยฤทธิ์', '', '0000-00-00', 'ชาย', '', '$2a$12$JTtPfKM6f0XmWS.Es5p7rOOedQO96heu2z1aBrkFDeMbX9b8e.06e'),
('64200232@kmitl.ac.th', 4, '64200232', 'นางสาว', 'ศุจีภรณ์ วรรณโร', '', '0000-00-00', 'หญิง', '', '$2a$12$5/uRxt5JT/leVrjzlfvwSeyK64baxkjx5Wh2i0ge8riu5EKlenx.W'),
('64200247@kmitl.ac.th', 4, '64200247', 'นาย', 'สุทธิกานต์ ศรีเพชร', '', '0000-00-00', 'ชาย', '', '$2a$12$zQCtaud4giSLw5zTiTxtDuHel8aBH2FTY6g.9DeYG5Yl3zcyBeWsq'),
('64200255@kmitl.ac.th', 4, '64200255', 'นาย', 'เสฎฐวุฒิ กสิวุฒิเชิดชูชัย', 'บิ๊ก', '2002-07-03', 'ชาย', '0822957983', '$2a$12$UgPpKsmpWflI.pYGtKSJm.QQsL1P1s75Cf5coR8YhKZR.F9CJepXC'),
('64200258@kmitl.ac.th', 4, '64200258', 'นาย', 'อติวิชญ์ ฐานะวัฒนา', '', '0000-00-00', 'ชาย', '', '$2a$12$yDmtsCLzka3nTMBkIe4Z3uhGnnISxKHyM5aohhWuByU1eMlz7V4U2'),
('64200273@kmitl.ac.th', 4, '64200273', 'นาย', 'อรัญชัย แก้วเลื่อน', '', '0000-00-00', 'ชาย', '', '$2a$12$FssZXfDcu0FWPZjhSgR5JeMWJrgbNDZeNr8SM8MgefJZvPT8dUbeO'),
('64200284@kmitl.ac.th', 4, '64200284', 'นาย', 'อิทธิภัทร์ เพิงรัตน์', '', '0000-00-00', 'ชาย', '', '$2a$12$oC/LiCizVe9COYIuPTmjbe9x2wlcGxFp127fAD27bFYm6mleUrxMW'),
('64200289@kmitl.ac.th', 4, '64200289', 'นาย', 'กฤษณ์ คงคา', 'เอิร์ธ', '0000-00-00', 'ชาย', '', '$2a$12$Bdd5UFG26YYmXgTb4MufYOz2HCKLQhdmu4aCAJCSqKOa9OxuBSvfm'),
('64200290@kmitl.ac.th', 4, '64200290', 'นางสาว', 'กัญญาวีร์ ครึ่งธิ', 'เเคท', '0000-00-00', 'หญิง', '', '$2a$12$yPZZ.XsdkJjECZ92CieRs.QWEDkcuNuBjI/b9txeKx1X4Fu1unLD6'),
('64200312@kmitl.ac.th', 4, '64200312', 'นาย', 'ธณชนน์ เครือเหลา', '', '0000-00-00', 'ชาย', '', '$2a$12$10bkK3FOTgPhWDZ8ZjEyu.6jzyLbMoQgfeFAZ4hGgOluxmhEq2UWS'),
('64200343@kmitl.ac.th', 4, '64200343', 'นาย', 'ภวพรรธน์ กิตติเจริญลัคน์', '', '0000-00-00', 'ชาย', '', '$2a$12$gNCGqHbNgR16ywz/kssseuS9AcfNaDkf8fts5Hk6MxO7QePBcYYca'),
('64200346@kmitl.ac.th', 4, '64200346', 'นาย', 'ภาสกร สุวรรณมณี', 'กอล์ฟ', '0000-00-00', 'ชาย', '', '$2a$12$kgeXRFiMAlyLJGXjd6BVReybKysjEbqJMirg8Y.Aq6YiFlgo42l5m'),
('64200358@kmitl.ac.th', 4, '64200358', 'นาย', 'วารินทร์ พรหมพิชัย', '', '0000-00-00', 'ชาย', '', '$2a$12$Wpzb4e0lyusSUr7W4lxhaev/Zi07ghu4PYsaPCfGby2G4JMitz8VG'),
('64200369@kmitl.ac.th', 4, '64200369', 'นางสาว', 'อรสินี เกตุเพ็ชร', 'เเอมป์', '0000-00-00', 'หญิง', '', '$2a$12$AJt37OzWfQGGCJPtRbJX1uSaagaT948wDJzHfYYKkX/xVSghiODAe'),
('64200374@kmitl.ac.th', 4, '64200374', 'นาย', 'อัสนีย์ แซ่เฮียบ', '', '0000-00-00', 'ชาย', '', '$2a$12$SfqRUyFANJ0jYUECcW1TTuI67MIbNbX7A3Af4DBgzXI8xGonBTSua'),
('64200377@kmitl.ac.th', 4, '64200377', 'นางสาว', 'อิสราภรณ์ ทองปานดี', 'วิว', '0000-00-00', 'หญิง', '', '$2a$12$yItFIQHFKA1eQ/uxqUuqDuBNnpWiQMWoJSFCJTVUJd0R1SEaMdrSy'),
('65200006@kmitl.ac.th', 3, '65200006', 'นางสาว', 'กรกนก สัทธาพงษ์', 'เมย์', '0000-00-00', 'หญิง', '', '$2a$12$YLDiMVxQm4bWIW52Gi8CGeJ2wM48RnpfVXk/b4uIC2tLcJGVXv5Sy'),
('65200009@kmitl.ac.th', 3, '65200009', 'นาย', 'กรณ์ดนัย ทิพย์จำนงค์', 'นาย', '0000-00-00', 'ชาย', '', '$2a$12$czCOEFAB0dqw1yzLMIHXq.Rx.9RLP3vozQG8jtIvn3k/h8YhII9fy'),
('65200010@kmitl.ac.th', 3, '65200010', 'นางสาว', 'กรรณิการ์ พุ่มสนธิ์', 'กันต์', '2003-05-28', 'หญิง', '0925971248', '$2a$12$ZdH0u8lEga8bJGv/bZ9XYuINGMar/aH7XYMY/ggfZJgdHAybl/lqy'),
('65200013@kmitl.ac.th', 3, '65200013', 'นางสาว', 'กฤตยกรรณ สีแตงสุก', '', '0000-00-00', 'หญิง', '', '$2a$12$nOm6maV7hhaA/FfzLXDvnOddyR0UoSRXxUgMW10ogt95kbXJfomei'),
('65200015@kmitl.ac.th', 3, '65200015', 'นาย', 'กฤษฎา พุทธะสุภะ', 'สปาย', '0000-00-00', 'ชาย', '', '$2a$12$RLTw7cC2LxYpWr.pI9lJie0XZxb5ZXe3jMprIJ.TgwZieFMBQ4K82'),
('65200020@kmitl.ac.th', 3, '65200020', 'นางสาว', 'กวิสรา แซ่เซี้ย', 'แตงโม', '2003-08-18', 'หญิง', '0621828445', '$2a$12$hdK4VNKfGkuNlPQKC9AhdO8dq7D6fs9Ts7Zahyiju0IdFrXVv7qRq'),
('65200027@kmitl.ac.th', 3, '65200027', 'นาย', 'กันตพล ศรีจันทร์', 'ตูน', '2003-07-30', 'ชาย', '0955373055', '$2a$12$k.cYiWBbaIt0xWOXMYE38uf14iZ.OaAibdtT/c2vBjeXIshSHux.G'),
('65200033@kmitl.ac.th', 3, '65200033', 'นาย', 'กิตติภณ เฟื่องศิลา', 'เชพ', '2003-12-09', 'ชาย', '0123456789', '$2a$12$sRg2Ao46w.PAJOh9SPB8SemonVv.elREOCvLCfSE3jBZkUf1.Zywa'),
('65200035@kmitl.ac.th', 3, '65200035', 'นาย', 'กิติพงษ์ ไชยมิตร', 'เบนซ์', '0000-00-00', 'ชาย', '', '$2a$12$YkB4B6MWxfURN83mv/Nc8enUtpsHtWUZMWn61Z.gLaJ0D9ngMTzzO'),
('65200037@kmitl.ac.th', 3, '65200037', 'นาย', 'กีรกิตติกร สมแก้ว', 'นนท์', '0000-00-00', 'ชาย', '', '$2a$12$St9ySzb7U7.13Oqr.kZN1eFcr7gqGoQ7URAo5b4Oz2lR3IR1QHkF6'),
('65200039@kmitl.ac.th', 3, '65200039', 'นาย', 'โกฎล วสุลิปิกร', 'ไตเติ้ล', '2003-02-24', 'ชาย', '0963082044', '$2a$12$K8b2QRiHuCUL2x3YsWILyuH4LFKNteSduTGDMTTlspMDKw.GkGWby'),
('65200046@kmitl.ac.th', 3, '65200046', 'นาย', 'คุณานนต์ ขาวขำ', 'ไบรท์', '2004-07-23', 'ชาย', '0638816647', '$2a$12$3e8/bJF/4OKw53E.Cv/Xy.tzXJNV/CuNkRUUdU9XAp7kNClKMowN6'),
('65200048@kmitl.ac.th', 3, '65200048', 'นาย', 'จักรพรรดิ์ ใสสุชล', 'ยีนส์', '0000-00-00', 'ชาย', '', '$2a$12$jRivdowOsfTfN4Y9Cy2BnOhC8BI/qlBO7VzhvwxjZe8XktSAOIC3G'),
('65200056@kmitl.ac.th', 3, '65200056', 'นางสาว', 'จิรานุช จันทร์น้อย', 'ลูกน้ำ', '2003-06-28', 'หญิง', '0928994117', '$2a$12$uYTSoKEaxERkbsK7LzeRZucDV12ri9.sBemvBIiOHkL6wU1VUpT1a'),
('65200066@kmitl.ac.th', 3, '65200066', 'นาย', 'เจมส์ ตุลยนิษก์', 'เจมส์', '0000-00-00', 'ชาย', '', '$2a$12$zrXRGSH4nDubejmoPI6WQeOF/9pkM8oi4D2it.OxzJHEDTec9ZyEu'),
('65200078@kmitl.ac.th', 3, '65200078', 'นาย', 'ชนินทร์ภัทร ทองรักษ์', 'โดนัท', '0000-00-00', 'ชาย', '', '$2a$12$yyfYB4CU7X1AySTFN1OKWOVJRiZ77tEeYy8yJMi8uBG8E2NYz5B92'),
('65200079@kmitl.ac.th', 3, '65200079', 'นาย', 'ชโยดม เปี่ยมไทย', 'เอซ', '2003-10-04', 'ชาย', '0947974649', '$2a$12$g6Wyii0OEW4EU5fm5Y8h6OnGTBeMjm.TvzjAm/GRdHDPBqfppocIO'),
('65200084@kmitl.ac.th', 3, '65200084', 'นาย', 'ชลทิศ สถิตชัย', 'เอเป็ก', '2003-11-06', 'ชาย', '0926050868', '$2a$12$a.7PmykJtw8MfQysU6JH7eBEsekH.zOPz6mBtAwRjrfy1A0Db6R/K'),
('65200089@kmitl.ac.th', 3, '65200089', 'นาย', 'ชาญชัย บุญนำ', '', '0000-00-00', 'ชาย', '', '$2a$12$HaAYKYAUfnjHu4nn.QU2yeuBvz3p6FkFyJTqBoyW23RxAOkHeU9Mi'),
('65200093@kmitl.ac.th', 3, '65200093', 'นางสาว', 'ชุติมา วงศ์สวัสดิ์', 'เบม', '0000-00-00', 'หญิง', '', '$2a$12$qiZwmk4p9H4lfTDVt6Zwf.eVzlBHPFgE.D8tVw3OvRbB2tL/Rzy0C'),
('65200095@kmitl.ac.th', 3, '65200095', 'นาย', 'ไชยธีร์ สุบการี', 'อาร์ท', '0000-00-00', 'ชาย', '', '$2a$12$..6G0olZ5STi0gWkH70QHu6Bx8frdtJW9K/OWtPYR7v3jf2sdUlLC'),
('65200097@kmitl.ac.th', 3, '65200097', 'นาย', 'นายญาณาธิป อินพฤกษา', 'พีช', '2003-04-18', 'ชาย', '0897858719', '$2a$12$Pw2Yv8.5GWxgdlDEs3c6vOZxuPLA9YOTAib3OBgRBri/yGeJE1osa'),
('65200099@kmitl.ac.th', 3, '65200099', 'นาย', 'ฐาปกรณ์ โพธิขาว', 'กร', '0000-00-00', 'ชาย', '', '$2a$12$SW7vG952.x6sGuDLcMlhou4X2VEYJ2DuJbc5BtTWr9Wbp85fH/BPq'),
('65200100@kmitl.ac.th', 3, '65200100', 'นาย', 'ฐิติกมล สวนแยง', 'เเทน', '0000-00-00', 'ชาย', '', '$2a$12$kgcsfKozl8.bo0qZYNa3iOah22f2.KQeG5hafaDZ.sCFPhWT9822W'),
('65200103@kmitl.ac.th', 3, '65200103', 'นาย', 'ณกาญจน์ อยู่ประเสริฐ', 'ปราชญ์', '0000-00-00', 'ชาย', '', '$2a$12$2bBge5HQJGJ0rDNKuLjpresHYG6a0Vgk7wohAzkUgrGahMK8p1Djy'),
('65200113@kmitl.ac.th', 3, '65200113', 'นาย', 'ณัฏฐกิตติ์ บัวจันทร์', 'ซิม', '2003-06-20', 'ชาย', '0887844998', '$2a$12$CZgYWTgyFqqSLvkUtOMwC.NRUAOXlbLHH9eeUHcxKaNuYMMcgdRMq'),
('65200119@kmitl.ac.th', 3, '65200119', 'นาย', 'ณัฐกุล เอกเอี่ยม', 'เป๊ก', '0000-00-00', 'ชาย', '', '$2a$12$CSlh6tfmfNCAe/t1cAWnnOCF3b6vqiCnVkxpJKiMWdubh9E5YWr9u'),
('65200122@kmitl.ac.th', 3, '65200122', 'นางสาว', 'ณัฐวรา นาคงาม', 'ครีม', '0000-00-00', 'หญิง', '', '$2a$12$GmZhN4tUHjNut18sus9wIewHRHRxbHE1tFN4hSV45j26MbFElLDoS'),
('65200128@kmitl.ac.th', 3, '65200128', 'นางสาว', 'ดนุนุช เกตุทองหลาง', 'ไข่มุก', '2003-08-29', 'หญิง', '0947878189', '$2a$12$i0w8kz7PT3xMK/z/t9nJUuU4t.sKjdfCGfm7mrgOd4qDRziR6m.P6'),
('65200129@KMITL.AC.TH', 3, '65200129', 'นาย', 'ดลนที ประเดิมรัตนกุล', 'โดม', '2003-06-22', 'ชาย', '0851544151', '$2a$12$oUTal1GR2G48nhk6I5k0MOVLUTyEGHDO1raVIeXKCiCYcBHicN.9.'),
('65200133@kmitl.ac.th', 3, '65200133', 'นาย', 'ต่อตระกูล แซ่เล้า', 'ต่อ', '0000-00-00', 'ชาย', '', '$2a$12$4vv.Pr4fjH6tphKTILNu3OsyfhJmB6Nua0uaxchEqipVEPcEQbgZG'),
('65200134@kmitl.ac.th', 3, '65200134', 'นาย', 'ติณณภพ พรมคำ', 'กีตาร์', '2004-03-13', 'ชาย', '0651140096', '$2a$12$3HfcNcuJmJQYvoOKtDTceeGqXf0RA8NUpCENuK8.fvMSHHf8.0RPO'),
('65200135@kmitl.ac.th', 3, '65200135', 'นาย', 'ตุลยวัต ชนูดหอม', 'ต๊ะ', '0000-00-00', 'ชาย', '', '$2a$12$J5Q1wqtYcDhmejy4IrDGO.RQJSmROV2Kc4dVy/n/kfKIH/ilIvKiy'),
('65200144@kmitl.ac.th', 3, '65200144', 'นาย', 'ทีปกร แพกุล', 'กัส', '0000-00-00', 'ชาย', '', '$2a$12$/s1c2J0TWykYsDyrrGjK7upT2w4ZlHbxGO1/lD1LaTM4ZBy6mGJDm'),
('65200150@kmitl.ac.th', 3, '65200150', 'นาย', 'ธนพนธ์ กาญจนรุ่ง', 'เวฟ', '0000-00-00', 'ชาย', '', '$2a$12$XKthQqSoX9H/n3n217gEzO8nVD045OKl1MKo8PqEccghFP2eW7qx.'),
('65200154@kmitl.ac.th', 3, '65200154', 'นาย', 'ธนภัทร วงศ์เศรษฐโชติ', 'ทาม', '0000-00-00', 'ชาย', '', '$2a$12$BaM5MwXFdTqH7.XodF/M9.XskXTM0qK3w.TY5OGeH5S17bYl/4jhW'),
('65200156@kmitl.ac.th', 3, '65200156', 'นาย', 'ธนภัทร สุขกรี', 'ไอหัวควย', '0000-00-00', 'ชาย', '', '$2a$12$wxRbKoEQOk.5lyKMd11lROmawBjzeyfC65qBw1L34BqH3EYpnOE1S'),
('65200162@kmitl.ac.th', 3, '65200162', 'นาย', 'ธนาดร รัชตะปีติ', 'ดอนนี่', '0000-00-00', 'ชาย', '', '$2a$12$8zZ/Mco.4Dc.duJBdsH/v.2evOj3FMBUj2wmDkojKfwcbNH.XGRoS'),
('65200164@kmitl.ac.th', 3, '65200164', 'นาย', 'ธนาวัฒน์ สระทองด้วง', 'หมี', '0000-00-00', 'ชาย', '', '$2a$12$df5TbISPI/sCoIEY0Qk0POB3U8EiylNmKu57.ww1MU2B6EJez15KW'),
('65200169@kmitl.ac.th', 3, '65200169', 'นางสาว', 'ธัญญาลักษณ์ ทองสงค์', 'ทิพย์', '0000-00-00', 'หญิง', '', '$2a$12$0l6/mdGaM8pGS78bvVAHh.9Pz97lAowY8mKtlYQDmoMO4xQqBXBJa'),
('65200171@kmitl.ac.th', 3, '65200171', 'นาย', 'ธัญวุฒิ ชนะ', 'เจี๊ยบ', '0000-00-00', 'ชาย', '', '$2a$12$J2lEpm/bSz5OKajjzjxja.SFdXn/7TP3vqdXUEBbPKTsGqhMxF/ji'),
('65200177@kmitl.ac.th', 3, '65200177', 'นาย', 'ธีร์ธวัช ชอุ่มผล', 'มาร์ท', '0000-00-00', 'ชาย', '', '$2a$12$gSnshlr.G0ueyxGL0Mhff.DUNepmPCce1zHugv33tIqiO1uEHJumG'),
('65200178@kmitl.ac.th', 3, '65200178', 'นาย', 'นายธีรภัทร์ ยอดพยุต', 'เนส', '2004-02-08', 'ชาย', '0994141190', '$2a$12$qP1zzW6gpTwTRqaf2Sz2R.CIZkOZ3mBKFBbnJGEea9FA0z6JcJicK'),
('65200184@kmitl.ac.th', 3, '65200184', 'นาย', 'นันทวุฒิ เณรแตง', 'มาย', '0000-00-00', 'ชาย', '', '$2a$12$ctVQ0c32FUKdgP/oohwFMOHBPUnvcfLfzmrZ9rTRLELMoRsB10pm6'),
('65200185@kmitl.ac.th', 3, '65200185', 'นางสาว', 'นันท์สินี คำลี', 'กาแฟ', '0000-00-00', 'หญิง', '', '$2a$12$OFqGiDgST3R4MWRT5IojMey/1/FFnrMscN.0V/O0752NzaaogIARy'),
('65200197@kmitl.ac.th', 3, '65200197', 'นาย', 'เบญจพล เม่นแม่สลิด', '', '0000-00-00', 'ชาย', '', '$2a$12$ao8cfhfUgPiM4YqeKjEKF.v5VW2R5tIRU8qpOOjYEP15qxf6srHTe'),
('65200209@kmitl.ac.th', 3, '65200209', 'นาย', 'ปวรปรัชญ์ จันทร์ต๊ะ', '', '0000-00-00', 'ชาย', '', '$2a$12$1Y1jIlwYfE5Q8TJck9MkYu2c/O3tkHpD3SDmSmcxsKgCemfvq2x86'),
('65200211@kmitl.ac.th', 3, '65200211', 'นาย', 'ปัณณทัต ลุ่นเซียะ', 'ปิง', '2003-10-31', 'ชาย', '00822813140', '$2a$12$qthnRjBNvk5/3k9KB4M2Ju5I9W69dofOMH4vmS872Xcz52LWnMAcq'),
('65200224@kmitl.ac.th', 3, '65200224', 'นาย', 'พชรพล พรหมเพศ', 'คิม', '2003-03-26', 'ชาย', '0828016223', '$2a$12$Tdv/Bj2Do/KXXEZ6LBCdyuSz2ixtQ3pUOoBSnsN4jCLkq5esSIAHq'),
('65200241@kmitl.ac.th', 3, '65200241', 'นาย', 'พิสิษฐ์ วีรสถาพร', 'ไชร์', '0000-00-00', 'ชาย', '', '$2a$12$T8YfTd/G0rTsOnZidaltQO3HecXRfCvQ24SkPr7NZfub2o199PT5G'),
('65200254@kmitl.ac.th', 3, '65200254', 'นาย', 'ภาคิม สงวนพัฒน์', 'เติร์ก', '0000-00-00', 'ชาย', '', '$2a$12$1vkYh4l0evL6SPV26T/H0u4Yx6EsIvP2PgOUROXIR7ylRhABf.qby'),
('65200264@kmitl.ac.th', 3, '65200264', 'นาย', 'ภูผา บุญพล', 'อ่าวไทย', '0000-00-00', 'ชาย', '', '$2a$12$3UAnIRIl318Aiera6CmJAeEgarPK3MyLkd3YkWKeICEwmWgCUOvx.'),
('65200265@kmitl.ac.th', 3, '65200275', 'นาย', 'ภูวิศร ทองตะโก', 'ไบค์', '2004-03-18', 'ชาย', '0957789986', '$2a$12$31DHNF4GcEytq9vG0LVIMuiz3K6VawrACkowbMvudSkE/1d9x15J2'),
('65200271@kmitl.ac.th', 3, '65200271', 'นาย', 'ภูฤทธิ์ ไชยยางพานิช', 'ภู', '2004-03-14', 'ชาย', '0936471399', '$2a$12$16kcx9wSJOFDJO39o25zsOqzIUuGloFAY8bOdthK1kx9Os1lbTwr6'),
('65200272@kmitl.ac.th', 3, '65200272', 'นางสาว', 'ภูวณิดา เรืองด้วง', 'กุ๊กกิ๊ก', '0000-00-00', 'หญิง', '', '$2a$12$gPCt9akgT0hq7/2./AMEietNfKu9OTVT3wL4XqLdVJHEr7yiOca32'),
('65200273@kmitl.ac.th', 3, '65200273', 'นาย', 'ภูวดล สมบัติมาก', 'เพชรมายา', '0000-00-00', 'ชาย', '', '$2a$12$iIuD8FRy9B45cw5l0ztrSeC.teR6K9qi9h9F4/08MrXYgW9sG89DG'),
('65200277@kmitl.ac.th', 3, '65200277', 'นาย', 'มูฮัยมิน มามะ', 'มิน', '2004-03-14', 'ชาย', '0828144748', '$2a$12$oJ8Wapt7H6pJQcDC5kBuTuDYigJSLQCb97pI2i2mPT796MTjhbXd.'),
('65200279@kmitl.ac.th', 3, '65200279', 'นาย', 'ยงศักดิ์ แสงสุข', 'นีโอ', '2004-01-24', 'ชาย', '0952909471', '$2a$12$9s08t1wmYN.FHBtaaGT0mu6B5Fo7KqAZx6JUW5bNd0pscZq5OsKE.'),
('65200287@kmitl.ac.th', 3, '65200287', 'นาย', 'รัตนพล สมบูรณ์', 'ที', '2003-07-29', 'ชาย', '0836835931', '$2a$12$uQECYdj5ial9fnTEC8VGGexTFsV/JM4SvLJ/99f/bC1R9rMQYW/Py'),
('65200294@kmitl.ac.th', 3, '65200294', 'นาย', 'วงศกร วิโนทัย', 'อั้ม', '2003-12-08', 'ชาย', '0886463069', '$2a$12$sYuh15prRMpKDQdir/nxWu7hDXhS0KUE2hXFBq9O7C1cvbdJZ3rdm'),
('65200305@kmitl.ac.th', 3, '65200305', 'นาย', 'วัชภล ทับแสง', 'ตี๋', '0000-00-00', 'ชาย', '', '$2a$12$EfQCGWQm64YLMGPDV5K50eLO49LlZdWGed426R3R6hctN6/TnSKhi'),
('65200317@kmitl.ac.th', 3, '65200317', 'นาย', 'ศิวกร ล้อมวงศ์', 'ปลั๊ก', '2004-02-20', 'ชาย', '0625137656', '$2a$12$mfMTc5XwSaMnXRjaAYobXOvQTJxlGEeF0n.6581pr1X/aiK/nMiqq'),
('65200343@kmitl.ac.th', 3, '65200343', 'นาย', 'สุทธิรัตน์ เหมือนสร้อย', 'เฟิร์ส', '2003-10-23', 'ชาย', '0917351023', '$2a$12$EG3JPNT9EYOkm2JUWiLDpOv0sfdxuZVs1iRNXR0Zhw4L.kBON2z/K'),
('65200353@kmitl.ac.th', 3, '65200353', 'นาย', 'สุภัทรชัย', 'ตั้ม', '2003-12-20', 'ชาย', '0935835313', '$2a$12$ECw8AVZXKChDeoKTvyvAtuoTQAZltu2NU/K51xbjFR7D8QBd0T3HC'),
('65200354@kmitl.ac.th', 3, '65200354', 'นางสาว', 'สุภาพร ผั่วสกุล', 'เมย์', '2003-04-09', 'หญิง', '0980175461', '$2a$12$/E5gYJM5ejksuhb0bJYktOCQYjYgZohfpzq5oJ.UrZvEkMG7JgvQK'),
('65200356@kmitl.ac.th', 3, '65200356', 'นางสาว', 'สุสาคร ภมรานนท์', 'สาคร', '2003-09-04', 'หญิง', '0936081160', '$2a$12$RyZ8o0kEJM4hNsL3w7OtKOLv2Ae2NhY2Vfov4PZahfn/cLRyb8LJi'),
('65200358@kmitl.ac.th', 3, '65200358', 'นาย', 'เสฏฐวุฒิ ไกรนรา', 'ฟลุ๊ค', '2003-09-11', 'ชาย', '0929847340', '$2a$12$fC1FMODsyv33zf4vtT.Ye.Hqv2Ion3Alji8gZwtqhsi5chsgNsk4u'),
('65200359@kmitl.ac.th', 3, '65200359', 'นางสาว', 'หนึ่งฤทัย แท้สูงเนิน', 'กิ๊ฟ', '2001-07-26', 'หญิง', '0837788259', '$2a$12$YE6ZAKZT8CtkGNrQrPgRIue3TioCmUhJWjRC/IBjXwAf4c615eMka'),
('65200365@kmitl.ac.th', 3, '65200365', 'นาย', 'อติวิชญ์ ทองมาอิ่ม', 'ฟอร์ด', '2003-11-19', 'ชาย', '0877381919', '$2a$12$OPZQG6XldvVYv8zdFj/TFedFUhxA89i5aAfn8.wDT7T/BTCdusObq'),
('65200366@kmitl.ac.th', 3, '65200366', 'นาย', 'อนิวัตติ์ ถิ่นนัยธร', 'ก็อต', '2003-12-31', 'ชาย', '0980417457', '$2a$12$..qJQAeqkrUhBZy4fZ5AEuhhZsuRxjVjAVBUq/lHVRwxK0LUoZYQq'),
('65200368@kmitl.ac.th', 3, '65200368', 'นาย', 'อนุวัตร์ วันจงคำ', 'กาย', '2004-01-04', 'ชาย', '0897614902', '$2a$12$d1dPXVPdr.cKawXSVk7FjuKD52ELDMEPT8L05Tq/iJ/v0QPCsNgv.'),
('65200369@kmitl.ac.th', 3, '65200369', 'นางสาว', 'อภิญญา คนึงหาญ', 'ปรางค์', '2003-12-04', 'หญิง', '0617047791', '$2a$12$jd2XroNi8pJJcJr8Yr6JnOMMfHgeUkbfTm5T9enlUtf18IRakm2D2'),
('65200373@kmitl.ac.th', 3, '65200373', 'นางสาว', 'อริสดา มะบารู', 'อัยดา', '2004-02-10', 'หญิง', '0864738081', '$2a$12$Ol6NHk/1VvZRNHFQny1/tO08Lv8b5UOe/bAJ8CJh4lQgpooyoN2yS'),
('65200380@kmitl.ac.th', 3, '65200380', 'นาย', 'อาณัติ ศรีจันทร์', 'ไอซ์', '2004-02-01', 'ชาย', '0982724669', '$2a$12$SwF7VvlDaPmjTr4OJ6W3YekZGdLxzH9RR0mAcrEKf99hFVex/A0e2'),
('65200382@kmitl.ac.th', 3, '65200382', 'นาย', 'อิทธิพล นิจสินธุ์', 'ทิว', '0000-00-00', 'ชาย', '', '$2a$12$O2MN0Ne1mzO27GZSVsixiORiRXTH//01ti6SDmUeYNqaW8Jd0GE/m'),
('65200383@kmitl.ac.th', 3, '65200383', 'นางสาว', 'อินทิรา เรืองชาตรี', 'อิน', '2003-11-03', 'หญิง', '0937284127', '$2a$12$Ok39DoNJUcDd2gvtoqWQ1ePEwljJvmE5lwt9tOyLMhZ9gHwgnAN/G'),
('65200385@kmitl.ac.th', 3, '65200385', 'นาย', 'อิสระ สุขอินทร์', 'บังโต', '0000-00-00', 'ชาย', '', '$2a$12$M/A32DZCqOdL7dZWUJn2DeeeycRbO9JkbJh/MqI2ijdNshPmw34T.'),
('65200389@kmitl.ac.th', 3, '65200389', 'นาย', 'อุสมาน เจ๊ะอาลี', '49 เจ๊ะเเจ๊ะ', '0000-00-00', 'ชาย', '', '$2a$12$ZtmNid0rfcN8wM3aHW/DmuotahmeSoiFSmqKoEY.keCSoJ/3AId8G'),
('65200393@kmitl.ac.th', 3, '65200393', 'นาย', 'ฮาริช ไพรพฤกษ์', 'บัง', '0000-00-00', 'ชาย', '', '$2a$12$3RxURJmo/2MZdEeABr7oyu/VcPlTKIDZOpI.AtaDTMRhVQfs3oY6C'),
('66200004@kmitl.ac.th', 2, '66200004', 'นางสาว', 'กมลนัทธ์ รักกิจ', 'แนน', '2004-02-12', 'หญิง', '0634760597', '$2a$12$fgM9OF47ykLOOCj6lRNj5eh2kaLeHXz6KNoVymCMRa9WrEh1lzlUO'),
('66200009@kmitl.ac.th', 2, '66200009', 'นางสาว', 'กรรณธิชา สงเสริฐ', '', '0000-00-00', 'หญิง', '', '$2a$12$tZXl4xb3W.pZ17/rfAiiIeZBfN687x/dsrR0yrD4I6.7z3LvqZDgO'),
('66200011@kmitl.ac.th', 2, '66200011', 'นาย', 'กฤตพัฒน์ ยืดยาว', 'กาโด้', '2004-08-16', 'ชาย', '0918206741', '$2a$12$kwGQ5ijiVuHQI08H3VVhHeD/gIf3MkQQnDCBT4selT8DgbOE7SHXm'),
('66200012@kmitl.ac.th', 2, '66200012', 'นาย', 'กฤตภาส เพ่งผุดผ่อง', 'อัส', '2004-10-08', 'ชาย', '0902537787', '$2a$12$tEbfjK5oFcTSDONjHiduh.SHxXogHxptYiLZ8AIrysd593xic8aYO'),
('66200028@kmitl.ac.th', 2, '66200028', 'นาย', 'เกียรติยศ จันทร์เพ็ง', 'ขนมเข่ง', '0000-00-00', 'ชาย', '', '$2a$12$8N2Wb.U9lFQaD9eblNUEle2TnStvWNg7JHRPpLhExL5/6peOoChTG'),
('66200033@kmitl.ac.th', 2, '66200033', 'นาย', 'คมกฤษ บินล่าเต๊ะ', 'กฤษ', '2004-10-25', 'ชาย', '0611769547', '$2a$12$x5SDv4QFkDZUccs6bi0r5O.ef08lRF1w3N7E4ioJfi6jrdxPk6HlG'),
('66200051@kmitl.ac.th', 2, '66200051', 'นาย', 'ชนสรณ์ ทองน้ำวน', '', '0000-00-00', 'ชาย', '', '$2a$12$mTAAfehHQWk0XmV9vSfDbO0c.BnIE8BAORmaIdMXyRPpfzETpZAV6'),
('66200052@kmitl.ac.th', 2, '66200052', 'นาย', 'ชนะพงศ์พันธุ์ ทรัพย์มี', 'พีท', '2004-06-01', 'ชาย', '095963099', '$2a$12$MW.gCgKl.dv5JQuMTSn3JOcB5MWASpQw09BrXnvNkeBDLPrKt/EsW'),
('66200059@kmitl.ac.th', 2, '66200059', 'นาย', 'ชิษณุพงศ์ งามน้อย', 'นนท์', '0000-00-00', 'ชาย', '', '$2a$12$YNS4YWkpSObnu.VXgXh1AOvHvUmD0JXn21b87kFz6JHb6ERAATYJW'),
('66200062@kmitl.ac.th', 2, '66200062', 'นาย', 'ฐิติกร กี้ข้อ', '', '0000-00-00', 'ชาย', '', '$2a$12$BW9xupo6DSREHZ4ZTp12GufzxQeg50rONFXvodzTEd02SRvyFZO5q'),
('66200063@kmitl.ac.th', 2, '66200063', 'นาย', 'ฑีฆทัศน์ คำระหง', 'ที', '2004-08-31', 'ชาย', '0959029373', '$2a$12$ISBbU784i3Uqp3/Z/FxCAen.fJIGsozUKK3oqXVe3IuYDoCrTEZdS'),
('66200082@kmitl.ac.th', 2, '66200082', 'นาย', 'ดัสกร ทับแสง', 'โทมัส', '0000-00-00', 'ชาย', '', '$2a$12$pCuEzlTda9UKLdriCmG20uh8lVCUGiVyKSmDgqPYhpF8iGo8J.lnS'),
('66200098@kmitl.ac.th', 2, '66200098', 'นาย', 'ธนดล ขวุนแขวง', '', '0000-00-00', 'ชาย', '', '$2a$12$oDzZoamHo2d05YZKsr7z4O.4LuMHthRVIKIAhQ8l8SVtyrjBgH/OC'),
('66200105@kmitl.ac.th', 2, '66200105', 'นาย', 'ธนะวัฒน์ บุญประสพ', 'ไนซ์', '2004-01-21', 'ชาย', '0932491392', '$2a$12$C4DxiGYMO1F7DA2Q2xjf6uFW1HSxuxtZIHwuwgQ/fyekPILV2YPdu'),
('66200108@kmitl.ac.th', 2, '66200108', 'นาย', 'ธนายุทธ ศรีเรือง', 'ปอนด์', '2005-04-14', 'ชาย', '0834547706', '$2a$12$3qUu1bMd6EwFw7VcT7nX5OuJ/a.DuJqvN8kt85WazsHc.Jwf/jAYG'),
('66200113@kmitl.ac.th', 2, '66200113', 'นาย', 'ธัญวุฒิ ลีวังศรี', '', '0000-00-00', 'ชาย', '', '$2a$12$I83.X37eQ0SucqVv5P577u1tJUQxB8PI4ugH3gJtQWi62V3z7mpUC'),
('66200117@kmitl.ac.th', 2, '66200117', 'นาย', 'ธีรเดช แสงอรุณ', 'เอิร์ธ', '2004-09-07', 'ชาย', '0620780682', '$2a$12$DPdAGxCtAiLbaiTpan2V1e8D0FP5SRzpCi4seiy3NQzZd4g6u2kj2'),
('66200122@kmitl.ac.th', 2, '66200122', 'นาย', 'ธีรภัทร์ อามาตย์', 'นิค', '2005-01-18', 'ชาย', '0925603534', '$2a$12$6qkm8zNdOg49GLmce6mNg.K9dcr.a8hLwg60HfQ8z1eyMAGrJtvQa'),
('66200137@kmitl.ac.th', 2, '66200137', 'นางสาว', 'บัณฑิตา วงศ์อนุรักษ์กุล', 'มุก', '2005-02-18', 'หญิง', '0825091864', '$2a$12$/XIYC42ZDjMhjC6UEUyLiu0pnEtmkERrKIFgMVsvNR9aOC8dwC7kK'),
('66200141@kmitl.ac.th', 2, '66200141', 'นาย', 'ปฐมพงศ์ ปานเกลี้ยง', 'ตังๆ', '2005-04-11', 'ชาย', '0635806948', '$2a$12$.BZrKPId6wxH5tTkqxWcdu0JMCCAd.11k2Zix3YnykVcsvkXx/1KS'),
('66200157@kmitl.ac.th', 2, '66200157', 'นาย', 'ปัณณวิชญ์ ยงภูมิพุทธา', '', '0000-00-00', 'ชาย', '', '$2a$12$dimyOHqN2Mlpw5I5R/OPFO9aren843KSndm56KnOoq8oOlx3BYbWq'),
('66200160@kmitl.ac.th', 2, '66200160', 'นาย', 'ปิยภัสร์ อัจฉราทิพย์', '', '0000-00-00', 'ชาย', '', '$2a$12$3H/tzaP.8sRbu/LFQ4Oifu6WPnAoKy8abK4XBb7acLxfvIBBHhpAG'),
('66200166@kmitl.ac.th', 2, '66200166', 'นาย', 'พงศ์พณิช อินทร์เทพ', 'เจมส์', '2004-11-10', 'ชาย', '0614875561', '$2a$12$dX02mj95XQ1Ws.N9UdQjGeoCTKPwlhx.rw5dMDePPKTFuclecWXFC'),
('66200174@kmitl.ac.th', 2, '66200174', 'นาย', 'พรเทพ สิงคะ', '', '0000-00-00', 'ชาย', '', '$2a$12$4dI1tfZ/mxhHcEi3px5ai.mVT8lFjtUyT2AI8/eTIxIKk9EGfQzXK'),
('66200179@kmitl.ac.th', 2, '66200179', 'นางสาว', 'พลอยชมพู เลิศพนนนท์', 'พิมพลอย', '0000-00-00', 'หญิง', '', '$2a$12$5qmNnXon6aL7T9paEha/hOhl7oUoLoU9aAUoLsHEUPqCLAvNAGSAO'),
('66200184@kmitl.ac.th', 2, '66200184', 'นาย', 'พีรพัฒน์ สมพงษ์', '', '0000-00-00', 'ชาย', '', '$2a$12$ii/LdhpqQn8mYNXPDTmCoOgErA3oOUzYXSYEz2es5yIEDJJNv4zMy'),
('66200190@kmitl.ac.th', 2, '66200190', 'นางสาว', 'เพ็ญพิชาา กาญจนพานิชย์', 'แพน', '2004-01-06', 'หญิง', '0935814918', '$2a$12$lgDnPVV5/gRRXP9.c0vMFeT8ZxqwY0uDBeC5zxz45FbhCS48e8KLO'),
('66200193@kmitl.ac.th', 2, '66200193', 'นาย', 'ภควัต พิชัยณรงค์', '', '0000-00-00', 'ชาย', '', '$2a$12$ojDhh69BLr5OtBydx7ekhenyWPWmFLxfiiBZYkQmkCJO3L3ba.HVG'),
('66200238@kmitl.ac.th', 2, '66200238', 'นาย', 'วรวิช แซ่ซิ่น', 'บอม', '2004-09-21', 'ชาย', '0935702132', '$2a$12$0u3jhVF/GsRJPx0THps25eIiDmunldwvhyx8cZ/dIv.sWGgzCTIYm'),
('66200245@kmitl.ac.th', 2, '66200245', 'นาย', 'วิชญะ อัธยาศัย', 'ฟลุ๊ค', '2005-04-09', 'ชาย', '0937839678', '$2a$12$PtQM7df3kuy6pGl1kao9Cu2qjVbVoHcgIpB0Dh42eXIco0LZlvfxK'),
('66200248@kmitl.ac.th', 2, '66200248', 'นาย', 'วีรภาพ เจียรพันธ์', 'ปอนด์', '2004-09-03', 'ชาย', '0806458931', '$2a$12$WYm/6H/EX1hCv5qVlyWNCOj/It.f3SZcDcELtnTYPSep926Ewbj5q'),
('66200250@kmitl.ac.th', 2, '66200250', 'นาย', 'ศตายุ ใสสว่าง', 'หมวด', '2004-12-14', 'ชาย', '0622310206', '$2a$12$CwgRccChyIpOKdBT3arGBeXG/hrp2Wx7zAxMKKp0gsNX17lIpYT9u'),
('66200257@kmitl.ac.th', 2, '66200257', 'นาย', 'ศิรชัช สุทธิรัตน์', '', '0000-00-00', 'ชาย', '', '$2a$12$mfEMpDUXmv.0FqSFWDcbbe5IGLHEeVyKMEO0g1IWhICJ/MKkZ2wIm'),
('66200277@kmitl.ac.th', 2, '66200277', 'นาย', 'สิฐวุฒิ จิตต์สวัสดิ์', '', '0000-00-00', 'ชาย', '', '$2a$12$CeGLOYdZlsdxF0o06idy7OrVIaPUSbflSE44CffNmKf/Nqdo2MGp2'),
('66200301@kmitl.ac.th', 2, '66200301', 'นาย', 'อติชาต ทองเปลว', 'ซันนี่', '0000-00-00', 'ชาย', '', '$2a$12$IHTfEhZ7E2Gk4xGg8rUvse1ob73R26HebKKbYOQMQzYOme8aqClG.'),
('66200316@kmitl.ac.th', 2, '66200316', 'นาย', 'อำนาจ งามเอก', '', '0000-00-00', 'ชาย', '', '$2a$12$TiZ8QCpPv3v4EUeMCqcIAusjwOC34ynwq2wz04g4gY3nWfezcGXUC'),
('66200326@kmitl.ac.th', 2, '66200326', 'นาย', 'กิตตินันท์ คูหา', 'ซันนี่', '2004-11-07', 'ชาย', '0989055242', '$2a$12$VPskkD1Np94oloX8LzY9Wu6Y7xt0l1EPWXLR6oqwcsSHmiEbr9b6K'),
('66200328@kmitl.ac.th', 2, '66200328', 'นาย', 'คำรณ รักเชียง', '', '0000-00-00', 'ชาย', '', '$2a$12$xWgYDwEYrWIkK2gqIrz.yeOZi4HjgHpz3ii1VYZemoeRS.Ka2Lw8u'),
('66200336@kmitl.ac.th', 2, '66200336', 'นางสาว', 'ชฎาภรณ์ โพธิ์ศิริ', 'เเก้ม', '0000-00-00', 'หญิง', '', '$2a$12$73c2/69Q1yQCmdy.r5nSL.xslRVXdp/WTGTtmjfKjdLz4rcKxVp9y'),
('66200338@kmitl.ac.th', 2, '66200338', 'นาย', 'ชนัฐกร อริยะอมรเลิศ', 'พีวี', '2004-12-06', 'ชาย', '0616288197', '$2a$12$31Kf8Y5ntHONlambOxSmduPMFKHdwgmHVhCY6IiapoXj4RaZNr4Bm'),
('66200339@gmail.com', 2, '66200339', 'นางสาว', 'ชนินาถ ปิยะศาสตร์', 'บัว', '2004-12-03', 'หญิง', '0957218639', '$2a$12$yKHBv7WexC6GZrNGOiN.Du2vS0eP225d1mxk/IcSOBPVa1VBQtmv.'),
('66200340@kmitl.ac.th', 2, '66200340', 'นางสาว', 'ชมพูนุท ศิริบุตร', 'ชมปริ', '0000-00-00', 'หญิง', '', '$2a$12$ZaAvS8OQ.M20ejMKi9msSOcLTITxF15f7D.2TPDY39Ljouha8V9zq'),
('66200341@kmitl.ac.th', 2, '66200341', 'นาย', 'ชยธร แร่ทอง', '', '0000-00-00', 'ชาย', '', '$2a$12$wL.dKOxriDaf/WRgUwM08uj8D8L12SNneOBYJjEGZUvXg71ydQGuO'),
('66200345@kmitl.ac.th', 2, '66200345', 'นาย', 'ณฐกร นิ่มกาญจนา', '', '0000-00-00', 'ชาย', '', '$2a$12$h0wpGmZ.2IYJdDuR5glcKOgFsTo0q/f0GKkAYLR2VqfQn/SCSWx5C'),
('66200347@kmitl.ac.th', 2, '66200347', 'นางสาว', 'ณัชชา ภูมิภัทรภักดี', 'พิมรี่พาย', '2004-08-27', 'หญิง', '0987427944', '$2a$12$S0cyNW6fDOx08EK0KrFHQOlPWrwri0fKHR64lYanvAKLUx2/J1aFa'),
('66200354@kmitl.ac.th', 2, '66200354', 'นาย', 'ดรณ์ จรรยาเสน', '', '0000-00-00', 'ชาย', '', '$2a$12$kAZ8sU6gButcP3l.vXoiSu9e6tFQxVbwCYhlDj/5L/owuYUEk4OCa'),
('66200357@kmitl.ac.th', 2, '66200357', 'นาย', 'ทินบดี สุมังคละสมบัติ', 'โอม', '2005-04-05', 'ชาย', '0615605305', '$2a$12$u/QLHO8DEiQI9yE7c3zBD.MD0WCmOa1cRS2VDAc2mLGwvnZQUQmp.'),
('66200361@kmitl.ac.th', 2, '66200361', 'นาย', 'ธีรนันท์ จันทร์กระจ่าง', 'ดามมี่', '0000-00-00', 'ชาย', '', '$2a$12$8PujCVnPW1eQ.0CH5cJ1FOnoFcdxoV0ETOUTNZgxJnxEw6NoyXSMy'),
('66200383@gmail.com', 2, '66200383', 'นาย', 'ภัทรดนัย บุญไทย', 'พีท', '2004-09-22', 'ชาย', '0991327031', '$2a$12$XpDEMHUH2NghNToXEFDyjeEnbn6ks/um80yzbuhluCWxgMvPinckO'),
('66200389@kmitl.ac.th', 2, '66200389', 'นางสาว', 'วนัชพร ฉายบุญครอง', 'ใบตอง', '2003-10-18', 'หญิง', '0944735671', '$2a$12$rlEct4rgCIqczelke7Cmx.0oK6.RZx5UcJZqFt0oBbB8rZQsSLlb2'),
('66200395@kmitl.ac.th', 2, '66200395', 'นางสาว', 'วาสิตาใจรังษี', 'ปอฝ้าย', '2004-09-25', 'หญิง', '0622192487', '$2a$12$.sJOocE4gTlHFXm9FPZ2T.W/8Ha7Ru6W8LU2oPHzURRHTeym6ovOG'),
('66200396@kmitl.ac.th', 2, '66200396', 'นางสาว', 'วิชญาพร ยาจิ๋ว', 'เกียว', '2005-07-17', 'หญิง', '0855053636', '$2a$12$oe8A7xGOAISZXKrxHbYcz.oLhqe8a3ns62KhoFqMdBgBGhBJQF4nC'),
('66200407@kmitl.ac.th', 2, '66200407', 'นาย', 'สรกฤต มีอินทร์', '', '0000-00-00', 'ชาย', '', '$2a$12$gilBI66BN0SFk4CQopNAvuFPsdRIrKeatvRP5aNpS5WuPLEm5yxUi'),
('66200408@kmitl.ac.th', 2, '66200408', 'นาย', 'สหเกียรติ์ กาญจนรัตน์', 'ตี๋', '2005-06-23', 'ชาย', '0618585405', '$2a$12$O0LKzhtLI5bqJMSNa47sQe4SkZIRB1n4rCuNBxVlXztZxFgrF/GVe'),
('66200411@kmitl.ac.th', 2, '66200411', 'นาย', 'สิรภพ ปิติชูชีพ', 'เบสท์', '2005-01-01', 'ชาย', '0953176495', '$2a$12$XzwQ.1vkqVxZRJhePD9CJea8GylRZBCSr2uuqCXeYSx2WIoNk96xq'),
('66200415@kmitl.ac.th', 2, '66200415', 'นาย', 'สุรชาติ คงสงค์', 'บอล', '2003-03-15', 'ชาย', '0980807909', '$2a$12$vbchAwxy3uATO0ntlowzheXnyiamavRW0DKh.p4OA9mdyf1nX2xIO'),
('66200420@kmitl.ac.th', 2, '66200420', 'นาย', 'อภิศักดิ์ เพชรเศษ', 'โย', '2005-06-21', 'ชาย', '0937154851', '$2a$12$D6/oz0pwakAoLwbiC7kqpe7iyPJVDzMQLEBBGveKsi4zRbKc8Sbe2'),
('66200423@kmitl.ac.th', 2, '66200423', 'นาย', 'อัครวินท์ ดัชนี', '', '0000-00-00', 'ชาย', '', '$2a$12$aMOgv0qINcK13vfXmx831.DjtQk3WTFo2km/EMmS0BUI.qkvIKgTS'),
('66200425@kmitl.ac.th', 2, '66200425', 'นาย', 'จิราเดช พยุหกฤษ', 'ต้า', '0000-00-00', 'ชาย', '', '$2a$12$Nu9CgTOL6qWDE6jBkYzxxeHexFP8QGWzLVJspZyCqYVf6bbK2YSzi'),
('67200014@kmitl.ac.th', 1, '67200014', 'นางสาว', 'กัณฐมณี กอบการ', 'หงส์ทอง', '0000-00-00', 'หญิง', '', '$2a$12$ig7zErTneX9XCAKUXfkRQO9V51Bs6gY4G6xHLL8R0h1jRPlJ3FlUe'),
('67200024@kmitl.ac.th', 1, '67200024', 'นาย', 'กิตติศักดิ์ รัตนรักษ์', 'ฟิว', '0000-00-00', 'ชาย', '', '$2a$12$zp8vLTnJoSYeJhGe671MMunfJsX/ILiF3C7FaueqiurML4dXOIqm6'),
('67200030@kmitl.ac.th', 1, '67200030', 'นาย', 'คณพัฒน์ รุ่งรพีพรพงษ์', 'จอร์จ', '0000-00-00', 'ชาย', '', '$2a$12$szqiCNpBnDZZ6.brGow9Q.hHaGsj7zICQWI5yT2gq/K.etwkdOWvC'),
('67200031@kmitl.ac.th', 1, '67200031', 'นาย', 'คณาธิป วิเชียรศรี', 'เจ้านาย', '0000-00-00', 'ชาย', '', '$2a$12$LvLepwAzJuQaLnmoqr383.vjkE4z981Xc8xdQ6HlBh7cYt8zCSvBW'),
('67200032@kmitl.ac.th', 1, '67200032', 'นาย', 'คมสัน หัสบงกต', 'เค', '2005-11-18', 'ชาย', '0930878882', '$2a$12$t53Dsy.nXKg1F7R43e0YneOr9mpXedJHiZXf2GRxeg/wq3QIna99.'),
('67200049@kmitl.ac.th', 1, '67200049', 'นาย', 'เจษฎา ศรีสง่า', 'พี', '2005-07-24', 'ชาย', '0626253837', '$2a$12$aTo3sLeNPmnWjQZQAW6LjujlLsyUaVV29BLyS5FSL5NADuEWdDGZK'),
('67200050@kmitl.ac.th', 1, '67200050', 'นาย', 'เฉลิมรัฐ เพ็ชรสุวรรณ', 'เบนซ์', '0000-00-00', 'ชาย', '', '$2a$12$on/XvJs9vgBf.4eSDUIxSuAWH3Vr6vcSTjljobWRDmdz18HuvN5Vq'),
('67200062@kmitl.ac.th', 1, '67200062', 'นางสาว', 'ชุติกาญจน์ แก้วสมศรี', 'ไอซ์', '0000-00-00', 'หญิง', '', '$2a$12$R0FQy5UnI6k.A7d70K/hYeh/Chh3f6xc.wSxeRjFsS7o6Zfjeslfq'),
('67200071@kmitl.ac.th', 1, '67200071', 'นาย', 'ณภัทร ตุลารักษ์', 'ออฟ', '2005-11-28', 'ชาย', '0945467644', '$2a$12$qcvksPQCbce/2xyA9W0G6e5oK3XlEG.4106ixWzUTpC78tsbYOeXC'),
('67200079@kmiltl.ac.th', 1, '67200079', 'นางสาว', 'ณัฐธิดา เกื้อประจง', 'อัน', '2005-12-11', 'หญิง', '0801585306', '$2a$12$tY7xaTYWLQtrmz5fHIvydOjKW9AnLSuTiuW0IoSUjiKHnbYbrk9Mm'),
('67200081@kmitl.ac.th', 1, '67200081', 'นาย', 'ณัฐนนท์ ชุมบุญ', 'นนท์', '2006-05-14', 'ชาย', '0968712489', '$2a$12$XUIopZldwdVOjJTQyQaH3.F2zYA2143xcs2c4bvwkypAvY.8h6QN6'),
('67200088@kmitl.ac.th', 1, '67200088', 'นาย', 'ณิพิชญ์ มาศเมฆ', 'เอี๊ยก', '0000-00-00', 'ชาย', '', '$2a$12$MkWhAn2Uj6UJm6AI3nyo0e.CItWZOExayVmGzZg0ivPfe4mMFPdw2'),
('67200093@kmitl.ac.th', 1, '67200093', 'นาย', 'นายตระกูลชัย เเซ่ติ้ง', 'เฮ้าซุง', '2005-12-04', 'ชาย', '0980850838', '$2a$12$OsFbhE.Q.WAkArNmlqqjqeqtlPB81u3F6Du/uuA1x5PaSHQ/vOzSC'),
('67200099@kmitl.ac.th', 1, '67200099', 'นาย', 'ทัชภูมิ ใจดี', 'ไปน์', '2005-11-28', 'ชาย', '0986782950', '$2a$12$Z2laI83Xy8/e62kargB7y.APUtyisnRVkeZpqqQd.oiopav9k.ngq'),
('67200102@kmitl.ac.th', 1, '67200102', 'นาย', 'ทีปกิติ์ พรหมสัตยพรต', 'ริว', '2005-11-26', 'ชาย', '0973016465', '$2a$12$JewiZOYvsuUI9uNqTnQuk.gZdnOxM4cLbrRjUM3PtgAEKZbVJmEP.'),
('67200103@kmitl.ac.th', 1, '67200103', 'นาย', 'ทีปศ์ยุส พิจยานนท์', 'น้ำแร่', '0000-00-00', 'ชาย', '', '$2a$12$c5fmRhv0TTn4wQyCWBa16O7AJMUMJsiDBc8v4Wp3jBQLohjobazFS'),
('67200107@kmitl.ac.th', 1, '67200107', 'นาย', 'ธนโชติ เพ็ชรรัตน์', 'อ๋า', '0000-00-00', 'ชาย', '', '$2a$12$P4k1t1p/9fu.cwJfmHg5PeieUw3x9RvHEsCnNs9wQK5uQXmfR58XC'),
('67200119@kmitl.ac.th', 1, '67200119', 'นาย', 'ธฤต อ่องมะลิ', 'วิน', '2006-02-13', 'ชาย', '0970360046', '$2a$12$q8yrbbY4XO/yA9zoooBfNefVxqro7ffy5VZbg8JX73qWRm3k/Osc.'),
('67200127@kmitl.ac.th', 1, '67200127', 'นาย', 'ธีเดช สถิรสมบัติ', 'ติณณ์', '0000-00-00', 'ชาย', '', '$2a$12$pCzQC6gP9OoqnP3neXhtiuBiX.cNGTsQxa3MvwY.8dEL6LWUaAPbS'),
('67200134@kmitl.ac.th', 1, '67200134', 'นาย', 'นภดล ขาวดี', 'ปอร์ซ่า', '0000-00-00', 'ชาย', '', '$2a$12$IUYCZ/EBY8N1KEKvJ/80J.AhnvlwseDRWghyapp/M2G.DEgayU37m'),
('67200148@kmitl.ac.th', 1, '67200148', 'นาย', 'เนติภูมิ มีศรี', 'ไอเซน โซสุเกะ', '0000-00-00', 'ชาย', '', '$2a$12$YZOJPdv8M5KVNGceYVMadO5SUdN4bCPzuPwa6yKXtxLJDBLpfgEte'),
('67200155@kmitl.ac.th', 1, '67200155', 'นาย', 'ปฏิภาณ เสนาป่า', 'ปาล์ม', '0000-00-00', 'ชาย', '', '$2a$12$WRKudDDZ9ZV7tx6Gp/s64./d6zUN0AT/zw9YFP8p8YZYzkCXQGlGm'),
('67200165@kmitl.ac.th', 1, '67200165', 'นางสาว', 'ปัณณพร พรหมรักษ์', 'โบนัส', '0000-00-00', 'หญิง', '', '$2a$12$dwRFumJ/4U3r6CES/uoLIOXzaqAJRKLrrsHdIpN2dsfQWPM/881/G'),
('67200172@kmitl.ac.th', 1, '67200172', 'นางสาว', 'ปิ่นปินัทธ์ เข็มทอง', 'ปิ่น', '0000-00-00', 'หญิง', '', '$2a$12$qXvHbZzZxa0ZDgWDH9AzzO3X.TI7CSAar7si1mgRZrzKHBTHCtkli'),
('67200219@kmitl.ac.th', 1, '67200219', 'นาย', 'ภูวดล วิสาละ', 'เดล', '2006-01-12', 'ชาย', '0611301594', '$2a$12$icxhQtMlwuescleCXxigbuLg6nONF8FHg72StgptAhlE2gqhm5TFi'),
('67200223@kmitl.ac.th', 1, '67200223', 'นาย', 'นายมีสุข เอกพงษ์', 'โก้', '2006-01-16', 'ชาย', '0935654015', '$2a$12$a5aibraFKn2NG.FH8vjJTOvf1ty1PxtHPNp4wYgISlcqR1UT7X1zi'),
('67200235@kmitl.ac.th', 1, '67200235', 'นางสาว', 'รินรดา บุญมี', 'เนนย', '0000-00-00', 'หญิง', '', '$2a$12$j/DAmyZg.I3N7joUS/mhQ.gxQ2Bdhd7c7b30v.Q/Ul0F52dW4zsK2'),
('67200258@kmitl.ac.th', 1, '67200258', 'นาย', 'วุฒิชัย อ่องรัตนากุล', 'เฟิร์ส', '0000-00-00', 'ชาย', '', '$2a$12$Qk9fff7D6LMUG1v/bxLoZ.VUJWCIIlzDFySNZoR.HcSSIKiQ58ICi'),
('67200272@kmitl.ac.th', 1, '67200272', 'นาย', 'ศุภฤกษ์ มะนะกุล', 'ฟิวส์', '0000-00-00', 'ชาย', '', '$2a$12$j.UymZhg/1rW1eLqYntpAu4hGyCOjZDeL4MuaDs5QietCtwd8YR8K'),
('67200277@kmitl.ac.th', 1, '67200277', 'นาย', 'สรวิศ บัวขนาบ', 'ปันนี่', '0000-00-00', 'ชาย', '', '$2a$12$m3BBErKt2wGpThDgD7BVU.PRS7rN/OyT0pATn19X6ulzC5HNcEype'),
('67200305@kmitl.ac.th', 1, '67200305', 'นาย', 'อนิวัต ยะคำ', 'ภู', '2005-12-25', 'ชาย', '0987294984', '$2a$12$aCXM8HsxXYrN3wqHYxBKmuFLNPVBjoRkeGdNi.MiIUswsqtJWSZ/y'),
('67200324@kmitl.ac.th', 1, '67200324', 'นาย', 'กนกพัฒน์ โพธิ', 'ปลาหมอ', '0000-00-00', 'ชาย', '', '$2a$12$IrrAuA3gjy9ZKryhxMWeN.G8t7wHCvW.Brq0GuKddcCQRNj86UAai'),
('67200344@kmitl.ac.th', 1, '67200344', 'นาย', 'ชวัลวิทย์ จันทร์ศุกฤกษ์', 'ปังปอนด์', '0000-00-00', 'ชาย', '', '$2a$12$25ACM.CV.x4W1emPWWLLfODqtFrVmqg1xET8eKy8Q2aVRUq6zCUxC'),
('67200348@kmitl.ac.th', 1, '67200348', 'นาย', 'ณรงค์รักษ์ เรืองศักดิ์', 'ไอซ์', '2005-07-28', 'ชาย', '0929744516', '$2a$12$FuyhM8UeNqozXZAsSvghHudakw76gopfBk3MlwkGGQL1yitVyTabe'),
('67200349@kmitl.ac.th', 1, '67200349', 'นาย', 'ณัควัต เศรษฐเอกพันธ์', 'สำเนา', '0000-00-00', 'ชาย', '', '$2a$12$kHzy9CxmZ6VyTrZueNhRLuah4mvgKrsZiUCbKvGyhii8oz6k7cn0K'),
('67200350@kmitl.ac.th', 1, '67200350', 'นางสาว', 'ณัฏฐ์ชยา จำปา', 'วาวา', '2005-10-16', 'หญิง', '0650053473', '$2a$12$X1BLoo98LRFC3TzSK64jN.PLTY/MKUZlzYzg6c3UJ0blVsSJfhG7G'),
('67200351@kmitl.ac.th', 1, '67200351', 'นาย', 'ณัฐธนน ทุมรัตน์', 'ตั้น', '0000-00-00', 'ชาย', '', '$2a$12$nsaiqtIrXmVGbADW4r7sW.7pArBZeAS4SShD.VLJzS7R9x4HMvlQW'),
('67200357@kmitl.ac.th', 1, '67200357', 'นาย', 'ดนุพล จิ้วพงศสวัสดิ์', 'นิว', '0000-00-00', 'ชาย', '', '$2a$12$xz7LEc6XQ/pH9YRdDgvd6.WcxtZemq0MEqIuIpLFviVqaEnB9wczC'),
('67200367@kmitl.ac.th', 1, '67200367', 'นางสาว', 'ธัญญรัตน์ ส่งสมใจ', 'โมริ', '2005-07-04', 'หญิง', '0964159745', '$2a$12$N6n3KHY9jqL92gm4MJNjMeZm5f.TdnMTmYpCrNq62oQQb1QmJ9xjq'),
('67200368@kmitl.ac.th', 1, '67200368', 'นาย', 'ธีรภัทร ทองสิงห์', 'เจมส์', '0000-00-00', 'ชาย', '', '$2a$12$wE2JA2kvlMVCe3IYUuzCKeBPgMuLna68eYpYbJuyUNcgnSmHewirC'),
('67200369@kmitl.ac.th', 1, '67200369', 'นาย', 'นายธีรศาสนต์ คงเกิด', 'Tee', '2006-01-10', 'ชาย', '0656709042', '$2a$12$3K5OeAELCYn8TWd17M4SFuiAzfk2B87Gh9dGlBVpyGbTxCJ0Q7X8a'),
('67200375@kmitl.ac.th', 1, '67200375', 'นาย', 'ปฏิภาณ ประพฤติดี', 'ไบร์ท', '2006-04-16', 'ชาย', '0941240631', '$2a$12$63wnjONsAZ48h5NhoPwa3.MGP72pX9Q.rhpawHurpQt86rtxMNsfO'),
('67200380@kmitl.ac.th', 1, '67200380', 'นาย', 'ปรินทร คงทอง', 'แบงค์', '2006-02-05', 'ชาย', '0631102883', '$2a$12$abhzvCzgb3SJo83A9ZV2ZeSiiTUFGyluFtPetRjl9kFqOewGetq/6'),
('67200381@kmitl.ac.th', 1, '67200381', 'นาย', 'ปารเมศ สิงคะ', 'มอสซี่', '0000-00-00', 'ชาย', '', '$2a$12$RSunPlRPkEbjRwVcG9HXw.eY/wMEjCvIkXeoHeozTwo.fjCG0rClG'),
('67200401@kmitl.ac.th', 1, '67200401', 'นาย', 'ภุมเรศ หมื่นระย้า', 'ฟา', '2005-10-28', 'ชาย', '0619161928', '$2a$12$RrOiWb656D/6.aKCz54hDOQ3OwpiEcrwE5lDY1xFKVLdl9GHj/gkC'),
('67200412@kmitl.ac.th', 1, '67200412', 'นาย', 'รุจิณัฐ อาศิรเมธี', 'ฟ้า', '2006-06-27', 'ชาย', '0800479886', '$2a$12$E6AsIRqOInfbhwoK7khx9O4onrxLdgoEpJdaBFHtgKhCMPFdWCsjC'),
('67200419@kmitl.ac.th', 1, '67200419', 'นางสาว', 'วิมลสิริ บุญยก', 'พิงค์', '2006-01-04', 'หญิง', '0971264731', '$2a$12$BPwZKbyYldRvr3xn37up7eYSKCh0vLqRWsATvZPSs5hDA0fdvMR8q'),
('67200439@kmitl.ac.th', 1, '67200439', 'นาย', 'สุทธิธนินท์ อัครมณีนันท์', 'โชกุน', '2006-07-07', 'ชาย', '0826420942', '$2a$12$.OKcCseCcTah57RWKTPSku1WuZkVKh5HR8m1Dob.32ViGvisgvKba'),
('67200452@kmitl.ac.th', 1, '67200452', 'นาย', 'อัษฎายุธ พันธ์รักษ์ณรงค์', 'ฟีฟ่า', '0000-00-00', 'ชาย', '', '$2a$12$NfOoVgSN0SL8ecTS2x5LWu0pPr.iAXMngTm5VvIz9rFvRRGp5b8Li'),
('67200460@kmitl.ac.th', 1, '67200460', 'นาย', 'สุรเดช กรณ์ศิริ', 'ไอซ์', '0000-00-00', 'ชาย', '', '$2a$12$UGqyH4jNSK6wpvA7jt7XYuL3xY0AE3UEB9oexyD2NIDxoWAlnbhHq'),
('ar32zaza@gmail.com', 1, '67200010', 'นาย', 'กฤษณะ สุขกรี', 'ฟิล์ม', '2005-12-17', 'ชาย', '0936268091', '$2a$12$kdPgJ019bTfe5sh/RWn/xuONzMoQH843HJiOLBd/6gCZZs6q0ICRm'),
('bompinyoo@gmail.com', 1, '67200400', 'นาย', 'ภิญญู ณัฐญาติมา', 'บอมบ์', '2005-10-06', 'ชาย', '0957795165', '$2a$12$JwBcK9inkH6Bq9qUtBJKkeQPTW8rIiO.PLJXZ2iPvsbLCC2u.a1Fu'),
('chutikan292548@gmail.com', 1, '67200063', 'นางสาว', 'ชุติกาญจน์ แซ่อึ้ง', 'ตา', '2005-07-29', 'หญิง', '0823456141', '$2a$12$V2.4XpnszQlucvbQNt1Wjuky2TopO8ae0kWnSrOjfGC93BL/Or/RW'),
('kittipatpakamas@gmail.com', 1, '67200023', 'นาย', 'กิตติพัฒน์ ผกามาศ', 'ไทเกอร์', '2005-06-24', 'ชาย', '0630626891', '$2a$12$HkjLN6.QRLfD1Y39N9C3TuPvHDibhwb9vcK8q879PO5z.61DX10aq'),
('nattawat.fing@gmail.com', 3, '65200123', 'นาย', 'ณัฐวัฒน์ อาทรกิจวัฒน์', 'ฟิง', '2004-06-08', 'ชาย', '0941493541', '$2a$12$cTDrp1dL66fjz7StXW42PuXNMlS86snbbyjZf.Otq79TmP46VfBxe'),
('pasutpd@gmail.com', 1, '67200187', 'นาย', 'พศุตม์ เพชรรอด', 'ออฟ', '2006-01-13', 'ชาย', '0930611106', '$2a$12$smPyHchGCCwre0IMY4KijODQ0hfyxJw6.ERQrVdraiteJ4UaaWVCS'),
('phusitlapet@gmail.com', 3, '65200276', 'นาย', 'ภูสิทธิ์ หล้าเพชร', 'ภูมิ', '2003-09-24', 'ชาย', '', '$2a$12$Ccb7PoALZwHdNayIWmbZJ.KM/bwE4ZTycyZ4hvX./mr7Fq5HqEAMm'),
('picchayut@gmail.com', 3, '65200237', 'นาย', 'พิชญุตม์ อุ่นนวล', 'ภูมิ', '2003-06-13', 'ชาย', '0619872063', '$2a$12$B2/8X1A63pKVT4iHwrsg/OkvL3MSAo9iK9JLIALWz/Kco5UEfFQ2S');

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers` (
  `email` varchar(255) NOT NULL,
  `title` varchar(50) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `birthdate` date NOT NULL,
  `gender` varchar(10) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `passwords` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`email`, `title`, `full_name`, `nickname`, `birthdate`, `gender`, `phone`, `passwords`) VALUES
('athasart.na@kmitl.ac.th', 'อาจารย์', 'อรรถศาสตร์ นาตเทวัญ', 'อ๊อด', '0000-00-00', 'ชาย', '0816326779', '$2a$12$vTgc9gHDGgAvbY3.Aq6sy.MEipoc57/Hn5eQ7M65PF5KW4UgoOrcG'),
('jaturong.ka@kmitl.ac.th\n', 'นาย', 'จตุรงค์ เกตุนิมิต\n', 'โอม', '1999-06-03', 'ชาย', '', '$2a$12$m7Fifz2LT28JWOzJES8J2OIovrRH9gaFYQxy.y5IaETnjKfqpJ9xu'),
('pisakorn.si@kmitl.ac.th', 'อาจารย์', 'นภัทรพี สิทธิวัจน', 'แฮปปี้', '2000-02-02', 'ชาย', '', '$2a$12$f4EQeoTWOUY6Y.rh3usQgu/MKpGly64Kg0MdH8Ay4Jhf6Absocz3q'),
('rattikorn.so@kmitl.ac.th', 'อาจารย์', 'รัตติกร สมบัติเเก้ว', 'จุ๋ม', '1974-11-20', 'หญิง', '0877110520', '$2a$12$/2Hk36oxqK2wGw0HnQMgGu7FnjPIPQSykLuiLEfONiGDFiPbX7lSq'),
('silar.si@kmitl.ac.th\r\n', 'ว่าที่ ร.ต. ', 'ศิลา ศิริมาสกุล ', '', '1982-05-04', 'ชาย', '', '$2a$12$FT9E33UicrXLWRUwl8FaDOwJsbwNGjWaorIm81c1TqYCTqqHt7.dq');

-- --------------------------------------------------------

--
-- Table structure for table `years`
--

DROP TABLE IF EXISTS `years`;
CREATE TABLE `years` (
  `id` int(11) NOT NULL,
  `year_name` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `years`
--

INSERT INTO `years` (`id`, `year_name`) VALUES
(1, 'CE04'),
(2, 'CE03'),
(3, 'CE02'),
(4, 'CE01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`email`),
  ADD KEY `years` (`years`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `years`
--
ALTER TABLE `years`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`years`) REFERENCES `years` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
