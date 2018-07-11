import React, { Component } from 'react'
import ActionCable from 'actioncable'
import { Block, Heading, Flex } from 'reakit'
import Swal from 'sweetalert2'
import { get } from '../services/api'
import { RubBox, UsdBox, RublesValue, UsdValue, UsdSymbol } from '../styled-components/converter-components'
import { BubbleSpin, InteractiveArrow } from '../styled-components/components'
import RublesSymbol from './common/rubles-symbol'

class UsdRate extends Component {
  constructor(props) {
    super(props);
    this.cable = ActionCable.createConsumer()
    this.state = {
      rubles: null,
      isLoading: true
    }
  }

  render() {
    return (
      <div>
        <Heading paddingTop={10} textAlign="center" color="#e90">Курс доллара</Heading>
        <Heading as="h3" padding={30} textAlign="center">
            Отслеживай в реалтайме!
        </Heading>
        <Flex justifyContent="center" alignItems="center" margin="0 auto" width={300} height={160}>
            <UsdBox flex="1" padding={24}>
                <UsdValue>1</UsdValue>

                <UsdSymbol>
                    &#36;
                </UsdSymbol>
            </UsdBox>
            <Block>
                <InteractiveArrow animating={this.state.isLoading} fontSize="36px"/>
            </Block>
            <RubBox flex="1" padding={24}>
                {
                    this.state.isLoading ? <BubbleSpin margin="18px auto" size="4px" loading={true}/> :
                    <RublesValue>{this.state.rubles || '?'}</RublesValue>
                }
                <RublesSymbol/>
            </RubBox>
        </Flex>
      </div>
    )
  }

  componentDidMount() {
    this.setState({isLoading: true})

    get('/usd_rate/current').then(response => {
        if (response.data === undefined) {
            alert('ao')
            return
        }
        this.setState({
            rubles: response.data && response.data.rubles_to_show,
            isLoading: false
        })
    }).catch(err => {
        Swal({
            type: 'error',
            title: 'Ошибка сервера',
            timer: 1000,
        })
        this.setState({ isLoading: false })
    })

    this.cable.subscriptions.create('RateChangingChannel', {
      received: (data) => {
        this.setState({
            rubles: data.rubles_to_show,
            isLoading: false,
        })
      }
    })
  }
}

export default UsdRate
