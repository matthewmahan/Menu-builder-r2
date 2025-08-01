import React from 'react';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Settings = () => {
  return (
    <SettingsContainer>
      <Title>Settings</Title>
      <p>User settings and preferences will be implemented here.</p>
    </SettingsContainer>
  );
};

export default Settings;