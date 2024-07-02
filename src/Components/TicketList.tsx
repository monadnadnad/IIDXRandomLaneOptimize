import React from "react";
import TicketItem from "./TicketItem";
import { Ticket } from "../ticket";
import { List } from "@mui/material";

interface TicketListProps {
  tickets: Ticket[];
}

const TicketList: React.FC<TicketListProps> = ({ tickets }) => {
  return (
    <List>
      {tickets.map((ticket, index) => (
        <TicketItem key={index} ticket={ticket} />
      ))}
    </List>
  );
};

export default TicketList;
