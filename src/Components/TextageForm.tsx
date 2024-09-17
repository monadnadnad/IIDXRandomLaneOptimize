import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { z } from "zod";
import { zodEnumFromObjKeys } from "../utils";
import { textageSongInfos, textageSongTitles } from "../textage/textage";

export const textageFormSchema = z.object({
  songTitle: zodEnumFromObjKeys(textageSongInfos).refine((val) => val !== "", {
    message: "有効な曲名を選択してください",
  }),
  playerSide: z.enum(["1P", "2P"]),
  hispeed: z.number().min(2).max(50),
});

export type TextageFormValues = z.infer<typeof textageFormSchema>;

export const TextageForm: React.FC = () => {
  console.log("render TextageForm");
  const { control } = useFormContext<TextageFormValues>();

  return (
    <Box component="form">
      <Controller
        name="songTitle"
        control={control}
        render={({ field, fieldState }) => (
          <Autocomplete
            {...field}
            options={textageSongTitles}
            getOptionLabel={(option) => option}
            isOptionEqualToValue={(option, value) => option === value || value === ""}
            onChange={(event, value) => field.onChange(value || "")}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        )}
      />
      <Controller
        name="playerSide"
        control={control}
        render={({ field }) => (
          <FormControl component="fieldset">
            <FormLabel component="label" />
            <RadioGroup {...field} row>
              <FormControlLabel value="1P" control={<Radio />} label="1P" />
              <FormControlLabel value="2P" control={<Radio />} label="2P" />
            </RadioGroup>
          </FormControl>
        )}
      />
      <Controller
        name="hispeed"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Hispeed"
            type="number"
            inputProps={{ min: 2, max: 50 }}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
    </Box>
  );
};
