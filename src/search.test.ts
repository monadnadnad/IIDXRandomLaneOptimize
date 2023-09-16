import {
  BasicAtariRule,
  BasicMatcher,
  MultipleAtariRules,
  searchAtariTicket,
} from "./search";

test("searchAtariTicket", () => {
  const rules = [new BasicAtariRule("147****"), new BasicAtariRule("BBBWWWW")];
  expect(searchAtariTicket(rules[0], ["1472356", "1234567", "2461357"])).toStrictEqual(["1472356"]);
  expect(searchAtariTicket(rules[1], ["1472356", "1234567", "2461357"])).toStrictEqual(["2461357"]);
})


test("MultipleAtariRules", () => {
  const rules = new MultipleAtariRules([
    new BasicAtariRule("14*****"),
    new BasicAtariRule("41*****")
  ], "test");
  expect(searchAtariTicket(rules, ["1472356", "4172356", "7142356"])).toStrictEqual(["1472356", "4172356"]);
})

test("BasicMatcherWithOption", () => {
  const mirrorMatcher = new BasicMatcher("1234567").option("mirror");
  expect(mirrorMatcher.match("1234567")).toBe(true);
  expect(mirrorMatcher.match("2345671")).toBe(false);
  expect(mirrorMatcher.match("3456712")).toBe(false);
  expect(mirrorMatcher.match("4567123")).toBe(false);
  expect(mirrorMatcher.match("5671234")).toBe(false);
  expect(mirrorMatcher.match("6712345")).toBe(false);
  expect(mirrorMatcher.match("7123456")).toBe(false);
  expect(mirrorMatcher.match("7654321")).toBe(true);
  expect(mirrorMatcher.match("6543217")).toBe(false);
  expect(mirrorMatcher.match("5432176")).toBe(false);
  expect(mirrorMatcher.match("4321765")).toBe(false);
  expect(mirrorMatcher.match("3217654")).toBe(false);
  expect(mirrorMatcher.match("2176543")).toBe(false);
  expect(mirrorMatcher.match("1765432")).toBe(false);
  
  const rMatcher = new BasicMatcher("1234567").option("r-random");
  expect(rMatcher.match("1234567")).toBe(true);
  expect(rMatcher.match("2345671")).toBe(true);
  expect(rMatcher.match("3456712")).toBe(true);
  expect(rMatcher.match("4567123")).toBe(true);
  expect(rMatcher.match("5671234")).toBe(true);
  expect(rMatcher.match("6712345")).toBe(true);
  expect(rMatcher.match("7123456")).toBe(true);
  expect(rMatcher.match("7654321")).toBe(true); // mirrorも許容する
  expect(rMatcher.match("6543217")).toBe(true);
  expect(rMatcher.match("5432176")).toBe(true);
  expect(rMatcher.match("4321765")).toBe(true);
  expect(rMatcher.match("3217654")).toBe(true);
  expect(rMatcher.match("2176543")).toBe(true);
  expect(rMatcher.match("1765432")).toBe(true);
})