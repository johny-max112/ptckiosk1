-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 14, 2025 at 06:47 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ptc_kiosk3`
--

-- --------------------------------------------------------

--
-- Table structure for table `about`
--

CREATE TABLE `about` (
  `id` int(11) NOT NULL,
  `mission` text DEFAULT NULL,
  `vision` text DEFAULT NULL,
  `history` text DEFAULT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `about`
--

INSERT INTO `about` (`id`, `mission`, `vision`, `history`, `last_updated`) VALUES
(1, 'Pateros Technological College commits itself to:\n\nprovide quality higher education thru specialized professional instruction;\nprovide training in scientific, technological, industrial and vocational fields;\nenhance moral and spiritual values;\ninstill the love of country and appreciation of the Filipino cultural heritage;\npromote environmental awareness and unconditional love for mother earth;\nafter educational opportunities especially to marginalized individuals;\nheighten students creativity and leadership through extra and co-curricular activities; and\nproduce quality graduation adept with technological skills and professional education.', 'Pateros Technological College envisions itself as an institution of higher learning which is strongly committed to the holistic development of the students to improve their lives in particular and the society in general.', 'Pateros Technological College (PTC) is a technical-vocational school established on January 29, 1993 by virtue of Municipal Ordinance No. 93-07. It started its operation on August 16, 1993, initially offering short term and two-year Associate in Computer Science, Computer Secretarial Science, and Computer Technology courses. Systematrix Computer Education and Services, Inc. (SCESI) became the partner group of PTC through Municipal Resolution No. 64 – 95 authorizing the Municipality of Pateros to sign a Memorandum of Agreement with SCESI.\n\nThe partnership between PTC and SCESI ended in October, 1995. Keeping up with the goal to continue its technical-vocational advocacy, PTC forged another linkage, this time with the Technological University of the Philippines (TUP). On September 26, 1995, PTC became the recipient of the Adopt-A-School program of TUP through another Memorandum of Agreement. The linkage gave birth to the first four-year Bachelor of Computer Science program in the academic year 1997 – 1998. PTC also became TUP’s ally in the off-campus training of the latter’s undergraduate and graduate students.\n\nBecause of the linkage, Pateros Technological College gained its institutional footing to stand on its own. This paved the way to offer ladderized scheme programs that lead to Baccalaureate Degrees. The Bachelor of Science in Education, Major in Information System and Minor in Mathematics was offered in SY 2006 – 2007. Then, the Certificate in Hotel and Restaurant Management leading to Bachelor of Science in Hospitality Management and Bachelor of Science in Office Administration were offered the following school year.', '2025-10-19 00:44:02');

-- --------------------------------------------------------

--
-- Table structure for table `academic`
--

CREATE TABLE `academic` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `academic`
--

INSERT INTO `academic` (`id`, `title`, `content`, `created_at`) VALUES
(5, 'Bachelor of Science Information Technology (BSIT)', 'The emphasis of this four-year degree is on technology and computers. Its main goal is to prepare students for the rapidly changing demands of the IT sector by teaching them the fundamentals of computer hardware, software, databases, algorithms, telecommunications, user strategies, web development, application testing, and computer graphics. As a result, when applying for IT support business processes, be well-prepared.', '2025-10-19 00:46:04'),
(6, 'Certificate in Computer Sciences (CCS)', 'Under the Institute of Information and Communication Technology, this two-year ladderized curriculum is offered. Information technology, database management, and system maintenance are its key focus.', '2025-10-19 00:46:22'),
(7, 'Bachelor of Science in Office Administration (BSOA)', 'Students enrolled in this four-year degree are prepared for a job in a professional, outcome-focused, high-tech setting. The program includes courses that will fully acquaint students with office administration procedures, technology, and modern business setup.', '2025-10-19 00:47:11'),
(8, 'Certificate in Office Administration (COA)', 'Within the Institute of Business and Office Administration, this two-year program is ladderized. Techniques for human resources and office management are its main objectives.', '2025-10-19 00:47:26'),
(9, 'Associate in Business Administration (ABA)', 'Students enrolled in the Associate in Business Administration get a foundational understanding of a number of business subjects, including accounting, marketing, management, finance, and entrepreneurship. With an emphasis on critical thinking, problem-solving, and effective communication, it equips students to work effectively in a fast-paced corporate setting.\n\nThrough the program\'s combination of theoretical instruction and real-world applications, students can comprehend and implement fundamental business ideas. Graduates are ready for entry-level roles in small business management, sales, customer service, or administrative assistance', '2025-10-19 00:48:11'),
(10, 'Associate in Accounting Information System (AAIS)', 'The two-year Associate in Accounting Information System (AAIS) curriculum equips students with fundamental knowledge and abilities in information systems and accounting. The goal of this multidisciplinary program is to help students manage and apply financial data in contemporary company settings by fusing technology and accounting principles.\n\nThe curriculum prepares graduates for entry-level positions in data analysis, bookkeeping, accounting, and information systems support. They can also pursue a bachelor\'s degree in a related field.', '2025-10-19 00:49:19'),
(11, 'Associate in Human Resource Development (AHRD)', 'Students enrolled in the Associate in Human Resource Development gain the fundamental skills necessary to oversee workforce operations, such as hiring, training, performance reviews, and employee relations. It combines labor relations, organizational behavior, and management concepts to create a framework for efficient HR procedures.\n\nThe curriculum prepares students to assist HR operations in a variety of organizational settings by emphasizing ethical decision-making, problem-solving, and interpersonal communication.', '2025-10-19 00:49:30'),
(12, 'Associate in Hotel and Restaurant Technology (AHRT)', 'The Associate in Hotel and Restaurant Technology program cultivates skills in front desk management, food and beverage preparation, hotel and restaurant operations management, and housekeeping services. In order to guarantee excellent visitor experiences, it places a strong emphasis on hands-on training, superior customer service, and the incorporation of hospitality standards.\n\nThrough the integration of academic knowledge and practical applications, the program fosters creativity, professionalism, and ethical work practices while empowering students to adjust to the ever-changing demands of the hospitality sector.', '2025-10-19 00:49:46');

-- --------------------------------------------------------

--
-- Table structure for table `academic_programs`
--

CREATE TABLE `academic_programs` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `academic_programs`
--

INSERT INTO `academic_programs` (`id`, `title`, `content`, `created_at`) VALUES
(3, 'Bachelor of Science Information Technology (BSIT)', 'The emphasis of this four-year degree is on technology and computers. Its main goal is to prepare students for the rapidly changing demands of the IT sector by teaching them the fundamentals of computer hardware, software, databases, algorithms, telecommunications, user strategies, web development, application testing, and computer graphics. As a result, when applying for IT support business processes, be well-prepared.', '2025-10-30 04:08:27'),
(4, 'Certificate in Computer Sciences (CCS)', 'Under the Institute of Information and Communication Technology, this two-year ladderized curriculum is offered. Information technology, database management, and system maintenance are its key focus.', '2025-10-30 04:08:45'),
(5, 'Bachelor of Science in Office Administration (BSOA)', 'Students enrolled in this four-year degree are prepared for a job in a professional, outcome-focused, high-tech setting. The program includes courses that will fully acquaint students with office administration procedures, technology, and modern business setup.', '2025-10-30 04:09:03'),
(6, 'Certificate in Office Administration (COA)', 'Within the Institute of Business and Office Administration, this two-year program is ladderized. Techniques for human resources and office management are its main objectives.', '2025-10-30 04:09:24'),
(7, 'Associate in Business Administration (ABA)', 'Students enrolled in the Associate in Business Administration get a foundational understanding of a number of business subjects, including accounting, marketing, management, finance, and entrepreneurship. With an emphasis on critical thinking, problem-solving, and effective communication, it equips students to work effectively in a fast-paced corporate setting.\n\nThrough the program\'s combination of theoretical instruction and real-world applications, students can comprehend and implement fundamental business ideas. Graduates are ready for entry-level roles in small business management, sales, customer service, or administrative assistance', '2025-10-30 04:09:38'),
(8, 'Associate in Accounting Information System (AAIS)', 'The two-year Associate in Accounting Information System (AAIS) curriculum equips students with fundamental knowledge and abilities in information systems and accounting. The goal of this multidisciplinary program is to help students manage and apply financial data in contemporary company settings by fusing technology and accounting principles.\n\nThe curriculum prepares graduates for entry-level positions in data analysis, bookkeeping, accounting, and information systems support. They can also pursue a bachelor\'s degree in a related field.', '2025-10-30 04:10:06'),
(9, 'Associate in Human Resource Development (AHRD)', 'Students enrolled in the Associate in Human Resource Development gain the fundamental skills necessary to oversee workforce operations, such as hiring, training, performance reviews, and employee relations. It combines labor relations, organizational behavior, and management concepts to create a framework for efficient HR procedures.\n\nThe curriculum prepares students to assist HR operations in a variety of organizational settings by emphasizing ethical decision-making, problem-solving, and interpersonal communication.', '2025-10-30 04:10:19'),
(10, 'Associate in Hotel and Restaurant Technology (AHRT)', 'The Associate in Hotel and Restaurant Technology program cultivates skills in front desk management, food and beverage preparation, hotel and restaurant operations management, and housekeeping services. In order to guarantee excellent visitor experiences, it places a strong emphasis on hands-on training, superior customer service, and the incorporation of hospitality standards.\n\nThrough the integration of academic knowledge and practical applications, the program fosters creativity, professionalism, and ethical work practices while empowering students to adjust to the ever-changing demands of the hospitality sector.', '2025-10-30 04:10:41');

-- --------------------------------------------------------

--
-- Table structure for table `academic_requirements`
--

CREATE TABLE `academic_requirements` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `academic_requirements`
--

INSERT INTO `academic_requirements` (`id`, `title`, `content`, `created_at`) VALUES
(3, 'Incoming New Regular Student', 'Step 1: Office of the College Registrar: Submission of requirements. Documents must be enclosed in a closed white long folder with plastic cover\nStep 2: Assessment Office: Applicable fees will be assessed\nStep 3: Cash Office: Payment of LMS (P300), Tuition, Miscellaneous, and other applicable fees\nStep 4: MIS Office (Room 301-A): Obtaining of PTC institutional Email and Printing of School ID\nStep 5: CESJS Office (Room 301-B): Submission of Student Commitment Form.', '2025-10-30 14:08:16'),
(4, 'Old Regular Student', 'Step 1: Assessment Office: Applicable Fees will be assessed\nStep 2: Cash Office: Payment of LMS (P300), Tuition, Miscellaneous, and other applicable fees\nStep 3: MIS Office (Room 301-A): Validation of School ID\nStep 4: CESJS Office (Room 301-B): Submission of Student Commitment Form.\nStep 5: Office of the College Registrar Claiming of Certificate of Registration (COR).', '2025-10-30 14:08:32'),
(5, 'Irregular Students', 'Step 1: Advising Area: Evaluation and Advising of Courses/Subjects\nStep 2: Assessment Office: Applicable fees will be assessed\nStep 3: Cash Office: Payment of LMS (P300), Tuition, Miscellaneous, and other applicable fees\nStep 4: MIS Office (Room 301-A): Obtaining of PTC institutional Email and Printing of School ID\nStep 5: CESJS Office (Room 301-B): Submission of Student Commitment Form.', '2025-10-30 14:09:05'),
(6, 'Executive Class ', 'EARN A DEGREE WHILE WORKING OR MANAGING YOUR BUSINESS!\nENROLL NOW IN OUR PTC EXECUTIVE CLASS!\n\nADMISSION FOR THE THIRD TRIMESTER OF ACADEMIC YEAR 2025-2026\nExecutive Class (New Students - Batch 24)\nFor Working Individuals and Entrepreneurs\n\nThe PTC Executive Class offers a flexible, modular trimester program designed for working professionals and entrepreneurs who wish to pursue higher education while balancing their careers or businesses.\n\nAvailable Degree Programs\nBachelor of Science in Office Administration (BSOA)\nThis four-year degree program prepares students for careers in high-tech office environments with comprehensive training in administration, technology, and modern business operations.\n\nBachelor of Science in Information Technology (BSIT)\nThis four-year degree program equips students with essential skills in hardware, software, databases, web development, and computer graphics, preparing them for careers in the IT industry.\n\nProgram Structure\nThe Executive Class follows a trimester system spanning six (6) trimesters over two (2) years.\n\nWeekdays: 6:00 PM – 9:00 PM\nSaturdays: Whole-day sessions\nStart of Classes: December 8, 2025\nAdmission Requirements\nApplicants must be 25 years old and above and have completed at least two (2) semesters in college or be a high school graduate (pre-K-12). Second degree seekers are also welcome.\n\nRequired Documents:\nLatest academic records (TOR, Grades, HS Card, or Form 137)\nCertificate of Employment / Business Permit\nPSA Birth Certificate\nTwo (2) pieces of 2x2 ID photos\nLong white folder with plastic cover\nTuition and Fees\nTuition Fee per Trimester:\nFull Payment (Discounted): ₱13,000\nStaggered Payment: ₱15,000 (₱5,000 Down, ₱5,000 Midterm, ₱5,000 Final)\nCourse Equivalency Program/Magisterial Lectures: One-Time Payment: ₱3,000\nOther Fees per Trimester: ₱2,205 (inclusive of registration, library, school publication, athletics, cultural activities, student services, career development, Supreme Student Council, medical/dental, insurance, ID printing and validation, Student Handbook, and the Learning Management System)\nEnrollment Process\nOnline Application: Fill out the form at bit.ly/ExecutiveClassApplicationBatch24\nRequirement Validation & Enrollment: Go to PTC Main Campus from November 5 – Nov 29, 2025\nAdmission Fee: ₱300\nDeadline: November 28, 2025\n\nContinuing/Returning Students: Enrollment onsite from Dec 1–5, 2025\n\nFor Inquiries\nEmail: executiveclass@paterostechnologicalcollege.edu.ph\n\nPATEROS TECHNOLOGICAL COLLEGE: GEARING THE WAY TO YOUR FUTURE!', '2025-10-30 14:09:18');

-- --------------------------------------------------------

--
-- Table structure for table `academic_scholarship`
--

CREATE TABLE `academic_scholarship` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `academic_scholarship`
--

INSERT INTO `academic_scholarship` (`id`, `title`, `content`, `created_at`) VALUES
(3, 'Barangay Scholar', 'Students residing within Pateros (for paying program only)\n\nRequirements:\n\nAccomplished Scholarship Application Form\n2 x 2 ID Picture with Printed Name and Signature\nPersonal essay/ Letter on the reason for seeking for scholarship\nCertification, endorsement\nResidency Verification', '2025-10-30 14:11:34'),
(4, 'Tulong Dunong Program(TDP)', 'Financial Assistance from CHED with collaboration with DSWD\n\nRequirements:\nContinuing Grantees:\n\nCertificate of Registration (COR)\nPhotocopy of school ID\nCertificate of Grades (COG)\nNew Applicants:\n\nTDP Application Form\nSocial Case Study/Cert. of Income Tax Return\nCertificate of Registration (COR)\nCertificate of Grades (COG)\nPhotocopy of school ID', '2025-10-30 14:11:58'),
(5, 'Tertiary Education Subsidy(TES)', 'Financial Assistance from CHED with collaboration with DSWD and belong to 4P\'s.\n\nTES is a grant-in-aid program under RA 10931 or Universal Access to Quality Tertiary Education Act given to qualified students enrolled in CHED-recognized public and private higher education institutions to support at least the partial cost of tertiary education, inclusive of education-related expenses. It also provides access to quality tertiary education in city/town without state or local universities and colleges (SUCs/LUCs).', '2025-10-30 14:14:12');

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`) VALUES
(1, 'Johnted', 'admin2@ptc.edu.ph', '$2b$10$eaDox13FU7WNYZYDxkb0z.KKxEw7hRwzqTKhwOhLoOsWKQrmuAEhK');

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `image_path`, `start_date`, `end_date`, `is_active`, `created_at`) VALUES
(10, '𝗔𝗗𝗩𝗔𝗡𝗖𝗘 𝗬𝗢𝗨𝗥 𝗖𝗔𝗥𝗘𝗘𝗥 𝗢𝗥 𝗕𝗨𝗦𝗜𝗡𝗘𝗦𝗦: 𝗘𝗔𝗥𝗡 𝗔 𝗗𝗘𝗚𝗥𝗘𝗘 𝗪𝗛𝗜𝗟𝗘 𝗬𝗢𝗨 𝗪𝗢𝗥𝗞! 𝗣𝗧𝗖 𝗘𝗫𝗘𝗖𝗨𝗧𝗜𝗩𝗘 𝗖𝗟𝗔𝗦𝗦 (𝗡𝗲𝘄 𝗦𝘁𝘂𝗱𝗲𝗻𝘁𝘀 - 𝗕𝗮𝘁𝗰𝗵 𝟮𝟰)', '𝗔𝗱𝗺𝗶𝘀𝘀𝗶𝗼𝗻𝘀 𝗡𝗼𝘄 𝗢𝗽𝗲𝗻 𝗳𝗼𝗿 𝘁𝗵𝗲 𝗧𝗵𝗶𝗿𝗱 𝗧𝗿𝗶𝗺𝗲𝘀𝘁𝗲𝗿 𝗼𝗳 𝗔𝗰𝗮𝗱𝗲𝗺𝗶𝗰 𝗬𝗲𝗮𝗿 𝟮𝟬𝟮𝟱-𝟮𝟬𝟮𝟲\r\nThe PTC Center for Lifelong Learning welcomes all employed individuals and entrepreneurs who wish to pursue higher education and finally claim the degree they’ve worked hard for!\r\nThis is a program designed for 𝘄𝗼𝗿𝗸𝗶𝗻𝗴 𝗽𝗿𝗼𝗳𝗲𝘀𝘀𝗶𝗼𝗻𝗮𝗹𝘀 𝗮𝗻𝗱 𝗲𝗻𝘁𝗿𝗲𝗽𝗿𝗲𝗻𝗲𝘂𝗿𝘀 seeking to enhance their knowledge and qualifications without compromising their career or business.\r\n𝙒𝙝𝙮 𝘾𝙝𝙤𝙤𝙨𝙚 𝙋𝙏𝘾 𝙀𝙭𝙚𝙘𝙪𝙩𝙞𝙫𝙚 𝘾𝙡𝙖𝙨𝙨?\r\n/ Flexible modular trimester classes tailored to fit your schedule\r\n/ Ideal for private and government employees or business owners\r\n/ Practical and career-focused learning to achieve your professional goals\r\n/ Cheapest program fees in the metro\r\n𝗣𝗿𝗼𝗴𝗿𝗮𝗺𝘀 𝗢𝗳𝗳𝗲𝗿𝗲𝗱:\r\n/ Bachelor of Science in Office Administration (BSOA)\r\n/ Bachelor of Science in Information Technology (BSIT)\r\n𝙆𝙚𝙮 𝘿𝙖𝙩𝙚𝙨:\r\n/ Onsite Enrollment: November 5 - November 29, 2025\r\n/ Start of Classes: December 8, 2025', '/uploads/1762801045227_executiveclass.jpg', '2025-11-04', '2025-11-28', 1, '2025-11-05 14:28:14'),
(11, 'HAPPENING NOW', '\nThe Junior Philippine Computer Society (JPCS) conducts Day 1 of its Membership Drive for IICT students, CCS 1st Year and BSIT 1st Year, today, October 28, 2025, from 9:00 AM to 4:00 PM at the Pateros Technological College - Main Campus, Social Hall.\nThe event highlights the organization’s commitment to nurturing student involvement and fostering a community of future IT professionals driven by excellence, innovation, and collaboration.', NULL, '2025-10-28', '2025-10-28', 0, '2025-11-06 02:48:29'),
(13, '𝗝𝗨𝗦𝗧 𝗜𝗡 | 𝑩𝑹𝑶𝑵𝒁𝑬 𝑺𝑬𝑪𝑼𝑹𝑬𝑫! 𝑷𝑻𝑪 𝑻𝑬𝑪𝑯𝑫𝑼𝑪𝑲𝑺 𝑫𝑶𝑴𝑰𝑵𝑨𝑻𝑬 2-0🥉', 'The PTC Tech Ducks claim a commanding 2-0 victory over Kolehiyo ng Lungsod ng Lipa, securing the Bronze Medal at the City College of San Jose del Monte.\r\nWith teamwork, determination, and the heart of true champions, the Tech Ducks proudly bring honor to Pateros Technological College!', '/uploads/1762800945249_ptcplumage.jpg', '2025-10-21', '2025-11-08', 1, '2025-11-10 18:32:17'),
(14, '𝙋𝙚𝙧𝙨𝙚𝙫𝙚𝙧𝙖𝙣𝙘𝙚 𝙖𝙣𝙙 𝘿𝙚𝙩𝙚𝙧𝙢𝙞𝙣𝙖𝙩𝙞𝙤𝙣, 𝙬𝙝𝙚𝙧𝙚 𝙙𝙧𝙚𝙖𝙢𝙨 𝙩𝙪𝙧𝙣 𝙞𝙣𝙩𝙤 𝙨𝙪𝙘𝙘𝙚𝙨𝙨.✨ Balancing motherhood, career, and education is no easy feat—but for 𝘔𝘴. 𝘈𝘯𝘢𝘳𝘰𝘴𝘦 𝘊. 𝘚𝘢𝘯 𝘑𝘰𝘴𝘦, 𝘌𝘯𝘗, 𝘔𝘔𝘌𝘗, her journey proves that age and challenges are never barriers to achieving greatness. ', '\r\nBalancing motherhood, career, and education is no easy feat—but for 𝘔𝘴. 𝘈𝘯𝘢𝘳𝘰𝘴𝘦 𝘊. 𝘚𝘢𝘯 𝘑𝘰𝘴𝘦, 𝘌𝘯𝘗, 𝘔𝘔𝘌𝘗, her journey proves that age and challenges are never barriers to achieving greatness. From earning her Bachelor of Science in Office Administration (Executive Class) to completing her master’s degree and passing the Licensure Examination for Environmental Planning, her story radiates resilience and courage.\r\nNow serving as Senior Administrative Assistant at LGU Pateros – MPDO, she stands as a proud BSOA Executive Class Batch 1 graduate—embodying the spirit of lifelong learning and success.\r\nLet her story inspire you to rise above limitations and pursue your dreams with passion and purpose.\r\n𝗕𝗲𝗰𝗼𝗺𝗲 𝗮 𝗳𝘂𝘁𝘂𝗿𝗲-𝗿𝗲𝗮𝗱𝘆 𝗹𝗲𝗮𝗱𝗲𝗿. 𝗕𝗲𝗰𝗼𝗺𝗲 𝗮 𝗣𝗧𝗖 𝗘𝘅𝗲𝗰𝘂𝘁𝗶𝘃𝗲 𝗖𝗹𝗮𝘀𝘀 𝗚𝗿𝗮𝗱𝘂𝗮𝘁𝗲.', '/uploads/1763015239050_determination.jpg', '2025-11-13', '2025-12-09', 1, '2025-11-13 06:27:19'),
(15, '𝐇𝐀𝐏𝐏𝐄𝐍𝐈𝐍𝐆 𝐍𝐎𝐖: 𝐁𝐀𝐓𝐓𝐋𝐄 𝐅𝐎𝐑 𝐁𝐑𝐎𝐍𝐙𝐄 𝐌𝐄𝐃𝐀𝐋 ', '𝐇𝐀𝐏𝐏𝐄𝐍𝐈𝐍𝐆 𝐍𝐎𝐖: 𝐁𝐀𝐓𝐓𝐋𝐄 𝐅𝐎𝐑 𝐁𝐑𝐎𝐍𝐙𝐄 𝐌𝐄𝐃𝐀𝐋 \r\nThe PTC Tech Ducks are now set to face Kolehiyo ng Lungsod ng Lipa (KLL) in the Battle for Third at the City College of San Jose del Monte.\r\nFueled by determination and pride, the team aims to finish strong and bring home the bronze medal for Pateros Technological College. Every match continues to showcase the Fighting Ducks’ skill, unity, and unbreakable spirit.\r\n𝑳𝒆𝒕’𝒔 𝒈𝒐, 𝑻𝒆𝒄𝒉 𝑫𝒖𝒄𝒌𝒔!\r\nCaption: The Plumage \r\nPhotos: PTC Image', '/uploads/1763015406357_lcuaa.jpg', '2025-10-24', '2025-11-20', 1, '2025-11-13 06:30:06');

