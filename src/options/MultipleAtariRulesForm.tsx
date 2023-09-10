import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { AllowOption, BasicAtariRule, MultipleAtariRules } from "../search";

export interface FormValues {
  title: string;
  rules_id: string;
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
  rules_id: string
  onSubmit: (rule: MultipleAtariRules, rules_id: string | undefined) => Promise<void>
}

export const MultipleAtariRulesForm: React.FC<Props> = (props) => {
  const {
    multipleAtariRules,
    rules_id,
    onSubmit
  } = props;
  const clonedBasicAtariRules = multipleAtariRules.matcher
    .rules
    .map(rule => new BasicAtariRule(rule.matcher.rule, rule.title).option(rule.allowOption));

  const { register, handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      title: multipleAtariRules.title,
      rules_id: rules_id,
      rules: clonedBasicAtariRules.map(rule => ({
        ruleString: rule.matcher.rule,
        allowOption: rule.allowOption
      }))
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "rules",
    control,
  });
  
  const _onSubmit = (formData: FormValues) => {
    const newMultipleAtariRules = new MultipleAtariRules(
      formData.rules.map(rule =>
        new BasicAtariRule(rule.ruleString).option(rule.allowOption)
      ), formData.title
    );
    onSubmit(newMultipleAtariRules, formData.rules_id);
  }

  return (
    <div>
      <form onSubmit={handleSubmit(_onSubmit)}>
        <input type="hidden" {...register(`rules_id`)}/>
        <label>
          ルールタイトル
          <input type="text" {...register(`title`)}/>
        </label>
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
          配置を追加
        </button>
        <button
          type="submit"
        >
          ルールを保存（これを押さないと配置を書いた努力が消える）
        </button>
      </form>
    </div>
  )
}