import { TicketBatch } from "@/models/ticket-batch";

const ticketBatches: Array<TicketBatch> = [
  new TicketBatch({
    description: "Kit",
    firstSaleDate: new Date("2022-11-01"),
    finalSaleDate: new Date("2022-11-21"),
    title: "3º Lote",
    link: "https://doity.com.br/devfest-cerrado-2022#registration",
    value: 130,
  }),
  new TicketBatch({
    description: "Kit + camiseta",
    firstSaleDate: new Date("2022-11-01"),
    finalSaleDate: new Date("2022-11-11"),
    title: "3º Lote",
    link: "https://doity.com.br/devfest-cerrado-2022#registration",
    value: 150,
  }),
  new TicketBatch({
    description: "Kit + camiseta",
    firstSaleDate: new Date("2022-09-26"),
    finalSaleDate: new Date("2022-10-31T23:59:00"),
    title: "2º Lote",
    link: "https://doity.com.br/devfest-cerrado-2022#registration",
    value: 120,
  }),
  new TicketBatch({
    description: "Kit",
    firstSaleDate: new Date("2022-09-26"),
    finalSaleDate: new Date("2022-10-31T23:59:00"),
    title: "2º Lote",
    link: "https://doity.com.br/devfest-cerrado-2022#registration",
    value: 100,
  }),
  new TicketBatch({
    description: "Kit + camiseta",
    firstSaleDate: new Date("2022-09-01"),
    finalSaleDate: new Date("2022-09-26"),
    title: "1º Lote",
    link: "https://doity.com.br/devfest-cerrado-2022#registration",
    value: 100,
  }),
  new TicketBatch({
    description: "Kit",
    firstSaleDate: new Date("2022-09-01"),
    finalSaleDate: new Date("2022-09-26"),
    title: "1º Lote",
    link: "https://doity.com.br/devfest-cerrado-2022#registration",
    value: 70,
  }),
];

export default ticketBatches;
