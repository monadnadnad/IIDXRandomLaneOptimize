import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Checkbox, Button, FormControlLabel, Box, Grid } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const validateDuplicate = (val: string) => {
  const digits = val.replace(/\*/g, "");
  const uniqueDigits = new Set(digits);
  return uniqueDigits.size === digits.length;
};

const schema = z.object({
  scratchSideHand: z
    .string()
    .length(3, "3文字指定してください")
    .regex(/^[1-7*]+$/, "指定できるのは1-7と*だけです")
    .refine(validateDuplicate, { message: "重複している鍵盤があります" }),
  nonscratchSideHand: z
    .string()
    .length(4, "4文字指定してください")
    .regex(/^[1-7*]+$/, "指定できるのは1-7と*だけです")
    .refine(validateDuplicate, { message: "重複している鍵盤があります" }),
  scratchSideAnyOrder: z.boolean().default(true),
  nonscratchSideAnyOrder: z.boolean().default(true),
});

type HandSplitFormValues = z.infer<typeof schema>;

export const HandSplitForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HandSplitFormValues>({
    defaultValues: {
      scratchSideHand: "***",
      nonscratchSideHand: "****",
      scratchSideAnyOrder: true,
      nonscratchSideAnyOrder: true,
    },
    resolver: zodResolver(schema),
  });

  const _onSubmit = (formData: HandSplitFormValues) => {
    console.log(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(_onSubmit)}>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="皿側の3つが"
            {...register("scratchSideHand")}
            fullWidth
            error={!!errors.scratchSideHand}
            helperText={errors.scratchSideHand?.message}
          />
          <FormControlLabel
            control={<Checkbox {...register("scratchSideAnyOrder")} defaultChecked />}
            label="順不同"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="非皿側の4つが"
            {...register("nonscratchSideHand")}
            fullWidth
            error={!!errors.nonscratchSideHand}
            helperText={errors.nonscratchSideHand?.message}
          />
          <FormControlLabel
            control={<Checkbox {...register("nonscratchSideAnyOrder")} defaultChecked />}
            label="順不同"
          />
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" type="submit">
        チケットを検索
      </Button>
    </Box>
  );
};
