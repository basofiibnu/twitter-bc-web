import React from 'react';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileTweets from '../components/Profile/ProfileTweets';
import Sidebar from '../components/Sidebar';
import Widgets from '../components/Widgets';

const style = {
  wrapper: `flex justify-center h-full w-screen select-none bg-[#15202b] text-white`,
  content: `max-w-[1400px] w-3/4 mx-auto flex justify-between`,
  mainContent: `flex-[2] border-r border-l border-[#38444d] overflow-y-scroll`,
};

const Profile = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <Sidebar />
        <div className={style.mainContent}>
          <ProfileHeader />
          <ProfileTweets />
        </div>
        <Widgets />
      </div>
    </div>
  );
};

export default Profile;
