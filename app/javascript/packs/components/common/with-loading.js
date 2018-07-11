import React from 'react'
import BubbleSpin from '../../styled-components/components/bubble-spin'

const WithLoading = (Component) => {
    return ({ isLoading, ...props }) => {
        if (isLoading) {
            return <BubbleSpin loading={true}/>
        }
        return <Component {...props}/>
    }
}

export default WithLoading
