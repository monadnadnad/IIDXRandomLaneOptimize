import React from "react";
import { Container, ThemeProvider, createTheme } from "@mui/material";
import TicketList from "./TicketList";
import { Ticket } from "../ticket";
import { HandSplitForm } from "./HandSplitForm";

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
          pointerEvents: "auto",
          cursor: "pointer",
          display: "inline",
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
          "legend" : {
            display: "none",
          },
        },
      },
    },
  },
});

const Tool: React.FC<ToolProps> = ({ tickets }) => {
  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ backgroundColor: "white", padding: 2, borderRadius: 2 }}>
        <HandSplitForm />
        <TicketList tickets={tickets} />
      </Container>
    </ThemeProvider>
  );
};

export default Tool;
