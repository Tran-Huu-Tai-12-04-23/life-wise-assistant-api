class CoreHelper {
  public newDateTZ() {
    const d = new Date();
    const offset = 7;
    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;

    // create new Date object for different city
    // using supplied offset
    const nd = new Date(utc + 3600000 * offset);
    return nd;
  }
}

export const coreHelper = new CoreHelper();
