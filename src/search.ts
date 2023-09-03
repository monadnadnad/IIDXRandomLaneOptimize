type RandomLaneTicket = string;
type AllowOption = "strict" | "mirror" | "r-random";

interface Matcher {
  match(lane: RandomLaneTicket): boolean;
}

interface AtariRule {
  matcher: Matcher
}

class BasicMatcher implements Matcher {
  rule: string;
  allowOption: AllowOption;
  
  constructor(rule: string) {
    // \* | [1-7] | [BW]
    this.rule = rule;
    this.allowOption = "strict";
  }
  
  match = (lane: RandomLaneTicket): boolean => {
    const rules = [this.rule];
    if (this.allowOption == "r-random") {
      // mirrorを追加
      const mirror = this.mirrorRule(this.rule);
      rules.push(mirror);
      // R乱を追加
      for (let i = 1; i <= 6; i++) {
        rules.push(this.rotateRule(this.rule, i));
        rules.push(this.rotateRule(mirror, i));
      }
    } else if (this.allowOption == "mirror") {
      rules.push(this.mirrorRule(this.rule));
    }
    
    console.log(rules);
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

  /**
   * 許容するオプションを設定する
   */
  option = (allowOption: AllowOption): this => {
    this.allowOption = allowOption;
    return this;
  }

  private mirrorRule = (rule: string): string => {
    return rule.split("").reverse().join("");
  }

  private rotateRule = (rule: string, shift: number): string => {
    return rule.substring(shift) + rule.substring(0, shift);
  }
}


class BasicAtariRule implements AtariRule {
  title?: string;
  matcher: BasicMatcher;
  allowOption: AllowOption;
  constructor(rule: string, title?: string) {
    this.title = title;
    this.matcher = new BasicMatcher(rule);
    this.allowOption = "strict";
  }

  option = (allowOption: AllowOption): this => {
    this.allowOption = allowOption;
    this.matcher.option(allowOption);
    return this;
  }
}


class MultipleMatcher implements Matcher {
  rules: BasicAtariRule[];
  constructor(rules: BasicAtariRule[]) {
    this.rules = rules;
  }

  match = (lane: RandomLaneTicket): boolean => {
    return this.rules.some((rule) => rule.matcher.match(lane));
  }
}

class MultipleAtariRules implements AtariRule {
  title?: string;
  matcher: Matcher;
  constructor(rules: BasicAtariRule[], title?: string) {
    this.title = title;
    this.matcher = new MultipleMatcher(rules);
  }
}

const searchAtariTicket = (rule: AtariRule, tickets: RandomLaneTicket[]): RandomLaneTicket[] => {
  return tickets.filter((t) => rule.matcher.match(t));
}

const defaultAtariRules = [
  // rageとか3y3sとかの桂馬配置
  new MultipleAtariRules([
    new BasicAtariRule("14*****").option("r-random"),
    new BasicAtariRule("17*****").option("r-random"),
    new BasicAtariRule("47*****").option("r-random"),
  ], "near-1472356-like"),
  new MultipleAtariRules([
    new BasicAtariRule("147****").option("r-random"),
    new BasicAtariRule("174****").option("r-random"),
    new BasicAtariRule("417****").option("r-random"),
  ], "14723456-like"),
  // 冥の軸割れ
  new MultipleAtariRules([
    new BasicAtariRule("2**3***"),
    new BasicAtariRule("2***3**"),
    new BasicAtariRule("2****3*"),
    new BasicAtariRule("2*****3"),
    new BasicAtariRule("*2*3***"),
    new BasicAtariRule("*2**3**"),
    new BasicAtariRule("*2***3*"),
    new BasicAtariRule("*2****3"),
    new BasicAtariRule("**23***"),
    new BasicAtariRule("**2*3**"),
    new BasicAtariRule("**2**3*"),
    new BasicAtariRule("**2***3"),
    new BasicAtariRule("3**2***"),
    new BasicAtariRule("3***2**"),
    new BasicAtariRule("3****2*"),
    new BasicAtariRule("3*****2"),
    new BasicAtariRule("*3*2***"),
    new BasicAtariRule("*3**2**"),
    new BasicAtariRule("*3***2*"),
    new BasicAtariRule("*3****2"),
    new BasicAtariRule("**32***"),
    new BasicAtariRule("**3*2**"),
    new BasicAtariRule("**3**2*"),
    new BasicAtariRule("**3***2"),
  ], "mei-jikuware")
];

export {
  AtariRule,
  BasicAtariRule,
  BasicMatcher,
  Matcher,
  MultipleMatcher,
  MultipleAtariRules,
  RandomLaneTicket,
  searchAtariTicket,
  defaultAtariRules
}
