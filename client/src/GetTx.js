import React, {useState} from 'react'
import {Grid, Form, Button} from 'semantic-ui-react'
import { DateInput } from 'semantic-ui-calendar-react';

class GetTx extends React.Component {
    constructor(props) {
      super(props);
   
      this.state = {
        startDate: '',
        endDate: ''
      };
    }
   
    handleChange = (event, {name, value}) => {
      if (this.state.hasOwnProperty(name)) {
        this.setState({ [name]: value });
      }
    }
   
    render() {
      return (
        <>
        <Grid.Column>
                <Form.Field>
                  <label>Start Date</label>
                  <DateInput
                    id='startDate'
                    name="startDate"
                    dateTimeFormat='YYYY-MM-DD'
                    value={this.state.startDate}
                    iconPosition="left"
                    onChange={this.handleChange}
                  />
                </Form.Field>
              </Grid.Column>
              <Grid.Column>
                <Form.Field>
                  <Button
                    color='teal'
                    onClick={() => {this.props.updateTx(this.state.startDate, this.state.endDate)}}>Refresh</Button>
                </Form.Field>
              </Grid.Column>
              <Grid.Column>
              <Form.Field>
                  <label>End Date</label>
                  <DateInput
                    id='endDate'
                    name="endDate"
                    dateTimeFormat='YYYY-MM-DD'
                    value={this.state.endDate}
                    iconPosition="left"
                    onChange={this.handleChange}
                  />
                </Form.Field>
              </Grid.Column>
        </>
      )
    }
}

export default GetTx