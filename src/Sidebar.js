import { Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChatIcon from '@material-ui/icons/Chat';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import React, { useEffect } from 'react'
import './Sidebar.css'
import SidebarChat from './SidebarChat';
import { useState } from 'react';
import db from './firebase';
import { useStateValue } from './StateProvider';
import { actionTypes } from "./reducer";
import MobileChat from './MobileChat.js';


function Sidebar() {


    const [rooms, setRooms] = useState([]);
    const [{ user, showSidebarChat }, dispatch] = useStateValue();

    useEffect(() => {
        const unsubscribe = db.collection('rooms').onSnapshot(Snapshot => (
            setRooms(Snapshot.docs.map(doc =>
            ({
                id: doc.id,
                data: doc.data(),
            })
            ))
        )
        );
        return () => {
            unsubscribe();
        }
    }, []);

  // console.log(showSidebarChat, "showSidebarChat -----");

    return (
      <div
        className="sidebar rounded-lg">
        {showSidebarChat && (
        <div className="sidebar_header">
          <Avatar src={user?.photoURL} />
          <div className="sidebar__headerRight">
            <IconButton>
              <DonutLargeIcon />
            </IconButton>

            <IconButton>
              <ChatIcon />
            </IconButton>

            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </div>
        </div>)}

        {showSidebarChat && (
        <div className="sidebar_search">
          <div className="sidebar_searchContainer">
            <SearchOutlinedIcon />
            <input placeholder="Search or start new chat" type="text" />
          </div>
        </div>)}

        {showSidebarChat ? (
          <div className="sidebar_chat overflow-hidden">
            <SidebarChat addNewChat />
            {rooms.map((room) => (
              <SidebarChat key={room.id} id={room.id} name={room.data.name} />
            ))}
          </div>
        ) : (
          <MobileChat />
        )}
      </div>
    );
}

export default Sidebar