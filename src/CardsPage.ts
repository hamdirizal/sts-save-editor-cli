import { CardService } from "./CardService.js";
import { Utility } from "./Utility.js";
import { Card } from "./types.js";

export class CardsPage {
  constructor(private utility:Utility, private cardService: CardService){
  }

  public seeAllCards() {
    const cards:Card[] = this.cardService.getCardList();
    console.log(cards);
  }

}