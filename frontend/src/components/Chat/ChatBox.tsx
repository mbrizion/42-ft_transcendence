import Navbar from '../Navbar';
import Chat from './Chat';
import ChannelInterface from './Interface/ChannelInterface';
import { useEffect, useState } from "react";
import { socket } from '../../App';
import { ListItem } from '@mui/material'
import axios from 'axios';
import Channel from './Sidebar/Channel';
import Sidebar from './Sidebar';
import ChannelPrivate from './Sidebar/ChannelPrivate'
import { TbRefresh } from 'react-icons/tb';
import { RiChat3Fill } from 'react-icons/ri';
import { RiChatPrivateFill } from 'react-icons/ri';
import { BsFillPeopleFill } from 'react-icons/bs';
import './chatbox.scss'

const Chatbox = () => {
  const [channelInterfaces, setchannelInterfaces] = useState<ChannelInterface[]>([])
  const [actualChannelInterface, setactualChannelInterface] = useState<ChannelInterface | undefined>()



  function refreshAllChannelInterfaces() {
    setchannelInterfaces([]);
    setactualChannelInterface(undefined);
    axios.get('http://localhost:3001/chat/sendAllChannelInterfaces', {
    }).then(res => console.log('OK')).catch(err => console.log(err));
  }

  function handleSelectChannel(channelId: number) {
    setactualChannelInterface(channelInterfaces.find((obj) => {
      return obj.id === channelId;
    }))
  }

  const channelList = channelInterfaces.map((c, i) => (
    <ListItem key={i} onClick={event => handleSelectChannel(c.id)} >
      {c.mode === "PUBLIC" ? <RiChat3Fill /> : ""}
      {c.mode === "PRIVATE" ? <RiChatPrivateFill /> : ""}
      {c.mode === "DIRECT" ? <BsFillPeopleFill /> : ""}
      <div className='list'>{c.name}</div>
    </ListItem>
  ))

  function refreshActualChannelInterface() {
    var channelId = actualChannelInterface?.id
    setactualChannelInterface(channelInterfaces.find((obj) => {
      return obj.id === channelId;
    }))
  }

  const concatChannelInterfaces = (channelInterface: ChannelInterface) => {
    var tmpChannelInterfaces: ChannelInterface[]
    tmpChannelInterfaces = channelInterfaces;
    let alreadyKnownChannel = 0
    for (let i = 0; i < tmpChannelInterfaces.length; i++) {
      if (tmpChannelInterfaces[i].id === channelInterface.id) {
        tmpChannelInterfaces[i] = channelInterface
        alreadyKnownChannel = 1
        break
      }
    }
    if (alreadyKnownChannel === 0) {
      tmpChannelInterfaces.push(channelInterface)
    }
    setchannelInterfaces([...tmpChannelInterfaces])
    refreshActualChannelInterface()
  }

  //use effect
  useEffect(() => {
    socket.on('channelInterface', concatChannelInterfaces)
    return () => {
      socket.off('channelInterface', concatChannelInterfaces)
    }
  })

  useEffect(() => {
    refreshAllChannelInterfaces()
  }, [])

  return (
    <div>
      <Navbar />
      <div className='chatbox'>
        <div className='Left-side-chat'>
          <div className='chatbox-container'>
            <div className='button_channel'>
              <Channel />
              <ChannelPrivate />
            </div>
            <div className='sidebar'>
              <div className='ChannelList'>
                <div className='header'>
                  <div className='title'>Your channels</div>
                  <TbRefresh className='refreshButton' onClick={refreshAllChannelInterfaces}></TbRefresh>
                </div>
                {channelList}
              </div>
              <Sidebar actualChannelInterface={actualChannelInterface} />
            </div>
          </div>
        </div>
        <div className='Right-side-chat'>
          <Chat actualChannelInterface={actualChannelInterface} />
        </div>
      </div>
    </div>
  )
}

export default Chatbox;
