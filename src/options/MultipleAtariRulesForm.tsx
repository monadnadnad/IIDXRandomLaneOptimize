import React, { useCallback, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { AllowOption, BasicAtariRule, MultipleAtariRules } from "../search";

interface FormValues {
  rules: {
    ruleString: string;
    allowOption: AllowOption;
  }[];
}

type AllowOptionLabels = {
  [key in AllowOption]: string;
};
const allowOptionLabels: AllowOptionLabels = {
  strict: "オプションなし",
  mirror: "ミラー",
  "r-random": "R乱",
};

interface Props {
  multipleAtariRules: MultipleAtariRules
}

export const MultipleAtariRulesForm: React.FC<Props> = (props) => {
  const { multipleAtariRules } = props;
  const clonedBasicAtariRules = multipleAtariRules.matcher
    .rules
    .map(rule => new BasicAtariRule(rule.matcher.rule, rule.title).option(rule.allowOption));
  const [title, setTitle] = useState<string | undefined>(multipleAtariRules.title);
  const [newRules, setNewRules] = useState<BasicAtariRule[]>(clonedBasicAtariRules);

  const { register, handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      rules: clonedBasicAtariRules.map(rule => (
        {ruleString: rule.matcher.rule, allowOption: rule.allowOption}
      ))
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "rules",
    control,
  });
  
  const onAtariRuleChange = useCallback((index: number, ruleString: string, allowOption: AllowOption) => {
    const newBasicAtariRule = new BasicAtariRule(ruleString).option(allowOption);
    setNewRules(newRules.map((rule, i) => i === index ? newBasicAtariRule: rule));
  }, []);

  return (
    <div>
      <p>{title}</p>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input
            placeholder="ex) 246****, BWWBWWB"
            type="text"
            {...register(`rules.${index}.ruleString` as const, {
              required: true,
            })}
          />
          <select
            {...register(`rules.${index}.allowOption` as const, {
              required: true,
            })}
          >
            {Object.entries(allowOptionLabels).map(([option, label]) => (
              <option key={option} value={option}>{label}</option>
            ))}
          </select>
          <button type="button" onClick={() => remove(index)}>
            削除
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          append({
            ruleString: "*******",
            allowOption: "strict",
          })
        }
      >
        ルールを追加
      </button>
    </div>
  )
}