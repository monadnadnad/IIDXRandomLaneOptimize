import { getBucket } from "@extend-chrome/storage";
import { AllowOption, BasicAtariRule, AtariRuleSet } from "./search";
import { v4 as uuidv4 } from "uuid";

// bucketにあるJSONだけからAtariRuleを復元する方法が必要
interface BasicAtariRuleJSON {
  rule: string;
  allowOption: AllowOption;
}

interface AtariRuleSetJSON {
  rules_id: string;
  title: string;
  rules: BasicAtariRuleJSON[];
}

interface AtariRuleBucket {
  [rules_id: string]: AtariRuleSetJSON;
}

const atariRuleBucket = getBucket<AtariRuleBucket>("atari_rule_bucket", "local");

const makeBasicAtariRule = (json: BasicAtariRuleJSON): BasicAtariRule => {
  return new BasicAtariRule(json.rule).option(json.allowOption);
};

const makeAtariRuleSet = (json: AtariRuleSetJSON): AtariRuleSet => {
  const innerBasicAtariRules = json.rules.map((v) => makeBasicAtariRule(v));
  return new AtariRuleSet(innerBasicAtariRules, json.title);
};

const jsonifyBasicAtariRule = (rule: BasicAtariRule): BasicAtariRuleJSON => {
  return {
    rule: rule.text,
    allowOption: rule.allowOption,
  };
};

const jsonifyAtariRuleSet = (rules_id: string, rule: AtariRuleSet): AtariRuleSetJSON => {
  return {
    rules_id,
    title: rule.title!,
    rules: rule.rules.map((rule) => jsonifyBasicAtariRule(rule)),
  };
};

export type AtariRuleSetWithId = {
  rules_id: string;
  ruleset: AtariRuleSet;
};

const getAtariRuleSetAll = async (): Promise<AtariRuleSetWithId[]> => {
  const bucket = await atariRuleBucket.get();
  return Object.entries(bucket).map(([rules_id, rule]) => ({
    rules_id,
    ruleset: makeAtariRuleSet(rule),
  }));
};

const getAtariRuleSetById = async (rules_id: string): Promise<AtariRuleSetWithId> => {
  const bucket = await atariRuleBucket.get([rules_id]);
  const obj = bucket[rules_id];
  if (obj === undefined) throw Error(`No rule found id: ${rules_id}`);
  return {
    rules_id: obj.rules_id,
    ruleset: makeAtariRuleSet(obj),
  };
};

const setAtariRuleSet = (rules_id: string, rule: AtariRuleSet) => {
  atariRuleBucket.set({ [rules_id]: jsonifyAtariRuleSet(rules_id, rule) });
};

const addAtariRuleSet = (rule: AtariRuleSet) => {
  const rules_id = uuidv4();
  setAtariRuleSet(rules_id, rule);
};

const deleteAtariRuleSet = (rules_id: string) => {
  atariRuleBucket.remove([rules_id]);
};

const testInitStorage = () => {
  setAtariRuleSet(
    "DEFAULT-NEAR1472356",
    new AtariRuleSet(
      [
        new BasicAtariRule("14*****").option("r-random"),
        new BasicAtariRule("17*****").option("r-random"),
        new BasicAtariRule("47*****").option("r-random"),
      ],
      "near-1472356R-RANDOM"
    )
  );
  setAtariRuleSet(
    "DEFAULT-1472356R",
    new AtariRuleSet(
      [
        new BasicAtariRule("147****").option("r-random"),
        new BasicAtariRule("174****").option("r-random"),
        new BasicAtariRule("417****").option("r-random"),
      ],
      "14723456-R-RANDOM"
    )
  );
  setAtariRuleSet(
    "DEFAULT-MEI",
    new AtariRuleSet(
      [
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
      ],
      "冥軸割れ"
    )
  );
};

export {
  makeAtariRuleSet,
  getAtariRuleSetAll,
  getAtariRuleSetById,
  addAtariRuleSet,
  setAtariRuleSet,
  deleteAtariRuleSet,
  testInitStorage,
};
