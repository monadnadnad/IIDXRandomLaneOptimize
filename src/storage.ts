import { getBucket } from '@extend-chrome/storage';
import { AllowOption, BasicAtariRule, MultipleAtariRules } from './search';

// bucketにあるJSONだけからAtariRuleを復元する方法が必要
interface BasicAtariRuleJSON {
  rule: string
  allowOption: AllowOption
}

interface MultipleAtariRulesJSON {
  title: string
  rules: BasicAtariRuleJSON[]
}

interface AtariRuleBucket {
  rules: MultipleAtariRulesJSON[]
}

const atariRuleBucket = getBucket<AtariRuleBucket>("atari_rule_bucket", "local")

const makeBasicAtariRule = (json: BasicAtariRuleJSON): BasicAtariRule => {
  return new BasicAtariRule(json.rule).option(json.allowOption);
}

const makeMultipleAtariRules = (json: MultipleAtariRulesJSON): MultipleAtariRules => {
  const innerBasicAtariRules = json.rules.map((v) => makeBasicAtariRule(v));
  return new MultipleAtariRules(innerBasicAtariRules, json.title);
}


const getMultipleAtariRulesAll = async (): Promise<MultipleAtariRules[]> => {
  const bucket = await atariRuleBucket.get(["rules"]);
  if (bucket.rules === undefined) return [];
  return bucket.rules.map(rule => makeMultipleAtariRules(rule));
}

export {
  makeMultipleAtariRules,
  getMultipleAtariRulesAll
}
