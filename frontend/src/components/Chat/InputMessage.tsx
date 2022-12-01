import React, { useState } from 'react'
import { IoSend } from "react-icons/io5";
import axios from 'axios';
import ChannelInterface from './ChannelInterface';

const MessageInput = ({ actualChannelInterface }: { actualChannelInterface: ChannelInterface | undefined }) => {
  const [value, setValue] = useState<string>("");
  const date = new Date();
  const time = date.getHours()
    + ':' + ((date.getMinutes() < 10 ? '0' : '') + date.getMinutes());

  const sendMessage = async () => {
    if (value === "") return false;
    console.log('debug')
    console.log(actualChannelInterface)
    console.log('/debug')
    if (actualChannelInterface) {
      axios.post('http://localhost:3001/chat/sendMessage', {
        channelId: actualChannelInterface.id,
        text: value,
      }).then(res => console.log(res)).catch(err => console.log(err))
    }


  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === "Enter" && value !== "") {
      e.preventDefault();

    }
  }
  return (
    <div className="messageInput">
      <textarea
        onChange={(e) => setValue(e.target.value)}
        placeholder=" Type your message..."
        value={value}
        rows={3}
        onKeyDown={handleKeyDown}
      />
      <IoSend size="40" onClick={sendMessage} className='iosend' />

    </div>
  )
}
export default MessageInput;