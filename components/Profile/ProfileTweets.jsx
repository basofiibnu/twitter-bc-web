import React, { useContext } from 'react';
import { TwitterContext } from '../../context/TwitterContext';
import Post from '../Post';

const style = {
  wrapper: `no-scrollbar`,
  header: `sticky top-0 bg-[#15202b] z-10 p-4 flex justify-between items-center`,
  headerTitle: `text-xl font-bold`,
};

const ProfileTweets = () => {
  const { currentUser } = useContext(TwitterContext);
  return (
    <div className={style.wrapper}>
      {currentUser.tweets?.map((tweet, index) => (
        <Post
          key={index}
          displayName={currentUser.name}
          userName={`${currentUser.walletAddress.slice(
            0,
            3,
          )}...${currentUser.walletAddress.slice(37)}`}
          avatar={currentUser.profileImage}
          text={tweet.tweet}
          isProfileImageNft={currentUser.isProfileImageNft}
          timestamp={tweet.timestamp}
        />
      ))}
    </div>
  );
};

export default ProfileTweets;
