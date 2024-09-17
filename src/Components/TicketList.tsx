import React from "react";
import { useWatch } from "react-hook-form";
import TicketItem from "./TicketItem";
import { Ticket } from "../ticket";
import { List } from "@mui/material";
import { makeTextageURL } from "../textage/textage";
import { TextageFormValues } from "./TextageForm";

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

  return (
    <List>
      {tickets.map((ticket, index) => (
        <TicketItem key={index} ticket={ticket} onClick={generateLink} />
      ))}
    </List>
  );
};

export default TicketList;
