import { days, dayDiff } from "./helpers";

it("produces arrays of dates", () => {
  expect(days("2018-01-01", "2018-01-07")).toEqual([
    "2018-01-01",
    "2018-01-02",
    "2018-01-03",
    "2018-01-04",
    "2018-01-05",
    "2018-01-06",
    "2018-01-07"
  ]);
});

it("calculates difference between dates", () => {
  expect(dayDiff(new Date("2018-01-01"), new Date("2018-01-07"))).toEqual(6);
});
