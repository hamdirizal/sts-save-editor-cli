export class Translation {
  constructor(private lang: string) {}

  private entries = {
    en: {
      get_all_cards: 'Get all cards',
      press_enter_to_go_back: `Press [Enter] to go back to the previous page`,
      press_enter_back_to_main: `Press [Enter] to go back to the main page`,
      back_to_main: 'Back to the main page',
      go_back: 'Go back',
      create_new_preset: 'Create new preset',
    },
  };

  get(key: string): string {
    return this.entries?.[this.lang]?.[key] || key;
  }
}
