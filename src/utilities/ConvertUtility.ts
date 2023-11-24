export class ConvertUtility {
  public static bufferToJson<T>(data: Buffer) {
    return JSON.parse(data.toString()) as T;
  }

  public static jsonToBuffer<T>(obj: T) {
    return Buffer.from(JSON.stringify(obj));
  }
}
