import { getBucket } from '@extend-chrome/storage';
import { AllowOption, BasicAtariRule, MultipleAtariRules } from './search';
import { v4 as uuidv4 } from "uuid";

// bucketにあるJSONだけからAtariRuleを復元する方法が必要
interface BasicAtariRuleJSON {
  rule: string
  allowOption: AllowOption
}

interface MultipleAtariRulesJSON {
  rules_id: string
  title: string
  rules: BasicAtariRuleJSON[]
}

interface AtariRuleBucket {
  [rules_id: string]: MultipleAtariRulesJSON
}

const atariRuleBucket = getBucket<AtariRuleBucket>("atari_rule_bucket", "local")

const makeBasicAtariRule = (json: BasicAtariRuleJSON): BasicAtariRule => {
  return new BasicAtariRule(json.rule).option(json.allowOption);
}

const makeMultipleAtariRules = (json: MultipleAtariRulesJSON): MultipleAtariRules => {
  const innerBasicAtariRules = json.rules.map((v) => makeBasicAtariRule(v));
  return new MultipleAtariRules(innerBasicAtariRules, json.title);
}

const jsonifyBasicAtariRule = (rule: BasicAtariRule): BasicAtariRuleJSON => {
  return {
    rule: rule.matcher.rule,
    allowOption: rule.allowOption
  };
}

const jsonifyMultipleAtariRules = (rules_id: string, rule: MultipleAtariRules): MultipleAtariRulesJSON => {
  return {
    rules_id,
    title: rule.title!,
    rules: rule.matcher.rules.map(rule => jsonifyBasicAtariRule(rule))
  };
}

export type MultipleAtariRulesWithId = {
  rules_id: string,
  rules: MultipleAtariRules
}

const getMultipleAtariRulesAll = async (): Promise<MultipleAtariRulesWithId[]> => {
  const bucket = await atariRuleBucket.get();
  return Object.entries(bucket).map(([rules_id, rule]) => ({
    rules_id,
    rules: makeMultipleAtariRules(rule)
  }));
}

const getMultipleAtariRulesById = async (rules_id: string): Promise<MultipleAtariRulesWithId> => {
  const bucket = await atariRuleBucket.get([rules_id]);
  const obj = bucket[rules_id];
  if (obj === undefined) throw Error(`No rule found id: ${rules_id}`);
  return {
    rules_id: obj.rules_id,
    rules: makeMultipleAtariRules(obj)
  }
}

const setMultipleAtariRules = (rules_id: string, rule: MultipleAtariRules) => {
  atariRuleBucket.set({[rules_id]: jsonifyMultipleAtariRules(rules_id, rule)});
}

const addMultipleAtariRules = (rule: MultipleAtariRules) => {
  const rules_id = uuidv4();
  setMultipleAtariRules(rules_id, rule);
}

const deleteMultipleAtariRules = (rules_id: string) => {
  atariRuleBucket.remove([rules_id]);
}

const testInitStorage = () => {
  setMultipleAtariRules(
    "DEFAULT-NEAR1472356",
    new MultipleAtariRules([
      new BasicAtariRule("14*****").option("r-random"),
      new BasicAtariRule("17*****").option("r-random"),
      new BasicAtariRule("47*****").option("r-random"),
    ], "near-1472356R-RANDOM")
  )
  setMultipleAtariRules(
    "DEFAULT-1472356R",
    new MultipleAtariRules([
      new BasicAtariRule("147****").option("r-random"),
      new BasicAtariRule("174****").option("r-random"),
      new BasicAtariRule("417****").option("r-random"),
    ], "14723456-R-RANDOM")
  )
  setMultipleAtariRules(
    "DEFAULT-MEI",
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
    ], "冥軸割れ")
  )
}

export {
  makeMultipleAtariRules,
  getMultipleAtariRulesAll,
  getMultipleAtariRulesById,
  addMultipleAtariRules,
  setMultipleAtariRules,
  deleteMultipleAtariRules,
  testInitStorage,
}
