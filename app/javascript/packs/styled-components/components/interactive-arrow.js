import styled, { keyframes } from 'styled-components'
import { ifProp } from 'styled-tools'
import { Arrow } from 'reakit'
import { componentsTheme } from '../settings'

const WaitingAnimation = keyframes`
    0% {
        transform: rotateZ(270deg) translateY(0) scale(1.1);
    }
    20% {
        transform: rotateZ(270deg) translateY(10%) scale(0.9);
    }
    50% {
        transform: rotateZ(270deg) translateY(30%) scale(0.7);
    }
    100% {
         transform: rotateZ(270deg) translateY(50%) scale(0.5);
    }
`

const InteractiveArrow = styled(Arrow)`
    transform: rotateZ(270deg) translateY(30%);
    transition: all 1s ease-out;
    color: ${ifProp("animating", componentsTheme.interactiveArrowAnimatingColor, componentsTheme.interactiveArrowColor)};
    animation: ${ifProp("animating", `${WaitingAnimation} 1s infinite`, "none")};

    &:hover {
        transform: rotateZ(90deg) translateY(30%);
        &::after {
            background-color: ${componentsTheme.interactiveArrowHoverColor};
        }

    }
`

export default InteractiveArrow
