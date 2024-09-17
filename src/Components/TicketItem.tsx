import React from "react";
import { Ticket } from "../ticket";
import { ListItem, ListItemText, Grid } from "@mui/material";

interface TicketItemProps {
  ticket: Ticket;
  onClick: (laneText: string) => void;
}

const TicketItem: React.FC<TicketItemProps> = ({ ticket, onClick }) => {
  console.log("render ticketitem");
  const { laneText, expiration } = ticket;

  const handleClick = () => onClick(laneText);

  return (
    <ListItem sx={{ textAlign: "center" }}>
      <Grid container>
        <Grid item xs={6}>
          <ListItemText
            primary={laneText}
            sx={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={handleClick}
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
