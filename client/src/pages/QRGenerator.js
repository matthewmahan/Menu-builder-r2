import React from 'react';
import styled from 'styled-components';

const QRContainer = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const QRGenerator = () => {
  return (
    <QRContainer>
      <Title>QR Code Generator</Title>
      <p>Generate and download QR codes for your menu. This feature will be implemented here.</p>
    </QRContainer>
  );
};

export default QRGenerator;