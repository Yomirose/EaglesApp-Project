import React from 'react';
import { sidebarData } from "../../util/sidebarData";
import "./sidebar.css";

const Sidebar = () => {
  return (
    <div className='container'>
      <div className='wrapper'>
        {sidebarData.map((data) => (
          <div key={crypto.randomUUID()} className='item'>
            {data.icon}
            <span className='text'>{data.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar;