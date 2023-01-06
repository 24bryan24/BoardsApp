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
import BackArrow from "./assets/BackArrow.svg";


function MobileChat() {
  const [input, setInput] = useState("");
  const [speed, setSpeed] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user, isMobile, showSidebarChat }, dispatch] = useStateValue();

  const fetchData = async () => {};

  console.log(useParams());

  console.log("roomName >>>", roomName);

  useEffect(() => {
      console.log("roomID", roomId);

    if (roomId) {
      console.log("roomID", roomId)
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
    <div className="chat">
      <div className="chat_header p-5 flex justify-between items-center">
        <img
          onClick={handleClick}
          className="w-4 h-4 cursor-pointer"
          src={BackArrow}
        />
        <div className="chat__headerInfo">
          <h3 className="text-[2.5rem]">{roomName}</h3>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <MoreVert fontSize="large" />
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
  );
}

export default MobileChat;
