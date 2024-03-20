import consola from "consola";
import * as fs from "fs";
import * as path from "path";

class Log {
  public baseDir: string;
  public fileName: string;
  public linePrefix: string;
  public today: Date = new Date();

  constructor() {
    const date: string = `${this.today.getFullYear()}-${
      this.today.getMonth() + 1
    }-${this.today.getDate()}`;
    const time: string = `${this.today.getHours()}:${this.today.getMinutes()}:${this.today.getSeconds()}`;
    this.baseDir = path.join(__dirname, "../../.logs/");
    this.fileName = `${date}.log`;
    this.linePrefix = `[${date} ${time}]`;
  }

  public Info = (str: string): void => {
    consola.info("\x1b[36m%s\x1b[0m", str);
    this.Add("INFO", str);
  };

  public Warn = (str: string): void => {
    consola.info("\x1b[33m%s\x1b[0m", str);
    this.Add("WARN", str);
  };

  public Error = (str: string): void => {
    consola.error("\x1b[31m%s\x1b[0m", str);
    this.Add("ERROR", str);
  };

  public Custom = (filename: string, str: string): void => {
    this.Add(filename, str);
  };

  private Add = (kind: string, str: string): void => {
    fs.open(
      `${this.baseDir}${this.fileName}`,
      "a",
      (err: NodeJS.ErrnoException | null, fd: number) => {
        if (!err && fd)
          fs.appendFile(
            fd,
            `${this.linePrefix} [${kind.toUpperCase()}] ${str}\n`,
            (err: NodeJS.ErrnoException | null) => {
              if (!err)
                fs.close(fd, (err: NodeJS.ErrnoException | null) =>
                  !err
                    ? true
                    : consola.error(
                        "\x1b[31m%s\x1b[0m",
                        `Error closing log file that was being appended`
                      )
                );
              else
                return consola.error(
                  "\x1b[31m%s\x1b[0m",
                  `[Error] Error appending to the log file`
                );
            }
          );
        else
          return consola.error(
            "\x1b[31m%s\x1b[0m",
            `[Error] Error couldn't open the log file for appending`
          );
      }
    );
  };
}

export default new Log();
