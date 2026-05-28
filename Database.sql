-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: avtozvuk_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (30,'guest_1779882697033',1,1);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `items` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status_contacted` tinyint DEFAULT '0',
  `status_shipped` tinyint DEFAULT '0',
  `lastname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `crm_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (15,'Артем','+380977101080','м.Вінниця НП16\n','[{\"product_id\":2,\"quantity\":1,\"title\":\"Магнітола KODIAQ Skoda YETI Кодіак KAMIQ Камік Scala CarPlay Андроїд 16\",\"price\":7970}]',7970.00,'2026-05-28 08:25:06',0,0,'Череватов','guest_1779886505219',1,'ORD-2026-15');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'magnitola',
  `gallery` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Дисплей BMW 3 5 7 Z4 e60 e65 e61 e62 e63 е60 е64 e90 e66 e89 Android 16',10970,'images_title/bmw/bmw1.webp','<p><strong>Зверніть, будь ласка, увагу:</strong> вартість в оголошенні вказана за штатний головний пристрій із мінімальними параметрами.</p>\n\n<p>Для отримання вартості відповідних параметрів та сумісності обладнання із оригінальною комплектацією САМЕ Вашого автомобіля телефонуйте на мобільний (є Viber) або пишіть повідомлення.</p>\n\n<p style=\"color: #3b82f6; font-size: 18px;\"><strong>ТЕХНІЧНА підтримка БЕЗ вихідних !!!</strong></p>\n\n<p>? <strong>Відеоогляди дивіться тут:</strong> <a href=\"https://youtube.com/c/Avtozvukzt\" target=\"_blank\" style=\"color: #3b82f6;\">Avtozvukzt на YouTube</a></p>\n\n<hr style=\"border: 0; border-top: 1px solid #444; margin: 20px 0;\">\n\n<h3>? Для кожного НЕ акційного монітора у ПОДАРУНОК:</h3>\n<ul style=\"line-height: 1.6; margin-bottom: 20px;\">\n    <li><strong>ВІДЕОКАМЕРА</strong> з проекцією паркувальних ліній різного кольору або роз\'єм для підключення оригінальної камери;</li>\n    <li>Встановлення ВАЖЛИВИХ додатків: SPEED-camera, GPS, CarPlay, ADAS, TPMS, TIMA, DVR, RADIO-internet, TORQUE Professional;</li>\n    <li>Сканер Bluetooth адаптер ОВD ll ELM 327;</li>\n    <li>Встановлення ШЕСТИ різних навігаційних програм (КАРТИ України, Європи та Азії);</li>\n    <li>Зовнішній <strong>МІКРОФОН</strong> для покращення передачі голосу;</li>\n    <li>ІНСТРУМЕНТ для безпечного монтажу магнітоли;</li>\n    <li>ОНОВЛЕННЯ всіх програм та додатків до останніх версій;</li>\n    <li><strong>4G антена та GSM Sim МОДЕМ</strong> (роздача інтернету пасажирам);</li>\n    <li>Canbus-адаптер;</li>\n    <li><strong>25% знижка</strong> на відеокамеру-реєстратор для прихованої зйомки Full HD dvr ADAS;</li>\n    <li><strong>25% знижка</strong> на комплект внутрішніх датчиків тиску та температури шин (TPMS);</li>\n    <li>Післягарантійна підтримка!</li>\n</ul>\n\n<h3>? Демонстрація та встановлення</h3>\n<p>Демонстрацію роботи магнітол можливо побачити в містах: <strong>Житомир, Вінниця, Рівне, Київ</strong>. Працює відправка за кордон!</p>\n<p>Допоможемо з підключенням нашого обладнання – майже всі наші клієнти встановлюють САМОСТІЙНО! Тільки ВИСОКА якість обладнання та професійний підхід!</p>\n\n<hr style=\"border: 0; border-top: 1px solid #444; margin: 20px 0;\">\n\n<h3>? Сумісність та збереження оригінальних функцій BMW</h3>\n<p>При заміні дисплея АБСОЛЮТНО ВСІ оригінальні опції BMW залишаються <strong>БЕЗ ЗМІН</strong>: управління оригінальними налаштуваннями, штатна мультимедія, підсилювач Hi-Fi, преміум підсилювач Harman Kardon Premium Logic 7®, кнопки на кермі, джойстик, задня відеокамера, парктроніки, система кругового огляду тощо. Змінюється ТІЛЬКИ дисплей!</p>\n\n<p><strong>Дисплей має ТРИ режими роботи:</strong></p>\n<ol style=\"line-height: 1.6; margin-bottom: 20px;\">\n    <li>Оригінальне меню автомобіля з можливістю зміни роздільної здатності.</li>\n    <li>Android із можливістю зміни інтерфейса на свій смак, а також бездротовий AndroidAVTO.</li>\n    <li>iOS - через бездротовий або дротовий CarPlay.</li>\n</ol>\n<p><em>Оригінальний джойстик працює у всіх трьох режимах дисплея!</em></p>\n\n<hr style=\"border: 0; border-top: 1px solid #444; margin: 20px 0;\">\n\n<h3>⚙️ Основні технічні характеристики</h3>\n<ul style=\"line-height: 1.6; margin-bottom: 20px;\">\n    <li><strong>Операційна система:</strong> Google Android 16</li>\n    <li><strong>Екран:</strong> 10.33 / 12.33 / 12.5\" ємнісний сенсорний екран, матриця Ultra QLED останнього покоління, роздільна здатність 1920x720, антиблікове покриття Blue Ray.</li>\n    <li><strong>Процесор (CPU):</strong> Intel UNISOC 7862(s) - 2.0 GHz, (SNAPDRAGON QUALCOMM) 8 core 64 bit.</li>\n    <li><strong>Пам\'ять:</strong> Оперативна DDR3 Samsung до 8 Gb, вбудована до 256 Gb.</li>\n    <li><strong>Звук:</strong> Окремий DSP процесор, audiochip МOSFET, коаксіальний вихід, лінійний вихід на підсилювач та Subwoofer.</li>\n    <li><strong>Мережа:</strong> Wi-Fi 5 GHz, Bluetooth 5.0 (два модуля), підтримка 4G GSM internet.</li>\n    <li><strong>Функціонал:</strong> Бездротовий CarPlay / AndroidAuto, CarLink, розділення екрана (Dual Zone), ГОЛОСОВИЙ пошук.</li>\n    <li><strong>Навігація:</strong> GPS / BDS / GLONASS (WAZE, HERE, IGO, Navitel, Sygic, Google Map).</li>\n    <li><strong>Інтеграція:</strong> Підключення \"pin-to-pin\" (штатні роз\'єми), підтримка CAN-шини, бортового комп\'ютера, OBD2, динамічних ліній руля та кнопок.</li>\n</ul>\n\n<p>Відправте, будь ласка, фото торпедо (центральної консолі) Вашого автомобіля на наш Viber та очікуйте відповідь із нашими пропозиціями та відеооглядами!</p>\n\n<div style=\"font-size: 12px; color: #666; margin-top: 40px; text-align: justify;\">\n    <p><strong>Підтримувані моделі:</strong> X1 X2 X3 X4 X5 X6 X7 E38 E39 E46 E53 E60 E61 E62 E63 E65 E66 E70 E71 E81 E82 E87 E88 E83 E84 E89 E90 E91 E92 E93 F01 F02 F06 F12 F13 F07 F10 F11 F15 F16 F20 F22 F23 F25 F26 F30 F31 F32 F33 F34 F39 F45 F46 F87 F47 F48 F49 G01 G02 G30 G31 G38 G42 G90 Z2 Z3 Z4 Z5 Z6 Z7 Z8 CCC CIC NBT EVO IDRIVE магнітола двд dvd cd радіо андроїд монітор дисплей мультимедія музика аукс aux навігація телебачення тв.</p>\n</div>','magnitola','\"gallery/bmw\"'),(2,'Магнітола KODIAQ Skoda YETI Кодіак KAMIQ Камік Scala CarPlay Андроїд 16',7970,'images_title/skoda/skoda1.webp','<div style=\"color: #ccc; font-family: sans-serif; line-height: 1.6;\">\n    <p><strong>Зверніть, будь ласка, увагу:</strong> вартість в оголошенні вказана за штатний головний пристрій із мінімальними параметрами, перехідною рамкою та модельним силовим дротом.</p>\n    \n    <p>Для отримання вартості відповідних параметрів та сумісності обладнання із оригінальною комплектацією САМЕ Вашого автомобіля — <strong>телефонуйте або пишіть у Viber / OLX</strong>.</p>\n    \n    <h3 style=\"color: #3b82f6;\">? Розпродаж 2026 вже розпочався!</h3>\n    <p style=\"color: #4ade80;\"><strong>ТЕХНІЧНА підтримка БЕЗ вихідних!</strong></p>\n\n    <h3 style=\"border-bottom: 1px solid #444; padding-bottom: 10px;\">? Подарунки до кожної НЕ акційної магнітоли:</h3>\n    <ul>\n        <li><strong>ВІДЕОКАМЕРА</strong> з проекцією ліній або роз\'єм для штатної камери;</li>\n        <li>Встановлення додатків: GPS, CarPlay, ADAS, TPMS, DVR, TORQUE та ін.;</li>\n        <li>Сканер <strong>OBD II ELM327</strong>;</li>\n        <li>Встановлення 6 навігаційних програм + карти України, Європи та Азії;</li>\n        <li>Зовнішній мікрофон, інструмент для монтажу, 4G антена;</li>\n        <li><strong>4G GSM Sim-модем</strong> для роздачі інтернету;</li>\n        <li><strong>Знижки 25%</strong> на відеореєстратор, датчики тиску шин (TPMS) та кнопку Start/Stop.</li>\n    </ul>\n\n    <h3 style=\"border-bottom: 1px solid #444; padding-bottom: 10px;\">⚙️ Технічні характеристики (Android 16):</h3>\n    <ul>\n        <li><strong>Екран:</strong> 9.5\" або 10.36\" 2K (2000х1200), Ultra QLED, Gorilla Glass;</li>\n        <li><strong>Процесор:</strong> Intel UIS7862(s) (8 ядер, 2.0 GHz);</li>\n        <li><strong>Пам\'ять:</strong> 8 Gb RAM (DDR3 Samsung) / 128 Gb ROM;</li>\n        <li><strong>Звук:</strong> DSP процесор, підсилювач 4х50W (TDA7851 MOSFET), оптичний та коаксіальний виходи;</li>\n        <li><strong>Зв\'язок:</strong> Wi-Fi 5 GHz, Bluetooth 5.0, 4G (підтримка двох SIM-карт);</li>\n        <li><strong>Інтерфейси:</strong> Бездротовий CarPlay / AndroidAuto, 3 USB-порти, підтримка 4K;</li>\n        <li><strong>Підтримка авто:</strong> Кнопки руля, бортовий комп\'ютер, парктроніки, круговий огляд, джойстики, клімат-контроль;</li>\n        <li><strong>Старт:</strong> Швидкий запуск системи за 1 секунду.</li>\n    </ul>\n\n    <h3 style=\"border-bottom: 1px solid #444; padding-bottom: 10px;\">? Встановлення та підтримка:</h3>\n    <p>Демонстрація роботи в містах: <strong>Житомир, Вінниця, Рівне, Київ</strong>. Допомагаємо з підключенням \"pin-to-pin\" — більшість клієнтів встановлюють самостійно! Працює відправка за кордон.</p>\n    \n    <p style=\"background: #26262b; padding: 15px; border-radius: 8px;\">\n        ? <strong>Як замовити?</strong> Відправте фото торпедо (центральної консолі) Вашого автомобіля нам у Viber, і ми підберемо найкращий варіант із відеооглядами!\n    </p>\n\n    <p style=\"font-size: 12px; color: #777; margin-top: 20px;\">\n        *Наші фото та відео відповідають реальним магнітолам. Будьте уважні: не маємо інших облікових записів на OLX. Допоможемо заощадити на доставці!*\n    </p>\n</div>','magnitola','\"gallery/skoda\"'),(3,'Магнітола RAV4 Toyota RAV 4 RAV-4 GPS USB Тойота Рав 4 CarPlay Андроїд',7970,'images_title/toyota/toyota1.webp','<div style=\"font-family: sans-serif; line-height: 1.6; color: #ccc;\">\n    <p style=\"background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; color: #eee;\">\n        <strong>Важлива інформація:</strong> Вартість в оголошенні вказана за штатний головний пристрій із мінімальними параметрами, перехідною рамкою та модельним силовим дротом. Для розрахунку вартості під комплектацію ВАШОГО авто — телефонуйте або пишіть у <strong>Viber / OLX</strong>.\n    </p>\n    \n    <p style=\"background: rgba(59, 130, 246, 0.15); padding: 10px; border-radius: 5px; color: #fff;\">\n        <strong>ТЕХНІЧНА підтримка БЕЗ вихідних!</strong> Відеоогляди: <a href=\"https://youtube.com/c/Avtozvukzt\" style=\"color: #3b82f6;\">наш YouTube</a>\n    </p>\n\n    <h3 style=\"color: #f87171;\">? РОЗПРОДАЖ 2026 ВЖЕ РОЗПОЧАВСЯ!</h3>\n\n    <h4 style=\"color: #fff;\">? Подарунки до кожної НЕ акційної магнітоли:</h4>\n    <ul style=\"padding-left: 20px; color: #bbb;\">\n        <li>Відеокамера з паркувальними лініями (або роз\'єм для штатної);</li>\n        <li>Встановлення додатків: GPS, CarPlay, ADAS, TPMS, DVR, TORQUE та ін.;</li>\n        <li>Сканер OBD II ELM327;</li>\n        <li>6 навігаційних програм + карти України, Європи та Азії;</li>\n        <li>4G антена + зовнішній 4G GSM Sim-модем;</li>\n        <li>Комплект монтажного інструменту + зовнішній мікрофон;</li>\n        <li>Знижки -25% на відеореєстратор ADAS, датчики TPMS та кнопку Start/Stop.</li>\n    </ul>\n\n    <h3 style=\"color: #60a5fa;\">? Технічні характеристики (Android 16):</h3>\n    <table style=\"width: 100%; border-collapse: collapse; border: 1px solid #444;\">\n        <tr style=\"background: rgba(255, 255, 255, 0.05);\">\n            <td style=\"padding: 8px; border: 1px solid #444;\"><strong>Екран</strong></td>\n            <td style=\"padding: 8px; border: 1px solid #444; color: #fff;\">9.5\" / 10.36\" QLED, 2К, Gorilla Glass</td>\n        </tr>\n        <tr>\n            <td style=\"padding: 8px; border: 1px solid #444;\"><strong>Процесор</strong></td>\n            <td style=\"padding: 8px; border: 1px solid #444; color: #fff;\">Intel UIS7862(s) (8 ядер, 2.0 GHz)</td>\n        </tr>\n        <tr style=\"background: rgba(255, 255, 255, 0.05);\">\n            <td style=\"padding: 8px; border: 1px solid #444;\"><strong>Пам\'ять</strong></td>\n            <td style=\"padding: 8px; border: 1px solid #444; color: #fff;\">8 Gb RAM / 128 Gb ROM</td>\n        </tr>\n        <tr>\n            <td style=\"padding: 8px; border: 1px solid #444;\"><strong>Звук</strong></td>\n            <td style=\"padding: 8px; border: 1px solid #444; color: #fff;\">DSP процесор, підсилювач 4х50W (TDA7851)</td>\n        </tr>\n    </table>\n\n    <h4 style=\"color: #fff;\">Основні функції:</h4>\n    <ul style=\"padding-left: 20px; color: #bbb;\">\n        <li><strong>Зв\'язок:</strong> Wi-Fi 5 GHz, Bluetooth 5.0, 4G (дві SIM-карти);</li>\n        <li><strong>Мультимедіа:</strong> Бездротовий CarPlay / AndroidAuto, підтримка 4K;</li>\n        <li><strong>Авто-можливості:</strong> ADAS, підтримка штатних кнопок руля, парктроніків;</li>\n        <li><strong>Підключення:</strong> \"pin-to-pin\", запуск системи за 1 секунду.</li>\n    </ul>\n\n    <h3 style=\"color: #60a5fa;\">? Чому обирають нас?</h3>\n    <p style=\"color: #bbb;\">Демонстрація роботи в містах: <strong>Житомир, Вінниця, Рівне, Київ</strong>. Допомагаємо з установкою — більшість клієнтів роблять це самостійно!</p>\n\n    <p style=\"font-weight: bold; color: #f87171;\">Як замовити? Надішліть фото центральної консолі (торпедо) вашого авто у Viber, і ми підберемо найкращий варіант!</p>\n    \n    <p style=\"font-size: 12px; color: #777; margin-top: 20px;\">\n        *Ми продаємо тільки власні пристрої. Будьте уважні: не маємо інших акаунтів на OLX. Допоможемо заощадити на доставці!*\n    </p>\n</div>','magnitola','\"gallery/toyota\"'),(4,'Магнітола TOUAREG Volkswagen VW T5 Multivan Тоуарег CarPlay Андроїд 16',7970,'images_title/volkswagen/volkswagen1.webp','<div style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #ccc; max-width: 800px;\">\n    \n    <p style=\"background: rgba(255, 193, 7, 0.1); padding: 15px; border-radius: 8px; border-left: 5px solid #ffc107; color: #eee;\">\n        <strong>Важлива інформація:</strong> Вартість в оголошенні вказана за штатний головний пристрій із мінімальними параметрами, перехідною рамкою та модельним силовим дротом. Для розрахунку вартості під комплектацію ВАШОГО авто — телефонуйте або пишіть у <strong>Viber / OLX</strong>.\n    </p>\n\n    <p style=\"background: rgba(59, 130, 246, 0.15); padding: 15px; border-radius: 8px; color: #fff;\">\n        <strong>ТЕХНІЧНА підтримка БЕЗ вихідних!</strong><br>\n        Відеоогляди: <a href=\"https://youtube.com/c/Avtozvukzt\" target=\"_blank\" style=\"color: #60a5fa;\">Наш YouTube канал</a>\n    </p>\n\n    <h3 style=\"color: #f87171;\">? РОЗПРОДАЖ 2026 ВЖЕ РОЗПОЧАВСЯ!</h3>\n\n    <h4 style=\"color: #fff;\">? Подарунки до кожної НЕ акційної магнітоли:</h4>\n    <ul style=\"padding-left: 20px; color: #bbb;\">\n        <li>Відеокамера з паркувальними лініями (або роз\'єм для штатної камери);</li>\n        <li>Встановлення додатків: GPS, CarPlay, ADAS, TPMS, DVR, TORQUE, RADIO-internet та ін.;</li>\n        <li>Сканер OBD II ELM327;</li>\n        <li>Встановлення 6 навігаційних програм + карти України, Європи та Азії;</li>\n        <li>4G антена + зовнішній 4G GSM Sim-модем (роздача інтернету пасажирам);</li>\n        <li>Зовнішній мікрофон, інструмент для безпечного монтажу;</li>\n        <li>Знижки -25% на відеореєстратор ADAS, датчики TPMS та кнопку Start/Stop.</li>\n    </ul>\n\n    <h3 style=\"color: #60a5fa;\">? Технічні характеристики (Android 15):</h3>\n    <table style=\"width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #444;\">\n        <tr style=\"background: rgba(255, 255, 255, 0.05);\">\n            <td style=\"padding: 10px; border: 1px solid #444;\"><strong>Екран</strong></td>\n            <td style=\"padding: 10px; border: 1px solid #444; color: #fff;\">9.5\" / 10.36\" QLED, 2К (2000х1200), Gorilla Glass</td>\n        </tr>\n        <tr>\n            <td style=\"padding: 10px; border: 1px solid #444;\"><strong>Процесор</strong></td>\n            <td style=\"padding: 10px; border: 1px solid #444; color: #fff;\">Intel UIS7862(s) (8 ядер, 2.0 GHz)</td>\n        </tr>\n        <tr style=\"background: rgba(255, 255, 255, 0.05);\">\n            <td style=\"padding: 10px; border: 1px solid #444;\"><strong>Пам\'ять</strong></td>\n            <td style=\"padding: 10px; border: 1px solid #444; color: #fff;\">8 Gb RAM (DDR3) / 128 Gb ROM</td>\n        </tr>\n        <tr>\n            <td style=\"padding: 10px; border: 1px solid #444;\"><strong>Звук</strong></td>\n            <td style=\"padding: 10px; border: 1px solid #444; color: #fff;\">DSP процесор, підсилювач 4х50W (TDA7851)</td>\n        </tr>\n    </table>\n\n    <h4 style=\"color: #fff;\">Основні функції та переваги:</h4>\n    <ul style=\"padding-left: 20px; color: #bbb;\">\n        <li><strong>Зв\'язок:</strong> Wi-Fi 5 GHz, Bluetooth 5.0 (два модуля), 4G (дві SIM-карти);</li>\n        <li><strong>Мультимедіа:</strong> Бездротовий CarPlay / AndroidAuto, розділення екрана на два додатки;</li>\n        <li><strong>Безпека:</strong> ADAS (попередження про зближення), підтримка до 3-х відеокамер, 3D-огляд;</li>\n        <li><strong>Інтеграція:</strong> Робота зі штатними кнопками руля, парктроніками, клімат-контролем, бортовим комп\'ютером;</li>\n        <li><strong>Підключення:</strong> \"pin-to-pin\" (без пошкодження штатної проводки), запуск системи за 1 секунду.</li>\n    </ul>\n\n    <h3 style=\"color: #60a5fa;\">? Встановлення та підтримка:</h3>\n    <p style=\"color: #bbb;\">Демонстрація роботи в містах: <strong>Житомир, Вінниця, Рівне, Київ</strong>.<br>\n    Надаємо підтримку для самостійного підключення — <strong>майже всі наші клієнти встановлюють обладнання самостійно!</strong></p>\n    \n    <p style=\"font-weight: bold; font-size: 18px; color: #f87171;\">\n        ? Як замовити? Надішліть фото центральної консолі (торпедо) вашого авто у Viber, і ми підберемо найкращий варіант із відеооглядами!\n    </p>\n    \n    <p style=\"font-size: 12px; color: #777; margin-top: 20px;\">\n        *Наші фото та відео відповідають нашим магнітолам. Будьте уважні: не маємо інших облікових записів на OLX. Допоможемо заощадити на доставці!*\n    </p>\n</div>','magnitola','\"gallery/volkswagen\"'),(5,'Видеокамера Стоп сигнал Chevrolet EXPRESS GMC SAVANA Lacetti Captiva',790,'images_title/camera/camera1.webp','<div style=\"color: #ccc; font-family: sans-serif; line-height: 1.6;\">\n    <p><strong>Переваги нашої камери у порівнянні зі звичайною світлодіодною камерою-плафоном:</strong></p>\n    <ul>\n        <li>Відсутність помилок на приладовій панелі;</li>\n        <li>Відсутність необхідності заміни другого плафона освітлення;</li>\n        <li>Збереження оригінального освітлення;</li>\n        <li>Мінімальна тінь від камери;</li>\n        <li>Максимально наближене розташування до центру авто.</li>\n    </ul>\n\n    <h3 style=\"color: #3b82f6;\">? Варіанти комплектації:</h3>\n    <ul style=\"list-style: none; padding: 0;\">\n        <li><strong>Варіант 1:</strong> Камера з 4-ма діодами та статичними лініями — <strong>790 грн.</strong></li>\n        <li><strong>Варіант 2:</strong> Камера з 8-ма діодами та статичними лініями — <strong>880 грн.</strong></li>\n        <li><strong>Варіант 3 (процесорна):</strong> Камера з 8-ма діодами та <strong>ДИНАМІЧНИМИ</strong> паркувальними лініями — <strong>1290 грн.</strong></li>\n    </ul>\n\n    <p style=\"background: #26262b; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;\">\n        ⚠️ <strong>УВАГА:</strong> Перед оформленням замовлення ОБОВ\'ЯЗКОВО порівняйте розміри нашого плафона з Вашим оригінальним!\n    </p>\n\n    <h3 style=\"color: #3b82f6;\">? Технічні параметри:</h3>\n    \n    <p><strong>Camera A (82 мм x 30 мм):</strong><br>\n    Підходить для: Cadillac (CTS, XTS, SRX), Roewe (RX5, 950, 360), Chevrolet (Lova RV, Trax, Aveo, Malibu, Cruze Hatchback), Buick (GL8, Envision, Encore, Excelle, LaCrosse, Verano) та інших.</p>\n\n    <p><strong>Camera B (99 мм x 30 мм, між гвинтами 75 мм):</strong><br>\n    Підходить для: Chevrolet (Cruze, Sail, Captiva, Epica, Lova, Aveo, Lacetti, Matis, HHR, Orlando, Takuma) та багатьох інших моделей.</p>\n\n    <h3 style=\"color: #3b82f6;\">⚙️ Технічні характеристики:</h3>\n    <ul>\n        <li><strong>Сенсор:</strong> 1090K Color CCD 1/3\'\'</li>\n        <li><strong>Роздільна здатність:</strong> 728 (H) x 582 (V), 520 TV ліній</li>\n        <li><strong>Кут огляду:</strong> 170 градусів</li>\n        <li><strong>Живлення:</strong> 12 В DC</li>\n        <li><strong>Нічне бачення:</strong> Мін. освітленість 0.01 lux</li>\n        <li><strong>Система:</strong> NTSC, паркувальна розмітка</li>\n    </ul>\n\n    <h3 style=\"color: #3b82f6;\">? Комплектація:</h3>\n    <ul>\n        <li>1 х CCD автомобільна камера заднього виду;</li>\n        <li>1 х відеокабель (6 метрів);</li>\n        <li>1 х кабель живлення.</li>\n    </ul>\n\n    <p style=\"font-size: 14px; margin-top: 20px;\">\n        <strong>Важливо:</strong> Оскільки одна й та сама модель автомобіля в різних країнах може мати відмінності, будь ласка, уважно перевірте розміри та зовнішній вигляд Вашого плафона перед замовленням, щоб уникнути помилок.<br><br>\n        <em>У наявності великий вибір відеокамер та штатних магнітол для будь-яких авто. Під замовлення — будь-яка магнітола! Дивіться інші наші оголошення.</em>\n    </p>\n</div>','camera','\"gallery/camera\"');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_admin` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Артем','Череватов','+380 977101080','302006gryden@gmail.com','$2b$10$vaepG.CEooxx0l9Tacw1yeYdZfPl5ng8qQYHXvY2au8eiL7wClSky',1),(2,'Владислав','Чебурек','+380 97586496','cheburek@gmail.com','$2b$10$QRf9afU/SwpvsKzt8pOOeOcGhfv4CVyfKPcMoIFp2KkA98L6yB.8q',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-28 12:45:29
