import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-white p-4 shadow rounded-b-2xl">
      <div className="flex items-center gap-4">
        <img src={require('../../assets/icons/phygen-icon.png')} alt="Logo" className="h-12 w-12 rounded-full" />
        <button className="p-2 rounded-lg hover:bg-blue-50">
          <img src={require('../../assets/icons/square-menu.svg').default} alt="Menu" className="w-7 h-7" />
        </button>
      </div>
      <div className="flex gap-8">
        <a href="#about" className="text-sky-500 font-semibold text-lg hover:text-sky-700 transition">About</a>
        <a href="#feature" className="text-sky-500 font-semibold text-lg hover:text-sky-700 transition">Feature</a>
        <a href="#contact" className="text-sky-500 font-semibold text-lg hover:text-sky-700 transition">Contact</a>
      </div>
      <div className="flex items-center gap-5">
        <img src={require('../../assets/icons/bell-dot.svg').default} alt="Notification" className="w-7 h-7 rounded-full hover:bg-blue-50 cursor-pointer" />
        <img src={require('../../assets/icons/setting-icon.png')} alt="Settings" className="w-7 h-7 rounded-full hover:bg-blue-50 cursor-pointer" />
        <img src={require('../../assets/icons/avatar.jpg')} alt="Avatar" className="w-9 h-9 rounded-full border-2 border-gray-200 object-cover" />
      </div>
    </nav>
  );
};

export default Navbar; 