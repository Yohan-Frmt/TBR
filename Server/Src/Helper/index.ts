import { v4 } from "uuid";

export const GenerateShitUUID = (): string => {
  const s4 = (): string =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return `${s4() + s4()}-${s4()}`;
};
export const GenerateUUID = (): string => v4();

export const FixHosts = (hosts: string[]): string[] => {
  const hasPort: RegExp = /(https?:\/\/.*):(\d*)\/?(.*)/g;
  return hosts.map((host: string): string => {
    if (host.match(hasPort) == null) {
      if (host.includes("https")) return `${host}:443`;
      if (host.includes("http")) return `${host}:80`;
    }
    return host;
  });
};

export const hash = (x: number) => {
  let h = x | 0;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h ^= h >> 16;
  return h;
};
