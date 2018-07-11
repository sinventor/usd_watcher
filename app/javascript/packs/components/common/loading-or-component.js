import React from 'react'
import { BubbleSpin } from '../../styled-components/components'

const LoadingOrComponent = (props) => {
    if (props.loading) {
        return <BubbleSpin {...props}/>
    }

    return props.children
}

export default LoadingOrComponent
