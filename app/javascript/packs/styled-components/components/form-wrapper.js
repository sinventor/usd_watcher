import styled from 'styled-components'

const FormWrapper = styled.div.attrs({
    width: props => props.width || '350px',
    margin: props => props.margin || '0 auto',
    height: props => props.height || 'auto',
    backgroundColor:  props => props.backgroundColor || 'none',
    padding: props => props.padding || 0,
})`
    width: ${props => props.width};
    height: ${props => props.height};
    background-color: ${props => props.backgroundColor};
    margin: ${props => props.margin};
    padding: ${props => props.padding};
`

export default FormWrapper

