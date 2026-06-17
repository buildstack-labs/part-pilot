type LogLevel = "info" | "warn" | "error" | "debug";

function stamp(level: LogLevel, tag: string, msg: string, data?: unknown): string {
  const ts = new Date().toISOString();
  const line = `[${ts}] [${level.toUpperCase().padEnd(5)}] [${tag}] ${msg}`;
  return data !== undefined ? `${line} ${JSON.stringify(data)}` : line;
}

export function logger(tag: string) {
  return {
    info:  (msg: string, data?: unknown) => console.log(stamp("info",  tag, msg, data)),
    warn:  (msg: string, data?: unknown) => console.warn(stamp("warn",  tag, msg, data)),
    error: (msg: string, data?: unknown) => console.error(stamp("error", tag, msg, data)),
    debug: (msg: string, data?: unknown) => {
      if (process.env.DEBUG) console.log(stamp("debug", tag, msg, data));
    },
  };
}
