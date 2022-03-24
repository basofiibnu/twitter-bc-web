import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { client } from '../lib/client';

export const TwitterContext = createContext();

export const TwitterProvider = ({ children }) => {
  const [appStatus, setAppStatus] = useState();
  const [currentAccount, setCurrentAccount] = useState('');

  const router = useRouter();

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

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

  return (
    <TwitterContext.Provider
      value={{ appStatus, currentAccount, connectToWallet }}
    >
      {children}
    </TwitterContext.Provider>
  );
};
