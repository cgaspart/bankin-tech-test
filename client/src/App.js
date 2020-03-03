import React, {useEffect, useState} from 'react';
import { Card, Grid, Header, Icon, Divider, Form } from 'semantic-ui-react'
import axios from 'axios'

import AccountCard from './AccountCard'
import GetTx from './GetTx'
import './App.css';


const App = () => {

  const [accounts, setAccounts] = useState([])
  useEffect(() => {
    axios.get('http://localhost/getAccount')
    .then(res => {setAccounts(res.data)})
    .catch(err => {console.log(err)})
  }, [])

  return (
    <>
    <Grid columns='equal' style={{ height: '2vh' }} verticalAlign='top'>
        </Grid>
        <Grid columns='equal' textAlign='center' style={{ height: '10hv', paddingBottom: '2vh' }} verticalAlign='top'>
          <Grid.Column width={3}>
            <Header as='h2' id='Hsale'>
              <Icon name='dashboard' />
              Revolut DashBoard
          </Header>
          </Grid.Column>
        </Grid>
        <Divider />
    <Card.Group className='App-header'>
      <AccountCard accounts={accounts} />
    </Card.Group>
    <Grid textAlign='center' verticalAlign='top' columns='equal' style={{paddingTop: '5vh'}}>
      <GetTx />        
    </Grid>
    <Divider />
    <Grid textAlign='center' verticalAlign='top' columns='equal' style={{paddingTop: '5vh'}}>
      <GetTx />        
    </Grid>
    </>
  )
}

export default App;
