const { Client, GatewayIntentBits, PermissionFlagsBits, ActivityType } = require("discord.js");
const config = require("./config.json");
const { antiTamper, WaestaLogger, AUTHOR } = require("./lib/waesta");
const WaestaVanitySniper = require("./lib/VanitySniper");
const { successEmbed, errorEmbed, infoEmbed, helpEmbed } = require("./lib/embeds");

antiTamper();

WaestaLogger.banner(
    "🔗 WAESTA DISCORD VANITY URL SNIPPER",
    "Level 3 Boost Vanity URL Claim Engine"
);

if (!config.BotToken || String(config.BotToken).includes("BURAYA")) {
    WaestaLogger.fatal('config.json → "BotToken" alanı eksik.');
}

const PREFIX = config.Prefix || ".";
const SNIPE_INTERVAL = Number(config.SnipeIntervalMs) > 0 ? Number(config.SnipeIntervalMs) : 1000;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const sniper = new WaestaVanitySniper(config.BotToken, SNIPE_INTERVAL);

function parseCommand(message) {
    if (!message.content.startsWith(PREFIX)) return null;
    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const command = args.shift()?.toLowerCase();
    if (!command) return null;
    return { command, args };
}

function hasManageGuild(member) {
    return member?.permissions.has(PermissionFlagsBits.ManageGuild);
}

function hasVanityFeature(guild) {
    return guild.features.includes("VANITY_URL");
}

async function handleStartSnipe(message, args) {
    const code = args[0]?.toLowerCase().replace(/^discord\.gg\//, "");

    if (!code) {
        return message.reply({
            embeds: [errorEmbed("❌ Eksik Parametre", `Kullanım: \`${PREFIX}start-snipe <vanity-kodu>\``)]
        });
    }

    if (!hasVanityFeature(message.guild)) {
        return message.reply({
            embeds: [errorEmbed("❌ Boost Gerekli", "Sunucunun **Level 3 boost** (VANITY_URL) özelliği yok.")]
        });
    }

    if (!hasManageGuild(message.member)) {
        return message.reply({
            embeds: [errorEmbed("❌ Yetki Yok", "Bu komut için **Sunucuyu Yönet** yetkisi gerekli.")]
        });
    }

    sniper.token = client.token;
    await sniper.startSnipe(code, message.guild);

    return message.reply({
        embeds: [successEmbed(
            "🎯 Snipe Başlatıldı",
            `**discord.gg/${code}** hedefi için snipe motoru aktif.\nDurdurmak için \`${PREFIX}stop-snipe\` kullanın.`
        )]
    });
}

async function handleStopSnipe(message) {
    if (!sniper.isRunning()) {
        return message.reply({
            embeds: [infoEmbed("ℹ️ Bilgi", "Aktif bir snipe işlemi bulunmuyor.")]
        });
    }

    const target = sniper.activeCode;
    sniper.stopSnipe();

    return message.reply({
        embeds: [infoEmbed("⏹️ Snipe Durduruldu", `\`discord.gg/${target}\` hedefi için snipe sonlandırıldı.`)]
    });
}

async function handleCheckVanity(message) {
    if (!hasVanityFeature(message.guild)) {
        return message.reply({
            embeds: [errorEmbed("❌ Boost Gerekli", "Sunucunun **Level 3 boost** (VANITY_URL) özelliği yok.")]
        });
    }

    try {
        sniper.token = client.token;
        const response = await sniper.checkVanityURL(message.guild.id);
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return message.reply({
                embeds: [errorEmbed("❌ API Hatası", data.message || `HTTP ${response.status}`)]
            });
        }

        const current = data.code ? `discord.gg/${data.code}` : "Ayarlanmamış";

        return message.reply({
            embeds: [infoEmbed("🔍 Vanity Durumu", `**Sunucu:** ${message.guild.name}\n**Mevcut URL:** \`${current}\``)]
        });
    } catch (error) {
        return message.reply({
            embeds: [errorEmbed("❌ Hata", error.message)]
        });
    }
}

function handleStatus(message) {
    return message.reply({
        embeds: [infoEmbed("📊 Snipe Durumu", sniper.getStatusText())]
    });
}

function handleHelp(message) {
    return message.reply({ embeds: [helpEmbed(PREFIX)] });
}

const commands = {
    "start-snipe": handleStartSnipe,
    "stop-snipe": (message) => handleStopSnipe(message),
    "check-vanity": (message) => handleCheckVanity(message),
    status: (message) => handleStatus(message),
    help: (message) => handleHelp(message)
};

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;

    const parsed = parseCommand(message);
    if (!parsed) return;

    const handler = commands[parsed.command];
    if (!handler) return;

    try {
        await handler(message, parsed.args);
    } catch (error) {
        WaestaLogger.error(`Komut hatası [${parsed.command}]: ${error.message}`);
        await message.reply({
            embeds: [errorEmbed("❌ Sistem Hatası", "Komut çalıştırılırken beklenmeyen bir hata oluştu.")]
        }).catch(() => {});
    }
});

client.once("ready", () => {
    WaestaLogger.success(`Bot çevrimiçi → ${client.user.tag}`);
    WaestaLogger.info(`Prefix: "${PREFIX}" | Snipe aralığı: ${SNIPE_INTERVAL}ms`);
    client.user.setActivity(`${PREFIX}help | ${AUTHOR}`, { type: ActivityType.Watching });
});

process.on("SIGINT", () => {
    sniper.stopSnipe();
    client.destroy();
    process.exit(0);
});

client.login(config.BotToken).catch((error) => {
    WaestaLogger.fatal(`Giriş başarısız: ${error.message}`);
});
