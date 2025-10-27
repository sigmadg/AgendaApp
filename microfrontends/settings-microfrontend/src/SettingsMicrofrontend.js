import React from 'react';
import { SettingsProvider } from './context/SettingsContext';
import SettingsContainer from './components/SettingsContainer';

const SettingsMicrofrontend = () => {
  return (
    <SettingsProvider>
      <SettingsContainer />
    </SettingsProvider>
  );
};

export default SettingsMicrofrontend;
