# 🔗 Waesta Discord Vanity URL Snipper

> **Author:** waesta.js | **Platform:** Node.js (Discord.js)

## 🇬🇧 English

### Overview
Waesta Vanity URL Snipper is a professional Discord bot engine designed for Level 3 boosted servers. It repeatedly attempts to claim a custom vanity URL (`discord.gg/yourcode`) with rate-limit awareness, permission validation, and a polished embed-based command interface.

### ✨ Key Features
- **Embed Command UI:** All responses use branded Discord embeds — no plain text spam.
- **Modular Architecture:** Core logic split across `lib/VanitySniper.js`, `lib/embeds.js`, and `lib/waesta.js`.
- **Rate Limit Engine:** Automatically backs off on HTTP 429 with retry-after support.
- **Live Status Panel:** `.status` command shows attempts, rate limits, uptime, and last error.
- **Permission Guard:** Requires Manage Server permission and VANITY_URL server feature.
- **Activity Status:** Bot displays `.help | waesta.js` as its watching status.

### 🔒 Anti-Tamper Security
Incorporates the Waesta cryptographic integrity check. Altering the author signature causes an immediate fatal exit on startup, protecting the codebase from unauthorized modification.

### 📁 Project Structure
```
12_Waesta_Discord_Vanity_URL_Snipper/
├── bot.js                 Entry point & command router
├── config.json            Bot token & settings
├── lib/
│   ├── waesta.js          Logger + anti-tamper
│   ├── embeds.js          Branded embed builders
│   └── VanitySniper.js    Core snipe engine
└── package.json
```

### 🛠️ Installation & Usage
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set your bot token in `config.json`.
3. Enable **Message Content Intent** in the Discord Developer Portal.
4. Run:
   ```bash
   npm start
   ```

### Commands
| Command | Description |
|---------|-------------|
| `.start-snipe <code>` | Start sniping a vanity URL |
| `.stop-snipe` | Stop active snipe |
| `.check-vanity` | Show current server vanity URL |
| `.status` | Live snipe engine statistics |
| `.help` | Command help panel |

---

## 🇹🇷 Türkçe

### Genel Bakış
Waesta Vanity URL Snipper, Level 3 boost sunucular için tasarlanmış profesyonel bir Discord bot motorudur. Özel vanity URL (`discord.gg/kodunuz`) almak için rate limit farkındalığı, yetki doğrulaması ve embed tabanlı komut arayüzü sunar.

### ✨ Temel Özellikler
- **Embed Komut Arayüzü:** Tüm yanıtlar markalı Discord embed'leri ile gelir.
- **Modüler Mimari:** `lib/` altında ayrıştırılmış snipe motoru ve embed builder.
- **Rate Limit Motoru:** HTTP 429 yanıtlarında otomatik bekleme.
- **Canlı Durum Paneli:** `.status` komutu deneme, rate limit, uptime ve son hatayı gösterir.
- **Yetki Koruması:** Sunucuyu Yönet yetkisi ve VANITY_URL özelliği zorunlu.
- **Activity Durumu:** Bot `.help | waesta.js` olarak görünür.

### 🔒 Kırılmaz İmza (Anti-Tamper) Sistemi
Waesta bütünlük kontrolü içerir. Yazar imzası değiştirilirse program başlangıçta fatal exit ile kendini durdurur.

### 🛠️ Kurulum ve Kullanım
1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
2. `config.json` içine bot token'ınızı yazın.
3. Discord Developer Portal'da **Message Content Intent**'i açın.
4. Çalıştırın:
   ```bash
   npm start
   ```

### Komutlar
| Komut | Açıklama |
|-------|----------|
| `.start-snipe <kod>` | Vanity URL snipe başlat |
| `.stop-snipe` | Aktif snipe'i durdur |
| `.check-vanity` | Mevcut vanity URL'yi göster |
| `.status` | Snipe motoru istatistikleri |
| `.help` | Komut yardım paneli |
