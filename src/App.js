import React from 'react'
import {ipcRenderer} from 'electron'
import {Tab} from 'semantic-ui-react'
import {reject, append, ifElse, always, pick, unless, pipe, values} from 'ramda'

import {CategoryView} from './CategoryView'
import {ChannelList} from './ChannelList'
import {Settings} from './Settings'

export class App extends React.Component {
  constructor (props) {
    super(props)
    const storedState = JSON.parse(window.localStorage.getItem('state') || '{}')
    this.state = {
      channels: [],
      favourite: storedState.favourite || [],
      settings: storedState.settings || {}
    }
    this.state.settings.sourceUrl && this.getChannels(this.state.settings.sourceUrl)
    this.setFavourite = this.setFavourite.bind(this)
    this.saveSettings = this.saveSettings.bind(this)
  }

  saveSettings (settings) {
    this.setState({settings})
  }

  setFavourite (channel, isFav) {
    this.setState({
      favourite: ifElse(always(isFav),
        append(channel.name),
        reject(name => name === channel.name)
      )(this.state.favourite)
    })
  }

  getChannels (sourceUrl) {
    ipcRenderer.send('getChannels', sourceUrl)
  }

  componentDidMount () {
    ipcRenderer.on('channels', (e, message) => {
      const channels = JSON.parse(message).channels
      this.setState({channels})
    })
  }

  componentDidUpdate (prevProps, prevState) {
    if (
      this.state.favourite !== prevState.favourite ||
      this.state.settings !== prevState.settings
    ) {
      window.localStorage.setItem('state', JSON.stringify({
        favourite: this.state.favourite,
        settings: this.state.settings
      }))
    }
    if (this.state.settings.sourceUrl !== prevState.settings.sourceUrl) {
      this.getChannels(this.state.settings.sourceUrl)
    }
  }

  render () {
    const {setFavourite, saveSettings, state: {channels, favourite, settings}} = this
    const panes = {
      favourite: {
        menuItem: 'Favourite',
        render: () => <ChannelList
          onlyFavourite
          channels={channels}
          setFavourite={setFavourite}
          favourite={this.state.favourite}
        />
      },
      categories: {
        menuItem: 'By category',
        render: () => <CategoryView
          channels={channels}
          setFavourite={setFavourite}
          favourite={favourite}
        />
      },
      allChannels: {
        menuItem: 'All channels',
        render: () => <ChannelList
          channels={channels}
          setFavourite={setFavourite}
          favourite={favourite}
        />
      },
      settings: {
        menuItem: 'Settings',
        render: () => <Settings
          settings={settings}
          saveSettings={saveSettings}
        />
      }
    }
    return <Tab
      menu={{borderless: true, attached: false, tabular: false, secondary: true, pointing: true}}
      panes={pipe(
        unless(always(channels.length), pick(['settings'])),
        values
      )(panes)}
    />
  }
}
