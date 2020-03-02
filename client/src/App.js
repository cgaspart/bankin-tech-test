import React, {useEffect, useState} from 'react';
//import {Card} from 'semantic-ui-react'
import axios from 'axios'
import './App.css';

const App = () => {
 const [account, setAccount] = useState()
  useEffect(() => {
    console.log('hello')
    axios.get('http://localhost/getAccount')
    .then(res => {
      setAccount(res.data)
      console.log(res.data)
    })
    .catch(err => {console.log(err)})
  }, [account])

  return (
    <p>hello</p>
  )
}

export default App;
