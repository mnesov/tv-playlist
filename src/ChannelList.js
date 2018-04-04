import React from 'react'
import {List, Rating} from 'semantic-ui-react'
import {pipe, filter, map, when, always, values} from 'ramda'

export class ChannelList extends React.Component {
  isFav (channel) {
    return Number(this.props.favourite.includes(channel.name))
  }
  render () {
    return <List className='channel-list' selection>
      {pipe(
        when(always(this.props.onlyFavourite),
          filter(channel => this.isFav(channel))
        ),
        map(channel =>
          <List.Item
            key={channel.name + channel.url}
            as='a'
            onClick={() => window.location.assign(`acestream://${channel.url}`)}
          >
            <List.Content floated='right' onClick={e => e.stopPropagation()}>
              <Rating
                icon='heart'
                defaultRating={this.isFav(channel)}
                onRate={(e, {rating}) => this.props.setFavourite(channel, rating)}
              />
            </List.Content>
            <List.Content>{channel.name}</List.Content>
          </List.Item>
        ),
        values
      )(this.props.channels)}
    </List>
  }
}
