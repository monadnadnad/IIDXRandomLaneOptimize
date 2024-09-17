import React from "react";
import { Container, Grid, ThemeProvider, createTheme } from "@mui/material";
import TicketList from "./TicketList";
import { Ticket } from "../ticket";
import { HandSplitForm } from "./HandSplitForm";
import { TextageForm, TextageFormValues, textageFormSchema } from "./TextageForm";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface ToolProps {
  tickets: Ticket[];
}

const theme = createTheme({
  typography: {
    body1: {
      color: "#000000",
    },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        formControl: {
          position: "static",
          transform: "none",
          transition: "none",
          alignSelf: "start",
          fontWeight: "bold",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          marginTop: 0,
        },
        input: {
          paddingTop: "10px",
          paddingBottom: "8px",
          height: "auto",
        },
        notchedOutline: {
          top: 0,
          legend: {
            display: "none",
          },
        },
      },
    },
  },
});

const Tool: React.FC<ToolProps> = ({ tickets }) => {
  const methods = useForm<TextageFormValues>({
    resolver: zodResolver(textageFormSchema),
    defaultValues: {
      songTitle: "",
      playerSide: "1P",
      hispeed: 16,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ backgroundColor: "white", padding: 2, borderRadius: 2 }}>
        <FormProvider {...methods}>
          <Grid
            container
            spacing={2}
            sx={{ backgroundColor: "#f5f5f5", padding: 2, borderRadius: 2, mb: 2 }}
          >
            <Grid item xs={6}>
              <HandSplitForm />
            </Grid>
            <Grid item xs={6}>
              <TextageForm />
            </Grid>
          </Grid>
          <TicketList tickets={tickets} />
        </FormProvider>
      </Container>
    </ThemeProvider>
  );
};

export default Tool;
