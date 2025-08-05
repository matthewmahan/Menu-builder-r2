import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  background: ${props => props.theme.colors.background.primary};
`;

const AppLayout = ({ children }) => {
  return (
    <LayoutContainer>
      <Navbar />
      <ContentContainer>
        <Sidebar />
        <MainContent>
          {children}
        </MainContent>
      </ContentContainer>
      <Footer />
    </LayoutContainer>
  );
};

export default AppLayout;