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

const getMultipleAtariRulesAll = async (): Promise<MultipleAtariRules[]> => {
  const bucket = await atariRuleBucket.get();
  return Object.values(bucket).map(rule => makeMultipleAtariRules(rule));
}

const setMultipleAtariRules = (rules_id: string, rule: MultipleAtariRules) => {
  atariRuleBucket.set({[rules_id]: jsonifyMultipleAtariRules(rules_id, rule)});
}

const addMultipleAtariRules = (rule: MultipleAtariRules) => {
  const rules_id = uuidv4();
  setMultipleAtariRules(rules_id, rule);
}

const testInitStorage = () => {
  setMultipleAtariRules(
    "TESTID001",
    new MultipleAtariRules(
      [
        new BasicAtariRule("BBBWWWW").option("r-random"),
        new BasicAtariRule("1234567").option("mirror")
      ], "TEST001"
    )
  )
  setMultipleAtariRules(
    "TESTID002",
    new MultipleAtariRules(
      [
        new BasicAtariRule("246****").option("mirror"),
        new BasicAtariRule("BWWBWWB")
      ], "TEST002"
    )
  )
  setMultipleAtariRules(
    "TESTID003",
    new MultipleAtariRules(
      [
        new BasicAtariRule("1357246")
      ], "TEST003"
    )
  )
}

export {
  makeMultipleAtariRules,
  getMultipleAtariRulesAll,
  testInitStorage
}
