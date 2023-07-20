import { TEXTCOLOR } from "./constants.js";

export class Translation {

  constructor (private lang: string) {}

  private entries = {
    en: {
      get_all_cards: "Get all cards",
      press_enter_to_go_back: `${TEXTCOLOR.CYAN}Press [Enter] to go back to the previous page${TEXTCOLOR.DEFAULT}`,
      go_back: "Go back",
      create_new_preset: "Create new preset",
    }
  }

  get(key: string): string {
    return this.entries?.[this.lang]?.[key] || key;
  }
}