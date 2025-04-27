import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
return (
  <aside className="sidebar">
    <nav>
      <ul>
        <li><Link to="/">Driver Dashboard</Link></li>
      </ul>
    </nav>
  </aside>
);
};

export default Sidebar;