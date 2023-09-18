import React, { useState } from "react";
import { useForm } from "react-hook-form";

export interface HandSplitFormValues {
  leftHand: string;
  rightHand: string;
  notKeepOrderLeft: boolean;
  notKeepOrderRight: boolean;
}

export const HandSplitForm = () => {
  const { register, handleSubmit, control } = useForm<HandSplitFormValues>({
    defaultValues: {
      leftHand: "***",
      rightHand: "****",
      notKeepOrderLeft: false,
      notKeepOrderRight: false,
    },
  });

  const _onSubmit = (formData: HandSplitFormValues) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id!, {
        message: "highlightByHandSplit",
        leftHand: formData.leftHand,
        rightHand: formData.rightHand,
        keepOrderLeft: !formData.notKeepOrderLeft,
        keepOrderRight: !formData.notKeepOrderRight,
      });
    })
  }

  return (
    <form onSubmit={handleSubmit(_onSubmit)}>
      <section>
      <label>
        皿側の3つが
        <input type="text" {...register(`leftHand`)}/>
        順不同
        <input type="checkbox" {...register(`notKeepOrderLeft`)}/>
      </label>
      </section>
      <section>
      <label>
        非皿側の4つが
        <input type="text" {...register(`rightHand`)}/>
        順不同
        <input type="checkbox" {...register(`notKeepOrderRight`)}/>
      </label>
      </section>
      <button
        type="submit"
      >
        分業ルールで検索
      </button>
    </form>
  );
}