import React from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <Title>Dashboard</Title>
      <p>Welcome to your dashboard! This will show your menus, analytics, and quick actions.</p>
    </DashboardContainer>
  );
};

export default Dashboard;