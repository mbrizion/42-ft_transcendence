import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import Navbar from './Navbar';
import { ListItem } from '@mui/material'
import io, { Socket } from 'socket.io-client';
import { useCookies } from 'react-cookie';
import { socket } from '../App';

type User = {
  email: string;
  displayName: string;
  imageUrl: string;
  id: number;
  socketId: string;
}

type FriendRequest = {
  creator: number;
  status: string;
}

const Friends = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [cookie] = useCookies(['displayName']);
  const [receivedFriendRequest, setReceivedFriendRequest] = useState<FriendRequest[]>([]);

  const sendFriendRequest = (receiverId: number, socketId: string) => {
    socket.emit("add friend", receiverId, socketId);
  }

  const userList = users.map((c, i) => (
    <ListItem key={i}> {
      <button onClick={event => sendFriendRequest(c.id, c.socketId)}> send </button>
    }
      {c.displayName}
    </ListItem >
  ))

  const receivedList = receivedFriendRequest.map((c, i) => (
    <ListItem key={i}> {
      <div className='accept | deny'>
        <button> accept </button>
        <button> deny  </button>
      </div>
    }
      {c.creator}
    </ListItem >
  ))

  // use effects
  useEffect(() => {
    axios.get('http://localhost:3001/user/users')
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  /*useEffect(() => {
    axios.get('http://localhost:3001/user/receivedfriendRequest')
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, []);*/

  useEffect(() => {
    socket.on("receive invitation", receiveFriendRequest);
    return () => {
      socket.off("receive invitation", receiveFriendRequest);
    }
  });

  // listeners

  const receiveFriendRequest = (request: FriendRequest) => {
    setReceivedFriendRequest([...receivedFriendRequest, request])
  }

  return (
    <div>
      <Navbar></Navbar>
      <h1>Users</h1>
      {userList}
      <div>
        <h1>friend requests</h1>
        {receivedList}
      </div>
    </div>
  )
}

export default Friends;



/*

client --> server
liste des tous les users (GET : getUsers()) => + bouton refresh
  bouton addFriend: PUT (userId: number)

Interfaces:
allUserInterface
userId : number
userName: string



server --> client
Liste des amis
a chaque connection / deconnection, le back envoie : + bouton refresh

Interfaces: 
friendsInterface
friendsNames: string
activity: boolean


userInterfaces
userId : number
userName: string
activity: boolean
*/
