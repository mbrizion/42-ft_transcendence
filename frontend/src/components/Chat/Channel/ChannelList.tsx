import {ListItem} from '@mui/material'
import ChannelInterface from '../ChannelInterface';

export default function ChannelList ({channelInterfaces}:{channelInterfaces: ChannelInterface[]}) {

  return (
    <div  className='ChannelList'>
      {channelInterfaces && channelInterfaces.map((c) => {
        return <h3>{c.name}</h3>
      })}
    </div>
  )
}