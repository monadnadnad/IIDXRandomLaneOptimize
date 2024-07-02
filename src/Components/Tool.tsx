import React from "react";
import { Container, ThemeProvider, createTheme } from "@mui/material";
import TicketList from "./TicketList";
import { Ticket } from "../ticket";

interface ToolProps {
  tickets: Ticket[];
}

const theme = createTheme({
  typography: {
    body1: {
      color: "#000000",
    },
  },
});

const Tool: React.FC<ToolProps> = ({ tickets }) => {
  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ backgroundColor: "white" }}>
        <TicketList tickets={tickets} />
      </Container>
    </ThemeProvider>
  );
};

export default Tool;
