

export class TimeUtil {
  static getUnixTime(): number {
    return Math.round(Date.now() / 1000);
  }
}