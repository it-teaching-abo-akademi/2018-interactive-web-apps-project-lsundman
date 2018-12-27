import { getApiConnection } from "./App";

// 24h is this many milliseconds
const MILLI_DAY_FACTOR = 86400000;

export async function getQuote(symbol: string): Promise<number> {
  return getApiConnection()
    .stocks.quote(symbol, { datatype: "json" })
    .then(data => {
      if (data["Global Quote"] === {}) {
        return undefined;
      } else {
        return data["Global Quote"]["05. price"];
      }
    });
}

async function getDataPoints(
  symbol: string,
  labels: string[]
): Promise<number[]> {
  return getApiConnection()
    .stocks.daily(symbol, {
      outputsize: "full",
      datatype: "json"
    })
    .then(data => {
      let series = data["Time Series (Daily)"];
      return labels.map(day => {
        if (day in series) {
          return series[day]["4. close"];
        } else {
          return undefined;
        }
      });
    });
}

function days(a: string, b: string): string[] {
  let result: Date[] = [];
  let aTime = new Date(a).getTime();
  let bTime = new Date(b).getTime();

  while (bTime >= aTime) {
    // Pushing date to the top of the array in order to keep it sorted
    result.unshift(new Date(bTime));
    bTime = bTime - MILLI_DAY_FACTOR;
  }

  return result.map(
    date =>
      `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${(
        "0" + date.getDate()
      ).slice(-2)}`
  );
}

function dayDiff(a: Date, b: Date): number {
  return Math.abs(b.getTime() - a.getTime()) / MILLI_DAY_FACTOR;
}

function subDays(date: Date, subtrahend: number): Date {
  return new Date(date.getTime() - subtrahend * MILLI_DAY_FACTOR);
}

function dateToString(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function stringToDate(dateString: string) {
  let [year, month, day] = dateString.split("-").map(e => parseInt(e));
  return new Date(year, month - 1, day + 1);
}

export { days, dayDiff, stringToDate, dateToString, subDays, getDataPoints };
