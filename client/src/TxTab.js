import React from 'react'
import { Icon, Table } from 'semantic-ui-react'

const TxTab = (props) => {

    const currency = {
        GBP: <Icon name='gbp'/>,
        USD: <Icon name='usd'/>,
        EUR: <Icon name='eur'/>,
        AUD: ' AUD'
    }

    return (
        <>
         <Table celled>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Amount</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
        <Table.HeaderCell>Notes</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
    {props.tx ? props.tx.map(tx => {
        return (
            <Table.Row>
        <Table.Cell>{tx.reference}</Table.Cell>
        <Table.Cell>{tx.legs[0].amount}{currency[tx.legs[0].currency]}</Table.Cell>
        <Table.Cell negative={tx.state == 'pending'}>{tx.state}</Table.Cell>
        <Table.Cell>{tx.legs[0].description}</Table.Cell>
      </Table.Row>
        )
    }) : null}
    </Table.Body>
    </Table>
        </>
    )
}

export default TxTab