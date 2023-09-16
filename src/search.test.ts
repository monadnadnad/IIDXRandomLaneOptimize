import {
  BasicAtariRule,
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

test("BasicAtariRulerWithOption", () => {
  const mirrorRule = new BasicAtariRule("1234567").option("mirror");
  expect(mirrorRule.match("1234567")).toBe(true);
  expect(mirrorRule.match("2345671")).toBe(false);
  expect(mirrorRule.match("3456712")).toBe(false);
  expect(mirrorRule.match("4567123")).toBe(false);
  expect(mirrorRule.match("5671234")).toBe(false);
  expect(mirrorRule.match("6712345")).toBe(false);
  expect(mirrorRule.match("7123456")).toBe(false);
  expect(mirrorRule.match("7654321")).toBe(true);
  expect(mirrorRule.match("6543217")).toBe(false);
  expect(mirrorRule.match("5432176")).toBe(false);
  expect(mirrorRule.match("4321765")).toBe(false);
  expect(mirrorRule.match("3217654")).toBe(false);
  expect(mirrorRule.match("2176543")).toBe(false);
  expect(mirrorRule.match("1765432")).toBe(false);
  
  const rRule = new BasicAtariRule("1234567").option("r-random");
  expect(rRule.match("1234567")).toBe(true);
  expect(rRule.match("2345671")).toBe(true);
  expect(rRule.match("3456712")).toBe(true);
  expect(rRule.match("4567123")).toBe(true);
  expect(rRule.match("5671234")).toBe(true);
  expect(rRule.match("6712345")).toBe(true);
  expect(rRule.match("7123456")).toBe(true);
  expect(rRule.match("7654321")).toBe(true); // mirrorも許容する
  expect(rRule.match("6543217")).toBe(true);
  expect(rRule.match("5432176")).toBe(true);
  expect(rRule.match("4321765")).toBe(true);
  expect(rRule.match("3217654")).toBe(true);
  expect(rRule.match("2176543")).toBe(true);
  expect(rRule.match("1765432")).toBe(true);
  expect(rRule.match("1234576")).toBe(false);
})