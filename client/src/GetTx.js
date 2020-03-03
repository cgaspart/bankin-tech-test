import React, {useState} from 'react'
import {Grid, Form} from 'semantic-ui-react'
import { DateTimeInput } from 'semantic-ui-calendar-react';

const GetTx = () => {

    const [{startDate, endDate}, setState] = useState({startDate: '', endDate: ''})

    function handleDateChange(event, { name, value }){
        setState(prevState => ({ ...prevState, [name]: value }));
      }

    return (
        <>
        <Grid.Column>
                <Form.Field>
                  <label>Start Date</label>
                  <DateTimeInput
                    id='startDate'
                    name="startDate"
                    dateTimeFormat='YYYY-MM-DD HH:mm'
                    value={startDate}
                    iconPosition="left"
                    onChange={handleDateChange}
                  />
                </Form.Field>
              </Grid.Column>
              <Grid.Column>
              <Form.Field>
                  <label>End Date</label>
                  <DateTimeInput
                    id='endDate'
                    name="endDate"
                    dateTimeFormat='YYYY-MM-DD HH:mm'
                    value={endDate}
                    iconPosition="left"
                    onChange={handleDateChange}
                  />
                </Form.Field>
              </Grid.Column>
        </>
    )
}

export default GetTx