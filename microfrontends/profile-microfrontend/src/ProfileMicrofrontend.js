import React from 'react';
import { ProfileProvider } from './context/ProfileContext';
import ProfileContainer from './components/ProfileContainer';

const ProfileMicrofrontend = () => {
  return (
    <ProfileProvider>
      <ProfileContainer />
    </ProfileProvider>
  );
};

export default ProfileMicrofrontend;
