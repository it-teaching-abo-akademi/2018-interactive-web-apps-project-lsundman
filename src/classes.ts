export class Share {
  private symbol: string;
  private quote: number | undefined;

  constructor(symbol: string) {
    this.symbol = symbol;
  }

  public getSymbol = () => {
    return this.symbol;
  };

  public getQuote = () => {
    return this.quote;
  };

  public setQuote = (quote: number) => {
    this.quote = quote;
  };
}
