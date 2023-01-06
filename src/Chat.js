import React, { useEffect } from "react";
import { Avatar, IconButton } from "@material-ui/core";
import { useState } from "react";
import AttachFile from "@material-ui/icons/AttachFile";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import { useStateValue } from "./StateProvider";
import MoreVert from "@material-ui/icons/MoreVert";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import MicIcon from "@material-ui/icons/Mic";
import SendIcon from "@material-ui/icons/Send";
import "./Chat.css";
import { useParams } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import db from "./firebase";
import { actionTypes } from "./reducer";

function Chat() {
  const [input, setInput] = useState("");
  const [speed, setSpeed] = useState("");
  const { roomId } = useParams();
          console.log(useParams());

  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user, isMobile, showSidebarChat }, dispatch] = useStateValue();

          // const [isMobile, setMobile] = useState(true);

          useEffect(() => {
            if (window.innerWidth > 767) {
              dispatch({
                type: actionTypes.SET_MOBILE,
                isMobile: false,
              });
              // setMobile(false);
            } else {
              dispatch({
                type: actionTypes.SET_MOBILE,
                isMobile: true,
              });
              // setMobile(true);
            }

            const updateMedia = () => {
              if (window.innerWidth > 767) {
                dispatch({
                  type: actionTypes.SET_MOBILE,
                  isMobile: false,
                });
                // setMobile(false);
              } else {
                dispatch({
                  type: actionTypes.SET_MOBILE,
                  isMobile: true,
                });
                // setMobile(true);
              }
            };
            window.addEventListener("resize", updateMedia);
            return () => window.removeEventListener("resize", updateMedia);
          }, []);

  // console.log({messages, roomId, roomName})


  useEffect(() => {
      console.log("roomID", roomId);

    if (roomId) {
      console.log("roomID", roomId,);

      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [roomId]);

  useEffect(() => {
    setSpeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    // console.log("you type >>>>", input);

    db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      // name: user?.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInput("");
  };

  const handleClick = () => {
    dispatch({
      type: actionTypes.SET_SIDEBARCHAT,
    });
  };

  return (
    <>
      {!isMobile && (
      <div className="chat">
        <div className="chat_header">
          <Avatar src={`https://www.svgrepo.com/show/61986/avatar.svg`} />
          <div className="chat__headerInfo">
            <h3>{roomName}</h3>
              <p>
                Last seen{" "}
                {new Date(
                  messages[messages.length - 1]?.timestamp?.toDate()
                ).toUTCString()}
              </p>
          </div>
          <div className="chat__headerRight">
            <IconButton>
              <SearchOutlined />
            </IconButton>
            <IconButton>
              <AttachFile />
            </IconButton>
            <IconButton>
              <MoreVert />
            </IconButton>
          </div>
        </div>

        <div className={`chat__body bg-yellow-500 p-8 overflow-scroll h-[200%]`}>
          {messages.map((message) => (
            <p
              className={`chat__message ${
                message.name === user?.displayName && "chat__receiver"
              } `}
            >
              <span className="chat__name">{message.name}</span>
              {message.message}
              <span className="chat__timestamp">
                {new Date(message.timestamp?.toDate()).toUTCString()}
              </span>
            </p>
          ))}
        </div>

        <div className="chat__footer my-2">
          <EmojiEmotionsIcon />
          <form>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message"
              type="text"
            />
            <button onClick={sendMessage} type="submit" className="iconButton">
              <SendIcon />
            </button>
          </form>
          <MicIcon />
        </div>
      </div>
      )}
    </>
  );
}

export default Chat;
