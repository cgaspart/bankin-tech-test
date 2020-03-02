import React from 'react';
import { Card, Icon } from 'semantic-ui-react'

const AccountCard = (props) => {
    console.log(props.accounts)
  const currency = {
      GBP: <Icon name='gbp'/>,
      USD: <Icon name='usd'/>,
      EUR: <Icon name='eur'/>,
      AUD: ' AUD'
  }
  return (
    <>
      {props.accounts ? props.accounts.map(account => {
          return (
            <Card key={account.id} style={{width: '45vh', height: '20vh'}}>
            <Card.Content>
                <Card.Header>{account.name}</Card.Header>
                <Card.Meta>{account.state}</Card.Meta>
            <Card.Description>
              <span style={{color: 'green'}}>{account.balance}</span>
              {currency[account.currency]}
            </Card.Description>
          </Card.Content>
        </Card> 
          )
      }) : null}
    </>
  )
}

export default AccountCard;
