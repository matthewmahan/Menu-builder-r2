import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiDownload, FiArrowLeft, FiShare2, FiCopy, FiCheck, FiExternalLink } from 'react-icons/fi';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { useMenu } from '../contexts/MenuContext';
import LoadingSpinner from '../components/LoadingSpinner';

const QRContainer = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.xl};
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    background: ${props => props.theme.colors.background.secondary};
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes.xxl};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const QRSection = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border.light};
  text-align: center;
`;

const QRWrapper = styled.div`
  display: inline-block;
  padding: ${props => props.theme.spacing.lg};
  background: white;
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const QRActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  font-size: ${props => props.theme.fontSizes.sm};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: ${props => props.theme.colors.primary.main};
  color: white;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary.dark};
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled(Button)`
  background: white;
  color: ${props => props.theme.colors.text.primary};
  border: 1px solid ${props => props.theme.colors.border.medium};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.background.secondary};
  }
`;

const DetailsSection = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border.light};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md} 0;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  font-weight: ${props => props.theme.fontWeights.medium};
`;

const DetailValue = styled.span`
  color: ${props => props.theme.colors.text.primary};
  font-family: monospace;
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const URLSection = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
`;

const URLInput = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border.light};
`;

const URLText = styled.span`
  flex: 1;
  font-family: monospace;
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text.primary};
  word-break: break-all;
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  background: ${props => props.copied ? props.theme.colors.success.main : 'white'};
  color: ${props => props.copied ? 'white' : props.theme.colors.text.secondary};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    background: ${props => props.copied ? props.theme.colors.success.dark : props.theme.colors.border.light};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.error.main};
`;

const QRGenerator = () => {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const { currentMenu, loading, fetchMenu } = useMenu();
  const qrRef = useRef();
  
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (menuId) {
      fetchMenu(menuId);
    }
  }, [menuId, fetchMenu]);

  const menuUrl = currentMenu ? `${window.location.origin}/menu/${currentMenu.shortUrl}` : '';

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleDownloadQR = async () => {
    if (!qrRef.current) return;
    
    setDownloading(true);
    try {
      const canvas = await html2canvas(qrRef.current, {
        backgroundColor: 'white',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `${currentMenu.businessName}-qr-code.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error('Failed to download QR code:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${currentMenu.businessName} Menu`,
          text: `Check out our digital menu!`,
          url: menuUrl
        });
      } catch (err) {
        console.error('Failed to share:', err);
      }
    } else {
      handleCopyUrl();
    }
  };

  const handleOpenMenu = () => {
    window.open(menuUrl, '_blank');
  };

  if (loading) {
    return (
      <QRContainer>
        <LoadingContainer>
          <LoadingSpinner size="large" text="Loading QR code..." />
        </LoadingContainer>
      </QRContainer>
    );
  }

  if (!currentMenu) {
    return (
      <QRContainer>
        <ErrorMessage>
          <h2>Menu not found</h2>
          <p>The menu you're looking for doesn't exist or you don't have permission to access it.</p>
        </ErrorMessage>
      </QRContainer>
    );
  }

  return (
    <QRContainer>
      <Header>
        <BackButton onClick={() => navigate('/dashboard')}>
          <FiArrowLeft />
          Back to Dashboard
        </BackButton>
        <HeaderContent>
          <Title>QR Code Generator</Title>
          <Subtitle>Share your digital menu with customers</Subtitle>
        </HeaderContent>
      </Header>

      <ContentGrid>
        <QRSection>
          <SectionTitle>Your QR Code</SectionTitle>
          <QRWrapper ref={qrRef}>
            <QRCode
              value={menuUrl}
              size={200}
              level="M"
              includeMargin={true}
            />
          </QRWrapper>
          
          <QRActions>
            <PrimaryButton onClick={handleDownloadQR} disabled={downloading}>
              <FiDownload />
              {downloading ? 'Downloading...' : 'Download PNG'}
            </PrimaryButton>
            <SecondaryButton onClick={handleShare}>
              <FiShare2 />
              Share
            </SecondaryButton>
            <SecondaryButton onClick={handleOpenMenu}>
              <FiExternalLink />
              Preview Menu
            </SecondaryButton>
          </QRActions>
        </QRSection>

        <DetailsSection>
          <SectionTitle>Menu Details</SectionTitle>
          
          <DetailItem>
            <DetailLabel>Business Name</DetailLabel>
            <DetailValue>{currentMenu.businessName}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Menu Items</DetailLabel>
            <DetailValue>{currentMenu.items?.length || 0} items</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Status</DetailLabel>
            <DetailValue style={{
              color: currentMenu.isOpen ? '#10b981' : '#ef4444',
              background: currentMenu.isOpen ? '#dcfce7' : '#fee2e2'
            }}>
              {currentMenu.isOpen ? 'Open' : 'Closed'}
            </DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Short URL</DetailLabel>
            <DetailValue>{currentMenu.shortUrl}</DetailValue>
          </DetailItem>

          <URLSection>
            <DetailLabel style={{ display: 'block', marginBottom: '0.5rem' }}>
              Public Menu URL
            </DetailLabel>
            <URLInput>
              <URLText>{menuUrl}</URLText>
              <CopyButton onClick={handleCopyUrl} copied={copied}>
                {copied ? <FiCheck /> : <FiCopy />}
              </CopyButton>
            </URLInput>
          </URLSection>
        </DetailsSection>
      </ContentGrid>
    </QRContainer>
  );
};

export default QRGenerator;