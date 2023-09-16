import {
  BasicAtariRule,
  AtariRuleSet,
  searchAtariTicket,
  validateRuleText,
} from "./search";

test("searchAtariTicket", () => {
  const rules = [new BasicAtariRule("147****"), new BasicAtariRule("BBBWWWW")];
  expect(searchAtariTicket(rules[0], ["1472356", "1234567", "2461357"])).toStrictEqual(["1472356"]);
  expect(searchAtariTicket(rules[1], ["1472356", "1234567", "2461357"])).toStrictEqual(["2461357"]);
})


test("AtariRuleSet", () => {
  const rules = new AtariRuleSet([
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

test("OrRules", () => {
  const saragawa123 = new BasicAtariRule("[123][123][123]****");
  expect(saragawa123.match("1234567")).toBe(true);
  expect(saragawa123.match("3214567")).toBe(true);
  expect(saragawa123.match("4561237")).toBe(false);
  expect(saragawa123.match("1243567")).toBe(false);
  const exclude123 = new BasicAtariRule("[!123][!123][!123]****");
  expect(exclude123.match("1234567")).toBe(false);
  expect(exclude123.match("1243567")).toBe(false);
  expect(exclude123.match("1456237")).toBe(false);
  expect(exclude123.match("5671234")).toBe(true);
})

test("validateRuleText", () => {
  expect(validateRuleText("BBBWWWW")).toBe(true);
  expect(validateRuleText("1234567")).toBe(true);
  expect(validateRuleText("*******")).toBe(true);
  expect(validateRuleText("123****")).toBe(true);
  // []
  expect(validateRuleText("[123]******")).toBe(true);
  expect(validateRuleText("[!123]******")).toBe(true);
  expect(validateRuleText("[1234]******")).toBe(true);
  expect(validateRuleText("[!123]****[45]*")).toBe(true);
  expect(validateRuleText("[!123][!123][!123]****")).toBe(true);
  expect(validateRuleText("[!123]****[4a]")).toBe(false);
  expect(validateRuleText("[BW]******")).toBe(false);
  // 文字数
  expect(validateRuleText("1234")).toBe(false);
  expect(validateRuleText("[123]*****")).toBe(false);
  expect(validateRuleText("[123]*******")).toBe(false);
})
