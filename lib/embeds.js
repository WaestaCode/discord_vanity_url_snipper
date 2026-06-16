const { EmbedBuilder } = require("discord.js");
const { AUTHOR } = require("./waesta");

const COLORS = {
    brand: 0x5865F2,
    success: 0x57F287,
    danger: 0xED4245,
    warning: 0xFEE75C,
    neutral: 0x2F3136
};

function baseEmbed(title, description, color = COLORS.neutral) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setFooter({ text: `Secured by ${AUTHOR} Technology` })
        .setTimestamp();
}

function successEmbed(title, description) {
    return baseEmbed(title, description, COLORS.success);
}

function errorEmbed(title, description) {
    return baseEmbed(title, description, COLORS.danger);
}

function infoEmbed(title, description) {
    return baseEmbed(title, description, COLORS.brand);
}

function helpEmbed(prefix) {
    return baseEmbed(
        "🔗 Waesta Vanity URL Snipper",
        "Level 3 boost sunucular için vanity URL yönetim paneli.",
        COLORS.brand
    ).addFields(
        { name: `${prefix}start-snipe <kod>`, value: "Belirtilen vanity URL için snipe başlatır.", inline: false },
        { name: `${prefix}stop-snipe`, value: "Aktif snipe işlemini durdurur.", inline: false },
        { name: `${prefix}check-vanity`, value: "Sunucunun mevcut vanity URL'sini gösterir.", inline: false },
        { name: `${prefix}status`, value: "Snipe motorunun anlık durumunu listeler.", inline: false },
        { name: `${prefix}help`, value: "Bu yardım panelini gösterir.", inline: false }
    );
}

module.exports = { successEmbed, errorEmbed, infoEmbed, helpEmbed, COLORS };
