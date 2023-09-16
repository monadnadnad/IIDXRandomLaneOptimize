type RandomLaneTicket = string;
type AllowOption = "strict" | "mirror" | "r-random";

interface AtariRule {
  match(lane: RandomLaneTicket): boolean;
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
  
  console.log("match using", rules);
  return rules.some((rule) => {
    for (let i=0; i<7; i++) {
      let c = rule[i];
      if (c == "*") continue;
      const black = "246".includes(lane[i]);
      if (c == "B" && black) continue;
      if (c == "W" && !black) continue;
      if (c != lane[i]) return false;
    }
    return true;
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

class MultipleAtariRules implements AtariRule {
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


export {
  AtariRule,
  AllowOption,
  BasicAtariRule,
  MultipleAtariRules,
  RandomLaneTicket,
  searchAtariTicket,
}
