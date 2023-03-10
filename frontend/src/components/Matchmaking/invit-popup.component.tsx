import React, { useState, useEffect } from 'react';
import './style.scss';
import { socket } from '../../App';
import { useNavigate } from 'react-router-dom';

export default function InvitPopup() {

	// VARIABLES \\

	const navigate = useNavigate();
	const [invit, setInvit] = useState<boolean>(false);
	const [invitText, setInvitText] = useState<string>("");

	// FUNCTIONS \\

	const removeInvitPopup = () => {
		setInvit(false);
	}

	const acceptInvit = () => {
		const invitTextArray = invitText.split(" ");
		const senderDName = invitTextArray[invitTextArray.length - 1];
		socket.emit("invitation accepted", senderDName);
		navigate('/game');
		setInvit(false);
	}

	// USE_EFFECT \\

	useEffect(() => {
		socket.on("received invitation", receivedInvitationListener);
		return () => {
			socket.off("received invitation", receivedInvitationListener);
		}
	})

	useEffect(() => {
		socket.on("invitation accepted sender",
			invitAcceptedSenderListener);
		return () => {
			socket.off("invitation accepted sender",
				invitAcceptedSenderListener);
		}
	});

	// LISTENER \\

	const receivedInvitationListener = (senderName: string) => {
		setInvitText("You receive an invitation to pong game from ".concat(senderName));
		setInvit(true);
	}

	const invitAcceptedSenderListener = (gameRoom: string) => {
		socket.emit("invitation accepted sender", gameRoom);
		navigate('/game/live');
	}

	// RETURN \\

	return (invit) ? (
		<div className="invitPopup">
			<div className='Title_popup'><span style={{ color: 'White' }}>{invitText}</span>
				<br></br>
				<div className="btn" >
				<button className="btn_accept" onClick={() => acceptInvit()}>Accept</button>
				<button className="btn_close" onClick={() => removeInvitPopup()}>Close</button>
				</div>
		</div>
	</div>
	) : <></>;
}
