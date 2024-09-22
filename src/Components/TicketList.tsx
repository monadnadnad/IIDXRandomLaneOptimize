import React from "react";
import { useWatch } from "react-hook-form";
import TicketItem from "./TicketItem";
import { Ticket } from "../ticket";
import { List, Grid } from "@mui/material";
import { makeTextageURL } from "../textage/textage";
import { TextageFormValues } from "./TextageForm";
import CopyToClipboardButton from "./CopyToClipboardButton";

interface TicketListProps {
  tickets: Ticket[];
}

const TicketList: React.FC<TicketListProps> = ({ tickets }) => {
  console.log("render TicketList");
  const { songTitle, playerSide, hispeed } = useWatch<TextageFormValues>();

  const generateLink = (laneText: string) => {
    const url = makeTextageURL(laneText, songTitle!, playerSide!, hispeed!);
    window.open(url);
  };

  const shareText = (laneText: string): string => {
    if (!songTitle || !playerSide || !hispeed) {
      return "";
    }

    const url = makeTextageURL(laneText, songTitle!, playerSide!, hispeed!);
    return `${songTitle} ${laneText}\n${url}`;
  }

  return (
    <List>
      {tickets.map((ticket, index) => (
        <Grid
          container
          spacing={2}
        >
          <Grid item xs={11}>
            <TicketItem key={index} ticket={ticket} onClick={generateLink} />
          </Grid>
          <Grid item xs={1}>
            <CopyToClipboardButton textToCopy={shareText(ticket.laneText)} />
          </Grid>
        </Grid>
      ))}
    </List>
  );
};

export default TicketList;
