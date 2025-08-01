import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiHome } from 'react-icons/fi';

const NotFoundContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${props => props.theme.spacing.md};
`;

const NotFoundContent = styled.div`
  max-width: 500px;
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary.main};
  margin-bottom: ${props => props.theme.spacing.md};
  line-height: 1;
`;

const ErrorTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ErrorDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xl};
  line-height: 1.6;
`;

const HomeButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.primary.main};
  color: white;
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    background: ${props => props.theme.colors.primary.dark};
    transform: translateY(-1px);
    text-decoration: none;
    color: white;
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <NotFoundContent>
        <ErrorCode>404</ErrorCode>
        <ErrorTitle>Page Not Found</ErrorTitle>
        <ErrorDescription>
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </ErrorDescription>
        <HomeButton to="/">
          <FiHome />
          Go Home
        </HomeButton>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

export default NotFound;