import React from 'react'
import {pipe, groupBy, mapObjIndexed, prop, values} from 'ramda'

import {Tab} from 'semantic-ui-react'

import {ChannelList} from './ChannelList'

export class CategoryView extends React.Component {
  render () {
    const panes = pipe(
      groupBy(prop('cat')),
      mapObjIndexed(
        (categoryChannels, category) => ({
          menuItem: category,
          render: () => <ChannelList
            channels={categoryChannels}
            setFavourite={this.props.setFavourite}
            favourite={this.props.favourite}
          />
        })),
      values
    )(this.props.channels)
    return <Tab
      menu={{borderless: true, fluid: true, vertical: true, secondary: true}}
      grid={{paneWidth: 10, tabWidth: 6}}
      panes={panes}
    />
  }
}
