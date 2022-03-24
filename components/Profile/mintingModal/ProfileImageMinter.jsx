import React, { useState, useContext } from 'react';
import { TwitterContext } from '../../../context/TwitterContext';
import { useRouter } from 'next/router';
import { client } from '../../../lib/client';
import { contractABI, contractAddress } from '../../../lib/constants';
// import { ethers } from 'ethers';
import InitialState from './InitialState';
import LoadingState from './LoadingState';
import FinishedState from './FinishedState';
import { pinJSONToIPFS, pinFileToIPFS } from '../../../lib/pinata';

const ProfileImageMinter = () => {
  const { currentAccount, setAppStatus } = useContext(TwitterContext);
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('initial');
  const [profileImage, setProfileImage] = useState();

  const mint = async () => {
    if (!name || !description || !profileImage) return;
    setStatus('loading');

    const pinataMetadata = {
      name: `${name} - ${description}`,
    };

    const ipfsImageHash = await pinFileToIPFS(
      profileImage,
      pinataMetadata,
    );
  };

  const modalChildren = (modalStatus = status) => {
    switch (modalStatus) {
      case 'initial':
        return (
          <InitialState
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            mint={mint}
          />
        );

      case 'loading':
        return <LoadingState />;

      case 'finished':
        return <FinishedState />;

      default:
        router.push('/');
        setAppStatus('error');
        break;
    }
  };

  return <div>{modalChildren()}</div>;
};

export default ProfileImageMinter;
