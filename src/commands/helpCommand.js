import { TEXTCOLOR } from "../constants.js";

const str = `
Usage: ${TEXTCOLOR.YELLOW}node app.js COMMAND${TEXTCOLOR.DEFAULT}

AVAILABLE COMMANDS: 
${TEXTCOLOR.YELLOW}help${TEXTCOLOR.DEFAULT}
    Show this help message
${TEXTCOLOR.YELLOW}see_presets${TEXTCOLOR.DEFAULT}
    List all available presets
${TEXTCOLOR.YELLOW}create_preset${TEXTCOLOR.DEFAULT}
    Create a preset
${TEXTCOLOR.YELLOW}open_preset PRESETID${TEXTCOLOR.DEFAULT}
    Open a preset, and set it as the current preset
${TEXTCOLOR.YELLOW}add_card ID ID..${TEXTCOLOR.DEFAULT}
    Add card to the active preset.
${TEXTCOLOR.YELLOW}del_card ID ID..${TEXTCOLOR.DEFAULT}
    Remove card from the active preset.
${TEXTCOLOR.YELLOW}add_relic ID ID..${TEXTCOLOR.DEFAULT}
    Add relic to the active preset
${TEXTCOLOR.YELLOW}del_relic ID ID..${TEXTCOLOR.DEFAULT}
    Remove relic from the active preset
${TEXTCOLOR.YELLOW}set_gold AMOUNT${TEXTCOLOR.DEFAULT}
    Set the gold amount of the active preset
${TEXTCOLOR.YELLOW}see_cards${TEXTCOLOR.DEFAULT}
    List all available cards with their ids
${TEXTCOLOR.YELLOW}see_relics${TEXTCOLOR.DEFAULT}
    List all available relics with their ids
`


export const helpCommand = () => {
  console.info(str);
}