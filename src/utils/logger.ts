const prefixLog = "🚀";
const prefixWarn = "⚡";

export const log = (message: string, emoji = prefixLog) => {
  console.info(`[open-api-mock]: ${emoji} ${message}`);
};

export const warn = (message: string, emoji = prefixWarn) => {
  console.warn(`[open-api-mock]: ${emoji} ${message}`);
};
