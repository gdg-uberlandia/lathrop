export class TicketBatch {
  title: string;
  description: string;
  value: number;
  link: string;
  firstSaleDate: Date;
  finalSaleDate: Date;

  constructor({
    title,
    description,
    value,
    link,
    firstSaleDate,
    finalSaleDate,
  }: {
    title: string;
    description: string;
    value: number;
    link: string;
    firstSaleDate: Date;
    finalSaleDate: Date;
  }) {
    this.title = title;
    this.description = description;
    this.value = value;
    this.link = link;
    this.firstSaleDate = firstSaleDate;
    this.finalSaleDate = finalSaleDate;
  }

  isOutOfSale(): boolean {
    return new Date() > this.finalSaleDate;
  }
}
