import React, { Component } from 'react'
import moment from 'moment'
import Swal from 'sweetalert2'

import { Russian } from 'flatpickr/dist/l10n/ru.js'
import { Button, Field, Label, Inline, InlineBlock, Hidden, Group, Popover, Paragraph, Flex, Block, Base, Heading } from 'reakit'

import { Errors, BubbleSpin, Flatpickr, Input } from '../../styled-components/components'
import LoadingOrComponent from '../common/loading-or-component'
import { get, put } from '../../services/api'

import 'flatpickr/dist/themes/dark'

class Panel extends Component {
    state = {
                rubles: null,
                filled_rubles: null,
                filled_rubles_discontinues_at: moment().add(2, 'm').toDate(),
                previous_filled_rubles_discontinues_at: null,
                templateValues: {
                    minDateForDiscontinues: new Date(),
                },
                states: {
                    isFetching: true,
                    isSubmitting: false,
                },
                errors: {},
            }
    constructor(props) {
        super(props)
        this.handleNewRateSubmit = this.handleNewRateSubmit.bind(this)
        this.handleFilledRublesChange = this.handleFilledRublesChange.bind(this)
        this.handleDiscontinuesAtChange = this.handleDiscontinuesAtChange.bind(this)
    }

  render() {
    const {
        rubles,
        filled_rubles,
        filled_rubles_discontinues_at,
        previous_filled_rubles_discontinues_at,
        templateValues,
        states,
        errors
    } = this.state
    const isLoading = states.isFetching || states.isSubmitting
    const previousDiscontinuesPassed = previous_filled_rubles_discontinues_at && moment(previous_filled_rubles_discontinues_at).isSameOrAfter(moment())
    const filledRublesErrored = !!(filled_rubles && errors.filled_rubles)

    return (
        <Block relative margin="0 auto" padding={10} opacity={isLoading ? 0.3 : 1} width="390px">
            <Heading as="h3" padding={20}>Установка форсированного курса</Heading>

            <Hidden visible={isLoading} transform="translate(-50%, -50%)" top="50%" left="50%" position="absolute">
                <BubbleSpin margin="20px auto" size="6px" loading={true}/>
            </Hidden>

            <form>
                <Group vertical>
                    <Field padding={18}>
                        <Label>Значение реального курса</Label>
                        <Input disabled color="#7a7a7a" borderColor="#f9fcfa" backgroundColor="#f5f5f5" value={rubles || ''}/>
                    </Field>

                    <Field padding={18}>
                        <Label htmlFor="filled_rubles">Форсированный курс</Label>
                        <Input errored={filledRublesErrored} type="number" id="filled_rubles" name="filled_rubles" value={this.state.filled_rubles || ''} onChange={this.handleFilledRublesChange}/>
                        { errors.filled_rubles &&
                            <Block>
                                <Errors>
                                    {errors.filled_rubles.join(', ')}
                                </Errors>
                            </Block>
                        }
                    </Field>

                    <Group padding={0} justifyContent="space-between" alignItems="flex-start">
                        <Field as={Group.Item} border={0} flex="2" padding={18}>
                            <Base>
                                <Label htmlFor="filled_rubles_discontinues_at">Период действия форсированного курса</Label>
                                <Flatpickr data-enable-time
                                    id="filled_rubles_discontinues_at"
                                    options={{
                                        locale: Russian,
                                        minDate: templateValues.minDateForDiscontinues,
                                        time_24hr: true,
                                        minuteIncrement: 1,
                                    }}
                                    value={this.state.filled_rubles_discontinues_at}
                                    onChange={this.handleDiscontinuesAtChange} />
                                { errors.filled_rubles_discontinues_at &&
                                    <Errors paddingTop={8}>
                                        {errors.filled_rubles_discontinues_at.join(',')}
                                    </Errors>
                                }
                            </Base>
                        </Field>
                        <Field as={Group.Item} flex="1" border={0} borderLeft={"1px dotted #ed09cd"} padding={18}>
                            <Label textAlign="center">Предыдущее значение</Label>
                            <LoadingOrComponent loading={isLoading}>
                                {
                                    previous_filled_rubles_discontinues_at ?
                                    <Base textAlign="center">
                                        <InlineBlock whiteSpace="nowrap" fontSize="0.8em" padding={4}>
                                            {`${moment(previous_filled_rubles_discontinues_at).format('DD-MM-YY HH:mm')}`}
                                        </InlineBlock>
                                        <InlineBlock fontSize="0.7em" color={previousDiscontinuesPassed ? "green" : "blue"}>
                                            {`(${previousDiscontinuesPassed ? 'активно' : 'прошло'})`}
                                        </InlineBlock>
                                    </Base> :
                                    <Base textAlign="center" whiteSpace="nowrap" padding={4} color="#7135ca"><Inline fontSize="0.75em">не установлено</Inline></Base>
                                }
                            </LoadingOrComponent>
                        </Field>
                    </Group>
                </Group>
                <Base textAlign="center" paddingTop={14}>
                    <Button disabled={states.isSubmitting} onClick={this.handleNewRateSubmit}>
                        Обновить
                        <Hidden visible={isLoading}>
                            <BubbleSpin margin="0 10px" loading={true}/>
                        </Hidden>
                    </Button>
                </Base>
            </form>
        </Block>
    )
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData() {
    const { states } = this.state
    this.resetFields()

    this.setState({
        states: {
            ...states,
            isFetching: true
        }
    })
    get('/usd_rate/current').then(response => {
        this.setState({
            rubles: response.data.rubles,
            filled_rubles: response.data.filled_rubles,
            previous_filled_rubles_discontinues_at: response.data.filled_rubles_discontinues_at,
            states: {
                ...states,
                isFetching: false
            }
        })
    }).catch(err => {
        Swal({
            type: 'error',
            title: 'Ошибка сервера',
            timer: 1000,
        })
        this.setState({
            states: {
                ...states,
                isFetching: false
            }
        })
    })
  }

  resetFields() {
    this.setState({
        rubles: null,
        filled_rubles: null,
        previous_filled_rubles_discontinues_at: null,
    })
  }

  handleNewRateSubmit(e) {
    e.preventDefault()
    const { filled_rubles, filled_rubles_discontinues_at, states, errors } = this.state

    this.setState({
        errors: {},
        states: {
            ...states,
            isSubmitting: true,
        }
    })

    put('/usd_rate/refresh', {
        usd_rate: {
            filled_rubles,
            filled_rubles_discontinues_at
        }
    }).then(response => {
        Swal({
            type: 'success',
            title: 'Данные обновлены!',
            timer: 1500,
        })
        this.setState({
            states: {
                ...states,
                isSubmitting: false,
            }
        })
        this.fetchData()
    }).catch(err => {
        if (!err.response.data.errors || err.response.data.errors.length === 0) {
            Swal({
                type: 'error',
                title: 'Ошибка сервера',
                timer: 1500,
            })
            this.setState({
                states: {
                    ...states,
                    isFetching: false,
                }
            })
            return;
        }

        this.setState({
            errors: err.response.data.errors,
            states: {
                ...states,
                isSubmitting: false,
            }
        })
    })
  }

  handleFilledRublesChange(e) {
    this.setState({filled_rubles: e.target.value})
  }

  handleDiscontinuesAtChange(dates) {
    const newFilledRublesDiscontinuesAt = dates[0]
    let filled_rubles_discontinues_at
    if (moment().isSameOrBefore(moment(newFilledRublesDiscontinuesAt))) {
        filled_rubles_discontinues_at = newFilledRublesDiscontinuesAt
    } else {
        filled_rubles_discontinues_at = moment().add(2, 'm').toDate()
    }
    this.setState({ filled_rubles_discontinues_at  })
  }
}

export default Panel
