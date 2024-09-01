import React from "react";
import { Ticket } from "../ticket";
import { ListItem, ListItemText, Grid } from "@mui/material";

interface TicketItemProps {
  ticket: Ticket;
}

const TicketItem: React.FC<TicketItemProps> = ({ ticket }) => {
  const { laneText, expiration } = ticket;

  return (
    <ListItem sx={{ textAlign: "center" }}>
      <Grid container>
        <Grid item xs={6}>
          <ListItemText
            primary={laneText}
            sx={{ cursor: "pointer", textDecoration: "underline" }}
          />
        </Grid>
        <Grid item xs={6}>
          <ListItemText primary={expiration} />
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default TicketItem;