-- --------------------------------------------------------

--
-- Table structure for table `campuses`
--

CREATE TABLE `campuses` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `campuses`
--

INSERT INTO `campuses` (`id`, `name`, `address`) VALUES
(1, 'PTC Main Campus', 'Pateros'),
(2, 'PTC San Pedro Campus', 'Pateros'),
(3, 'ITRED Campus', 'Pateros'),
(4, 'Main Campus', '');

-- --------------------------------------------------------

--
-- Table structure for table `maps`
--

CREATE TABLE `maps` (
  `id` int(11) NOT NULL,
  `campus_id` int(11) DEFAULT NULL,
  `campus_name` varchar(100) DEFAULT NULL,
  `image_path` varchar(512) DEFAULT NULL,
  `embed_html` text DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maps`
--

INSERT INTO `maps` (`id`, `campus_id`, `campus_name`, `image_path`, `embed_html`, `description`, `address`, `created_at`) VALUES
(2, 1, 'PTC Main Campus', '/uploads/1761884561686.png', NULL, 'Pateros Technological College', '205 College St, Pateros', '2025-10-31 12:22:41'),
(3, 2, 'PTC San Pedro Campus', NULL, '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.0000000000005!2d121.075!3d14.566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0000000000000000!2sPTC%20San%20Pedro%20Campus" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>', 'PTC San Pedro Campus - embedded map', 'San Pedro, Pateros', NOW()),
(4, 3, 'ITRED Campus', NULL, '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.0000000000005!2d121.05!3d14.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0000000000000000!2sITRED%20Campus" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>', 'ITRED Campus - embedded map', 'ITRED area, Pateros', NOW());

-- --------------------------------------------------------

--
-- Table structure for table `offices`
--

CREATE TABLE `offices` (
  `id` int(11) NOT NULL,
  `campus_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `office_hours` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `offices`
--

INSERT INTO `offices` (`id`, `campus_id`, `name`, `description`, `office_hours`, `created_at`) VALUES
(1, 1, 'Registrar Office', 'Student records, enrollment, transcripts', 'Mon-Fri 8:00 AM - 5:00 PM', '2025-10-08 02:54:58'),
(2, 3, 'FOR RENOVATION', 'FOR RENOVATION', 'FOR RENOVATION', '2025-10-17 10:46:15'),
(3, 2, 'FOR RENOVATION', 'FOR RENOVATION', 'FOR RENOVATION', '2025-11-05 15:42:40'),
(5, 1, 'FACULTY', 'ASDaSDaSD', '9:00AM to 5:00PM', '2025-11-05 15:46:34');

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT '',
  `logo_path` varchar(255) DEFAULT '',
  `background_path` varchar(255) DEFAULT '',
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about`
--
ALTER TABLE `about`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `academic`
--
ALTER TABLE `academic`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `academic_programs`
--
ALTER TABLE `academic_programs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `academic_requirements`
--
ALTER TABLE `academic_requirements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `academic_scholarship`
--
ALTER TABLE `academic_scholarship`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `campuses`
--
ALTER TABLE `campuses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `maps`
--
ALTER TABLE `maps`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offices`
--
ALTER TABLE `offices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `campus_id` (`campus_id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `academic`
--
ALTER TABLE `academic`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `academic_programs`
--
ALTER TABLE `academic_programs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `academic_requirements`
--
ALTER TABLE `academic_requirements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `academic_scholarship`
--
ALTER TABLE `academic_scholarship`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `campuses`
--
ALTER TABLE `campuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `maps`
--
ALTER TABLE `maps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `offices`
--
ALTER TABLE `offices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `offices`
--
ALTER TABLE `offices`
  ADD CONSTRAINT `offices_ibfk_1` FOREIGN KEY (`campus_id`) REFERENCES `campuses` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
