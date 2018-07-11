import styled from 'styled-components'
import Flatpickr from 'react-flatpickr'
import settings from '../settings'

export default styled(Flatpickr)`
    border-width: 1px;
    border-color: ${props => props.errored ? 'red' : settings.inputBorderColor};
    padding: 14px;

    &:focus {
        border: 1px solid rgba(81, 203, 238, 1);
        box-shadow: 0 0 5px rgba(81, 203, 238, 1);
    }
`
