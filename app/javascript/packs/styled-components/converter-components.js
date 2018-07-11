import styled, { keyframes } from 'styled-components'
import { ifProp } from 'styled-tools'
import tinycolor from 'tinycolor2'
import { Box } from 'reakit'
import { currenciesTheme } from './settings'

const Currency = styled.div`
    margin-bottom: 10px;
    font-size: 1.5em;
    text-align: center;
    vertical-align: center;
    color: #b90cb1;
`

const BoxKeyframes = keyframes`
    0% {
        transform: rotate(5deg);
    }
    50% {
        transform: rotate(-5deg);
    }
    100% {
        transform: rotate(3deg);
    }
`

const CurrencyValue = Currency.extend`
    font-weight: bold;
`

const CurrencySymbol = Currency.extend`
    font-weight: bold;
`

const RublesValue = CurrencyValue.extend`
    color: ${currenciesTheme.rub.valueColor};
`

const RublesSymbol = CurrencySymbol.extend`
    color: ${currenciesTheme.rub.symbolColor};
`

const UsdValue = CurrencyValue.extend`
    color: ${currenciesTheme.usd.valueColor};
`

const UsdSymbol = CurrencySymbol.extend`
    color: ${currenciesTheme.usd.symbolColor}
`

const RubBox = Box.extend`
    box-shadow: 2px 2px 2px 2px #ccc;
    background-color: ${currenciesTheme.rub.boxColor}
    &:hover {
        animation: ${BoxKeyframes} .7s 2;
        background-color: ${currenciesTheme.rub.boxColorHover};
    }
`

const UsdBox = Box.extend`
    box-shadow: 2px 2px 2px 2px #ccc;
    background-color: ${currenciesTheme.usd.boxColor};
    &:hover {
        animation: ${BoxKeyframes} .7s 2;
        background-color: ${currenciesTheme.usd.boxColorHover};
    }
`

export {
    RublesValue,
    RublesSymbol,
    RubBox,
    UsdBox,
    UsdSymbol,
    UsdValue,
}
