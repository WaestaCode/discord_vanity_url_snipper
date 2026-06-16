const { WaestaLogger } = require("./waesta");

const DISCORD_API = "https://discord.com/api/v10";

class WaestaVanitySniper {
    constructor(token, intervalMs) {
        this.token = token;
        this.intervalMs = intervalMs;
        this.sniperInterval = null;
        this.activeCode = null;
        this.activeGuildId = null;
        this.stats = {
            attempts: 0,
            rateLimits: 0,
            startedAt: null,
            lastError: null
        };
    }

    _headers() {
        return {
            accept: "*/*",
            authorization: `Bot ${this.token}`,
            "content-type": "application/json"
        };
    }

    async setVanityURL(code, guildId) {
        WaestaLogger.info(`Sniping → discord.gg/${code}`);
        return fetch(`${DISCORD_API}/guilds/${guildId}/vanity-url`, {
            method: "PATCH",
            headers: this._headers(),
            body: JSON.stringify({ code })
        });
    }

    async checkVanityURL(guildId) {
        return fetch(`${DISCORD_API}/guilds/${guildId}/vanity-url`, {
            method: "GET",
            headers: this._headers()
        });
    }

    async startSnipe(code, guild) {
        this.stopSnipe();

        this.activeCode = code;
        this.activeGuildId = guild.id;
        this.stats = { attempts: 0, rateLimits: 0, startedAt: Date.now(), lastError: null };

        WaestaLogger.warn(`Snipe başlatıldı → ${guild.name} / discord.gg/${code}`);

        this.sniperInterval = setInterval(async () => {
            try {
                this.stats.attempts += 1;
                const response = await this.setVanityURL(code, guild.id);
                const data = await response.json().catch(() => ({}));

                if (response.ok) {
                    WaestaLogger.success(`Vanity URL alındı → discord.gg/${code}`);
                    this.stopSnipe();
                    return;
                }

                if (response.status === 429) {
                    this.stats.rateLimits += 1;
                    const retryAfter = (data.retry_after || 1) * 1000;
                    WaestaLogger.warn(`Rate limit → ${retryAfter}ms bekleniyor`);
                    await new Promise((resolve) => setTimeout(resolve, retryAfter));
                    return;
                }

                this.stats.lastError = data.message || `HTTP ${response.status}`;
            } catch (error) {
                this.stats.lastError = error.message;
                WaestaLogger.error(`Snipe hatası: ${error.message}`);
            }
        }, this.intervalMs);
    }

    stopSnipe() {
        if (this.sniperInterval) {
            clearInterval(this.sniperInterval);
            this.sniperInterval = null;
            WaestaLogger.info("Snipe motoru durduruldu.");
        }
        this.activeCode = null;
        this.activeGuildId = null;
    }

    isRunning() {
        return this.sniperInterval !== null;
    }

    getStatusText() {
        if (!this.isRunning()) {
            return "Beklemede — aktif snipe yok.";
        }

        const uptime = Math.floor((Date.now() - this.stats.startedAt) / 1000);
        return [
            `**Durum:** Aktif`,
            `**Hedef:** \`discord.gg/${this.activeCode}\``,
            `**Deneme:** \`${this.stats.attempts}\``,
            `**Rate Limit:** \`${this.stats.rateLimits}\``,
            `**Uptime:** \`${uptime}s\``,
            this.stats.lastError ? `**Son Hata:** \`${this.stats.lastError}\`` : null
        ].filter(Boolean).join("\n");
    }
}

module.exports = WaestaVanitySniper;
