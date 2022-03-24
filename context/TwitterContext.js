import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { client } from '../lib/client';

export const TwitterContext = createContext();

export const TwitterProvider = ({ children }) => {
  const [appStatus, setAppStatus] = useState();
  const [currentAccount, setCurrentAccount] = useState('');
  const [tweets, setTweets] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);

  const router = useRouter();

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  useEffect(() => {
    if (!currentAccount || appStatus !== 'connected') return;
    getCurrentUserInfo(currentAccount);
    fetchTweets();
  }, [currentAccount, appStatus]);

  const checkIfWalletConnected = async () => {
    if (!window.ethereum) return setAppStatus('noMetaMask');

    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_accounts',
      });

      if (addressArray.length > 0) {
        setAppStatus('connected');
        setCurrentAccount(addressArray[0]);
        createUserAccount(addressArray[0]);
      } else {
        router.push('/');
        setAppStatus('notConnected');
      }
    } catch (error) {
      setAppStatus('error');
    }
  };

  const connectToWallet = async () => {
    if (!window.ethereum) return setAppStatus('noMetaMask');
    try {
      setAppStatus('loading');

      const addressArray = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (addressArray.length > 0) {
        setCurrentAccount(addressArray[0]);
        createUserAccount(addressArray[0]);
        setAppStatus('connected');
      } else {
        router.push('/');
        setAppStatus('notConnected');
      }
    } catch (error) {
      setAppStatus('error');
    }
  };

  const createUserAccount = async (
    userWalletAddress = currentAccount,
  ) => {
    if (!window.ethereum) return setAppStatus('noMetaMask');
    try {
      const userDoc = {
        _type: 'users',
        _id: userWalletAddress,
        name: 'Unnamed',
        isProfileImageNft: false,
        profileImage:
          'https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg',
        walletAddress: userWalletAddress,
      };

      await client.createIfNotExists(userDoc);
    } catch (error) {
      router.push('/');
      setAppStatus('error');
    }
  };

  const fetchTweets = async () => {
    const query = `
      *[_type == "tweets"]{
        "author": author->{name, walletAddress, profileImage, isProfileImageNft},
        tweet,
        timestamp
      }|order(timestamp desc)
    `;

    const response = await client.fetch(query);
    setTweets([]);

    response.forEach(async (item) => {
      const profileImageUrl = await getProfileImageUrl(item.author.profileImage, item.author.isProfileImageNft)
      const newItem = {
        tweet: item.tweet,
        timestamp: item.timestamp,
        author: {
          name: item.author.name,
          walletAddress: item.author.walletAddress,
          isProfileImageNft: item.author.isProfileImageNft,
          profileImage: profileImageUrl,
        },
      };
      setTweets((prevState) => [...prevState, newItem]);
    });
  };

  const getProfileImageUrl = async (imageUrl, isNft)=> {
    if(isNft) {
      return `https://gateway.pinata.cloud/ipfs/${imageUrl}`
    } else {
      return imageUrl
    }
  }

  const getCurrentUserInfo = async (userAccount = currentAccount) => {
    if (appStatus !== 'connected') return;

    const query = `
        *[_type == 'users' && _id == '${userAccount}']{
            'tweets': tweets[]->{timestamp, tweet}|order(timestamp desc),
            name,
            profileImage,
            isProfileImageNft,
            coverImage,
            walletAddress,
        }
      `;

    const response = await client.fetch(query);

    const profileImageUrl = await getProfileImageUrl(response[0].profileImage, response[0].isProfileImageNft)
    
    setCurrentUser({
      tweets: response[0].tweets,
      name: response[0].name,
      profileImage: profileImageUrl,
      isProfileImageNft: response[0].isProfileImageNft,
      coverImage: response[0].coverImage,
      walletAddress: response[0].walletAddress,
    });
  };

  return (
    <TwitterContext.Provider
      value={{
        appStatus,
        currentAccount,
        connectToWallet,
        fetchTweets,
        tweets,
        currentUser,
        getCurrentUserInfo,
      }}
    >
      {children}
    </TwitterContext.Provider>
  );
};
