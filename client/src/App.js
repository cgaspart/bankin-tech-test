import React, {useEffect, useState} from 'react';
import { Card } from 'semantic-ui-react'
import axios from 'axios'

import AccountCard from './AccountCard'
import './App.css';

const App = () => {
 const [accounts, setAccount] = useState()
  useEffect(() => {
    console.log('hello')
    axios.get('http://localhost/getAccount')
    .then(res => {setAccount(res.data)})
    .catch(err => {console.log(err)})
  }, [])

  return (
    <>
    <Card.Group className='App-header'>
      <AccountCard accounts={accounts} />
    </Card.Group>
    </>
  )
}

export default App;
