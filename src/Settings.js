import React from 'react'
import {Form} from 'semantic-ui-react'

export class Settings extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      settings: props.settings
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e, {name, value}) {
    this.setState({
      settings: Object.assign({}, this.state.settings, {[name]: value})
    })
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.settings !== prevState.settings) {
      this.props.saveSettings(this.state.settings)
    }
  }

  render () {
    return <Form className='settings'>
      <Form.Group widths='equal'>
        <Form.Input
          label='Source URL'
          name='sourceUrl'
          value={this.state.settings.sourceUrl || ''}
          onChange={this.handleChange}
        />
      </Form.Group>
    </Form>
  }
}
