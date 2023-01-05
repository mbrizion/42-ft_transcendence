import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { socket } from "../App";

export default function Auth() {
  // VARIABLES \\

  const [cookie, setCookie] = useCookies(["jwtToken", "displayName", "qrcode"]);
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  const code = queryParameters.get("code");
  const state = queryParameters.get("state");
  const [qrcode, setQrcode] = useState<string>("");
  const [displayqrcode, setDisplayqrcode] = useState<boolean>(false);
  const [displayqrcodeMessage, setDisplayqrcodeMessage] =
    useState<string>("Display QR Code");

  // FUNCTIONS \\

  axios
    .post("https://api.intra.42.fr/oauth/token", {
      grant_type: "authorization_code",
      client_id: process.env.REACT_APP_CLIENT_ID,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
      code: code,
      state: state,
      redirect_uri: "http://localhost:3000/auth",
    })
    .then((res) => getIntraMe(res.data))
    .catch((err) => console.log(err));

  const getIntraMe = (data: { access_token: string }) => {
    axios
      .get("http://localhost:3001/auth/intra/getMe", {
        params: {
          token: data.access_token,
        },
      })
      .then((res) => updateUserSocket())
      .catch((err) => handleIntraErr(err));
  };

  const updateUserSocket = () => {
    axios
      .put("http://localhost:3001/user/modifySocketId", {
        socketId: socket.id,
      })
      .then((res) => socket.emit("reload"))
      .catch((err) => console.log(err));
  };

  const handleIntraErr = (err: AxiosError) => {
    if (err.response) {
      if (err.response.status == 460) {
        alert("You are already log in from an other device");
      } else if (err.response.status == 403) {
        alert("Your credentials are already taken");
      }
    } else console.log(err);
    navigate("/");
  };

  const displayQrcode = () => {
    setDisplayqrcode(!displayqrcode);
    if (!displayqrcode) setDisplayqrcodeMessage("Hide QR Code");
    else setDisplayqrcodeMessage("Display QR Code");
  };

  const goHome = () => {
    navigate("/");
  };

  // USE_EFFECT \\

  useEffect(() => {
    socket.on("reload", reloadListener);
    return () => {
      socket.off("reload", reloadListener);
    };
  }, []);

  useEffect(() => {
    if (cookie.qrcode !== undefined && cookie.qrcode === "yes") {
      axios
        .get("http://localhost:3001/user/qrcode")
        .then((res) => setQrcode(res.data))
        .catch((err) => console.log(err));
    }
  }, []);

  // LISTENER \\

  const reloadListener = () => {
    window.location.reload();
  };

  return (
    <>
      <div>
        <h1>Welcome {cookie.displayName} to ft_transcendence!</h1>
      </div>
      <div>
        {qrcode && (
          <button onClick={displayQrcode} className="submit-btn">
            {displayqrcodeMessage}
          </button>
        )}
        {displayqrcode && (
          <img src={qrcode} alt="qrcode" style={{ width: "400px" }}></img>
        )}
      </div>
      <div>
        <button onClick={goHome}>Go to home page</button>
      </div>
    </>
  );
}
