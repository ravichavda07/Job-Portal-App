import React, { useContext, useRef } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);

  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current?.value || '',
      location: locationRef.current?.value || ''
    });
    setIsSearched(true);
  };

  return (
    <div className="container mx-auto 2xl:px-20 my-10">
      <div className="bg-gradient-to-r from-gray-400 to-gray-700 text-white py-16 text-center mx-2 rounded-xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
          On - Campus Placement
        </h2>
        <p className="mb-8 max-w-xl mx-auto text-sm font-light px-5">
          You can find your carear start company and may bright your future!
          Best Wishes...
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto">
          <div className="flex items-center w-full sm:w-auto">
            <img className="h-4 sm:h-5" src={assets.search_icon} alt="Search Icon" />
            <input
              type="text"
              placeholder="Search for Jobs"
              className="max-sm:text-xs p-2 rounded outline-none w-full"
              ref={titleRef}
            />
          </div>

          <div className="flex items-center w-full sm:w-auto mt-2 sm:mt-0 sm:ml-2">
            <img className="h-4 sm:h-5" src={assets.location_icon} alt="Location Icon" />
            <input
              type="text"
              placeholder="Location"
              className="max-sm:text-xs p-2 rounded outline-none w-full"
              ref={locationRef}
            />
          </div>

          <button
            onClick={onSearch}
            className="bg-blue-600 px-6 py-2 rounded text-white m-2 sm:m-1"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
