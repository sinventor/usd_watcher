import styled from 'styled-components'
import { Input } from 'reakit'
import settings from '../settings'

export default styled(Input)`
    border-width: '1px';
    border-color: ${props => props.errored ? 'red' : settings.inputBorderColor};
    outline: none;

    &:focus {
        border: 1px solid rgba(81, 203, 238, 1);
        box-shadow: 0 0 5px rgba(81, 203, 238, 1);
    }
`
