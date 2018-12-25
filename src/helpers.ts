import AlphaVantage from "alphavantage-ts";
import { parseTwoDigitYear } from "moment";

// 24h is this many milliseconds
const MILLI_DAY_FACTOR = 86400000;

function days(a: Date, b: Date): Date[] {
  let result: Date[] = [];

  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);

  let tmp = b.getTime();

  while (tmp != a.getTime()) {
    result.push(new Date(tmp));
    tmp = tmp - MILLI_DAY_FACTOR;
  }

  return result;
}

function getDataPoints(
  tickerSymbol: string,
  dateStart: Date,
  dateEnd: Date,
  api: AlphaVantage
): Promise<{ x: Date; y: number }[]> {
  let dayList = days(dateStart, dateEnd).map(
    date => `${date.getFullYear}-${date.getMonth}-${date.getDay}`
  );
  let size: "full" | "compact" = dayList.length > 20 ? "full" : "compact";
  return api.stocks
    .daily(tickerSymbol, { outputsize: size, datatype: "json" })
    .then(data => {
      let timeSeries = data["Time Series (Daily)"];
      return Object.keys(timeSeries)
        .filter(key => dayList.includes(key))
        .map(key => {
          return {
            x: new Date(key),
            y: parseInt(timeSeries[key]["4. close"], 10)
          };
        })
        .sort((a: { x: Date; y: number }, b: { x: Date; y: number }) => {
          return b.x.getTime() - a.x.getTime();
        });
    });
}

function subDays(date: Date, subtrahend: number): Date {
  return new Date(date.getTime() - subtrahend * MILLI_DAY_FACTOR);
}

function dateToString(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function stringToDate(dateString: string) {
  let [year, month, day] = dateString.split("-").map(parseInt);
  return new Date(year, month - 1, day);
}

export {
  days as daysBetween,
  stringToDate,
  dateToString,
  subDays,
  getDataPoints
};
