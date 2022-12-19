import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home';
import User from './components/User';
import LiveGame from './components/AbrunGame/live-game.component';
import io from 'socket.io-client';
import Auth from './components/Auth';
import axios from 'axios';
import ChatBox from './components/Chat/ChatBox'
import Profile from './components/Profile/Profile'
import NotFound from './components/NotFound';
import Game from './components/GameSetup';
import Friends from './components/Friends';

axios.defaults.withCredentials = true;

export let socket = io('http://localhost:4343', { withCredentials: true });

function App() {
	socket.emit('hello');

	useEffect(() => {
		socket.on("heyo", heyoListener);
		return () => {
			socket.off("heyo", heyoListener);
		}
	})

	const heyoListener = () => {
		axios.put('http://localhost:3001/user/modifySocketId', {
			socketId: socket.id
		})
			.then(res => socket.emit('is playing'))
			.catch(err => console.log(err));
	}

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path="/game" element={<Game />} />
			<Route path="/game/live" element={<LiveGame />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/ChatBox" element={<ChatBox />} />
        <Route path="/Profile" element={<Profile />} />
				<Route path="/friends" element={<Friends />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
