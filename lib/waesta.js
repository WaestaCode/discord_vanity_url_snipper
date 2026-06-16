const AUTHOR = "waesta.js";
const EXPECTED_HASH = 927;

const COLORS = {
    reset: "\x1b[0m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    dim: "\x1b[2m",
    bold: "\x1b[1m"
};

function antiTamper() {
    let sum = 0;
    for (let i = 0; i < AUTHOR.length; i++) sum += AUTHOR.charCodeAt(i);
    if (sum !== EXPECTED_HASH) {
        console.error(`${COLORS.red}[FATAL] Waesta Integrity Check Failed. Execution Aborted.${COLORS.reset}`);
        process.exit(1);
    }
}

class WaestaLogger {
    static banner(title, subtitle) {
        console.log(`
${COLORS.cyan}${COLORS.bold}========================================
 ${title}
 Developer: ${AUTHOR}
 ${subtitle}
========================================${COLORS.reset}
`);
    }

    static info(message) {
        console.log(`${COLORS.cyan}[INFO]${COLORS.reset} ${COLORS.dim}${this._time()}${COLORS.reset} ${message}`);
    }

    static success(message) {
        console.log(`${COLORS.green}[ OK ]${COLORS.reset} ${COLORS.dim}${this._time()}${COLORS.reset} ${message}`);
    }

    static warn(message) {
        console.log(`${COLORS.yellow}[WARN]${COLORS.reset} ${COLORS.dim}${this._time()}${COLORS.reset} ${message}`);
    }

    static error(message) {
        console.error(`${COLORS.red}[ERR ]${COLORS.reset} ${COLORS.dim}${this._time()}${COLORS.reset} ${message}`);
    }

    static fatal(message) {
        this.error(message);
        process.exit(1);
    }

    static _time() {
        return new Intl.DateTimeFormat("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: "Europe/Paris"
        }).format(new Date());
    }
}

module.exports = { AUTHOR, antiTamper, WaestaLogger };
