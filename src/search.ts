type RandomLaneTicket = string;
type AllowOption = "strict" | "mirror" | "r-random";
type IncludeKenban = string[][];

interface AtariRule {
  match(lane: RandomLaneTicket): boolean;
}

const OR_KENBAN_PATTERN = /\[[!]?([1-7]{1,7})\]/;
const ONE_KENBAN_PATTERN = /[BW1-7\*]|\[[!]?[1-7]{1,7}\]/g;
const RULE_PATTERN = new RegExp(`^(${ONE_KENBAN_PATTERN.source}){7}$`);

const parseOrKenban = (orKenban: string): string[] => {
  const match = orKenban.match(OR_KENBAN_PATTERN);
  
  if (!match) {
    throw new Error(`複数鍵盤の形式が間違っている: ${orKenban}`)
  }
  
  const exclude = match[0].includes("!");
  const digits = match[1].replace("!", "");
  const result = "1234567".split("");
  
  if (exclude) {
    return result.filter(d => !digits.includes(d));
  }
  return result.filter(d => digits.includes(d));
}

const parseOneKenban = (oneKenban: string): string[] => {
  if (oneKenban.length > 1) return parseOrKenban(oneKenban);
  if (oneKenban == "B") return "246".split("");
  if (oneKenban == "W") return "1357".split("");
  if (oneKenban == "*") return "1234567".split("");
  if ("1234567".includes(oneKenban)) return [oneKenban];
  return [];
}

const validateRuleText = (rule: string): boolean => {
  return rule.match(RULE_PATTERN) !== null;
};

const parseRuleText = (rule_text: string) => {
  // RULE = ONE_KENBANが7個
  // ONE_KENBAN = B | W | [1-7] | \* | \[OR_KENBAN\]
  // OR_KENBAN = [1-7]+ (include rule) | ![1-7]+ (exclude rule)
  // ex) [1-3][1-3][1-3]**** => 1234567, 1324567, 3214567など
  // ex) [!123]****** => 4123567, 5123467など

  if (!validateRuleText(rule_text)) {
    throw new Error(`ルールが不正: ${rule_text}`);
  }

  const oneKenbans = rule_text.match(ONE_KENBAN_PATTERN);

  if (!oneKenbans) {
    throw new Error(`各鍵盤の情報を読み取れない: ${rule_text}`);
  }
  
  if (oneKenbans.length !== 7) {
    throw new Error(`鍵盤が7つじゃない: ${oneKenbans}`);
  }
  
  const includeKenban: IncludeKenban = [];
  oneKenbans.forEach((kenban) => {
    includeKenban.push(parseOneKenban(kenban));
  });

  return includeKenban;
};

const matchIncludeKenbanWithLane = (includeKenban: IncludeKenban, lane: RandomLaneTicket): boolean => {
  for (let i=0; i<7; i++) {
    if (!includeKenban[i].includes(lane[i])) return false;
  }
  return true;
}

const mirrorRule = (rule: string): string => {
  return rule.split("").reverse().join("");
}

const rotateRule = (rule: string, shift: number): string => {
  return rule.substring(shift) + rule.substring(0, shift);
}

const matchTicket = (lane: RandomLaneTicket, rule_text: string, allowOption: AllowOption): boolean => {
  const rules = [rule_text];
  if (allowOption == "r-random") {
    // mirrorを追加
    const mirror = mirrorRule(rule_text);
    rules.push(mirror);
    // R乱を追加
    for (let i = 1; i <= 6; i++) {
      rules.push(rotateRule(rule_text, i));
      rules.push(rotateRule(mirror, i));
    }
  } else if (allowOption == "mirror") {
    rules.push(mirrorRule(rule_text));
  }
  
  // console.log("match using", rules);
  return rules.some((rule) => {
    const includeKenban = parseRuleText(rule);
    return matchIncludeKenbanWithLane(includeKenban, lane);
  });
}

class BasicAtariRule implements AtariRule {
  text: string;
  allowOption: AllowOption;
  constructor(rule_text: string) {
    this.text = rule_text;
    this.allowOption = "strict";
  }

  option = (allowOption: AllowOption): this => {
    this.allowOption = allowOption;
    return this;
  }

  match(lane: RandomLaneTicket): boolean {
    return matchTicket(lane, this.text, this.allowOption);
  }
}

class AtariRuleSet implements AtariRule {
  title: string;
  rules: BasicAtariRule[];
  constructor(rules: BasicAtariRule[], title: string) {
    this.title = title;
    this.rules = rules;
  }

  match = (lane: RandomLaneTicket): boolean => {
    return this.rules.some((rule) => rule.match(lane));
  }
}

const searchAtariTicket = (rule: AtariRule, tickets: RandomLaneTicket[]): RandomLaneTicket[] => {
  return tickets.filter((t) => rule.match(t));
}

const generatePermutations = (arr: string[]): string[][] => {
  if (arr.length === 0) return [[]];
  const first = arr[0];
  const rest = arr.slice(1);
  const permutations = generatePermutations(rest);
  const result: string[][] = [];

  for (const perm of permutations) {
    for (let i = 0; i <= perm.length; i++) {
      const copy = perm.slice();
      copy.splice(i, 0, first);
      result.push(copy);
    }
  }

  return result;
};

export const makeHandSplitRuleSet = (
  left: string,
  right: string,
  keep_order_left: boolean,
  keep_order_right: boolean
) => {
  const LEFT_PATTERN = /[1-7\*]{3}/;
  const RIGHT_PATTERN = /[1-7\*]{4}/;
  if (!left.match(LEFT_PATTERN)) throw new Error(`皿側のルールが不正 ${left}`);
  if (!right.match(RIGHT_PATTERN)) throw new Error(`非皿側のルールが不正 ${right}`);
  
  const left_rules = [left];
  const right_rules = [right];
  if (!keep_order_left) {
    const left_chars = left.split("");
    const left_permutations = generatePermutations(left_chars);
    left_rules.push(...left_permutations.map(arr => arr.join("")));
  }
  if (!keep_order_right) {
    const right_chars = right.split("");
    const right_permutations = generatePermutations(right_chars);
    right_rules.push(...right_permutations.map(arr => arr.join("")));
  }
  
  const rules = [];
  for (const left_rule of left_rules) {
    for (const right_rule of right_rules) {
      rules.push(new BasicAtariRule(left_rule + right_rule));
    }
  }
  
  const ruleset = new AtariRuleSet(rules, "");
  return ruleset;
}

export {
  AtariRule,
  AllowOption,
  BasicAtariRule,
  AtariRuleSet,
  RandomLaneTicket,
  searchAtariTicket,
  validateRuleText,
}
