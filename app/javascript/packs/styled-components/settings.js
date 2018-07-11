import tinycolor from 'tinycolor2'

const settings = {
    inputBorderColor: '#209cee'
}

const rubBoxColor = '#F6F3EC'
const rubValueColor = '#0288AD'

const usdBoxColor = '#b38867'
const usdValueColor = '#f5e356'

const interactiveArrowColor = '#107896'

const currenciesTheme = {
    usd: {
        boxColor: usdBoxColor,
        boxColorHover: tinycolor(usdBoxColor).darken(5).toString(),
        valueColor: usdValueColor,
        symbolColor: tinycolor(usdValueColor).lighten().toString(),
    },
    rub: {
        boxColor: rubBoxColor,
        boxColorHover: tinycolor(rubBoxColor).lighten(30).toString(),
        valueColor: rubValueColor,
        symbolColor: tinycolor(rubValueColor).darken().toString(),
    }
}

const componentsTheme = {
    interactiveArrowColor: interactiveArrowColor,
    interactiveArrowHoverColor: tinycolor(interactiveArrowColor).lighten(20).toString(),
    interactiveArrowAnimatingColor: '#43abc9',
}

export {
    currenciesTheme,
    componentsTheme,
}

export default settings
