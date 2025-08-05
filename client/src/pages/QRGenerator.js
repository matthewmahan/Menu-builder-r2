import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiDownload,
  FiArrowLeft,
  FiShare2,
  FiCopy,
  FiCheck,
  FiExternalLink,
  FiSettings,
  FiSettings as FiPalette,
  FiImage,
  FiPrinter,
  FiBarChart2,
  FiEye,
  FiCalendar,
  FiTrendingUp
} from 'react-icons/fi';
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

const TabContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Tab = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border: none;
  background: none;
  color: ${props => props.active ? props.theme.colors.primary.main : props.theme.colors.text.secondary};
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary.main : 'transparent'};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  font-weight: ${props => props.active ? props.theme.fontWeights.semibold : props.theme.fontWeights.normal};

  &:hover {
    color: ${props => props.theme.colors.primary.main};
  }
`;

const CustomizationPanel = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border.light};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const CustomizationTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const CustomizationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const CustomizationGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const CustomizationLabel = styled.label`
  display: block;
  font-weight: ${props => props.theme.fontWeights.medium};
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const ColorInput = styled.input`
  width: 60px;
  height: 40px;
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  background: none;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: ${props => props.theme.borderRadius.sm};
  }
`;

const RangeInput = styled.input`
  width: 100%;
  margin: ${props => props.theme.spacing.sm} 0;
`;

const RangeValue = styled.span`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const AnalyticsCard = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border.light};
  text-align: center;
`;

const AnalyticsValue = styled.div`
  font-size: ${props => props.theme.fontSizes.xxl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary.main};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const AnalyticsLabel = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const PrintLayoutGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const PrintLayout = styled.div`
  border: 2px solid ${props => props.selected ? props.theme.colors.primary.main : props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  text-align: center;

  &:hover {
    border-color: ${props => props.theme.colors.primary.main};
  }
`;

const PrintLayoutTitle = styled.div`
  font-weight: ${props => props.theme.fontWeights.medium};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const PrintLayoutDescription = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const PlaceholderSection = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  margin: ${props => props.theme.spacing.lg} 0;
`;

const QRGenerator = () => {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const { currentMenu, loading, fetchMenu } = useMenu();
  const qrRef = useRef();
  
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  
  // QR Customization state
  const [qrSettings, setQrSettings] = useState({
    size: 200,
    fgColor: '#000000',
    bgColor: '#ffffff',
    level: 'M',
    includeMargin: true,
    logoSize: 0.2
  });
  
  // Print layout state
  const [selectedLayout, setSelectedLayout] = useState('single');
  
  // Mock analytics data (placeholder)
  const [analytics] = useState({
    totalScans: 247,
    todayScans: 12,
    weeklyScans: 89,
    monthlyScans: 247,
    topScanTime: '7:30 PM',
    avgScansPerDay: 8.2
  });

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'generate':
        return (
          <ContentGrid>
            <QRSection>
              <SectionTitle>Your QR Code</SectionTitle>
              <QRWrapper ref={qrRef}>
                <QRCode
                  value={menuUrl}
                  size={qrSettings.size}
                  level={qrSettings.level}
                  includeMargin={qrSettings.includeMargin}
                  fgColor={qrSettings.fgColor}
                  bgColor={qrSettings.bgColor}
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
        );

      case 'customize':
        return (
          <div>
            <CustomizationPanel>
              <CustomizationTitle>
                <FiPalette />
                QR Code Appearance
              </CustomizationTitle>
              <CustomizationGrid>
                <CustomizationGroup>
                  <CustomizationLabel>Size</CustomizationLabel>
                  <RangeInput
                    type="range"
                    min="100"
                    max="400"
                    value={qrSettings.size}
                    onChange={(e) => setQrSettings(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                  />
                  <RangeValue>{qrSettings.size}px</RangeValue>
                </CustomizationGroup>

                <CustomizationGroup>
                  <CustomizationLabel>Foreground Color</CustomizationLabel>
                  <ColorInput
                    type="color"
                    value={qrSettings.fgColor}
                    onChange={(e) => setQrSettings(prev => ({ ...prev, fgColor: e.target.value }))}
                  />
                </CustomizationGroup>

                <CustomizationGroup>
                  <CustomizationLabel>Background Color</CustomizationLabel>
                  <ColorInput
                    type="color"
                    value={qrSettings.bgColor}
                    onChange={(e) => setQrSettings(prev => ({ ...prev, bgColor: e.target.value }))}
                  />
                </CustomizationGroup>

                <CustomizationGroup>
                  <CustomizationLabel>Error Correction Level</CustomizationLabel>
                  <select
                    value={qrSettings.level}
                    onChange={(e) => setQrSettings(prev => ({ ...prev, level: e.target.value }))}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                  >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                  </select>
                </CustomizationGroup>
              </CustomizationGrid>
            </CustomizationPanel>

            <CustomizationPanel>
              <CustomizationTitle>
                <FiImage />
                Logo Integration (Coming Soon)
              </CustomizationTitle>
              <PlaceholderSection>
                <p>Add your business logo to the center of your QR code</p>
                <p>This feature will be available in a future update</p>
              </PlaceholderSection>
            </CustomizationPanel>
          </div>
        );

      case 'analytics':
        return (
          <div>
            <CustomizationPanel>
              <CustomizationTitle>
                <FiBarChart2 />
                QR Code Analytics (Demo Data)
              </CustomizationTitle>
              <AnalyticsGrid>
                <AnalyticsCard>
                  <AnalyticsValue>{analytics.totalScans}</AnalyticsValue>
                  <AnalyticsLabel>Total Scans</AnalyticsLabel>
                </AnalyticsCard>
                <AnalyticsCard>
                  <AnalyticsValue>{analytics.todayScans}</AnalyticsValue>
                  <AnalyticsLabel>Today</AnalyticsLabel>
                </AnalyticsCard>
                <AnalyticsCard>
                  <AnalyticsValue>{analytics.weeklyScans}</AnalyticsValue>
                  <AnalyticsLabel>This Week</AnalyticsLabel>
                </AnalyticsCard>
                <AnalyticsCard>
                  <AnalyticsValue>{analytics.monthlyScans}</AnalyticsValue>
                  <AnalyticsLabel>This Month</AnalyticsLabel>
                </AnalyticsCard>
                <AnalyticsCard>
                  <AnalyticsValue>{analytics.topScanTime}</AnalyticsValue>
                  <AnalyticsLabel>Peak Time</AnalyticsLabel>
                </AnalyticsCard>
                <AnalyticsCard>
                  <AnalyticsValue>{analytics.avgScansPerDay}</AnalyticsValue>
                  <AnalyticsLabel>Daily Average</AnalyticsLabel>
                </AnalyticsCard>
              </AnalyticsGrid>
            </CustomizationPanel>

            <CustomizationPanel>
              <CustomizationTitle>
                <FiTrendingUp />
                Detailed Analytics (Coming Soon)
              </CustomizationTitle>
              <PlaceholderSection>
                <p>Get detailed insights about your QR code performance:</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
                  <li>• Scan locations and demographics</li>
                  <li>• Time-based usage patterns</li>
                  <li>• Device and browser analytics</li>
                  <li>• Conversion tracking</li>
                  <li>• Export analytics reports</li>
                </ul>
                <p>Upgrade to Pro to unlock advanced analytics</p>
              </PlaceholderSection>
            </CustomizationPanel>
          </div>
        );

      case 'print':
        return (
          <div>
            <CustomizationPanel>
              <CustomizationTitle>
                <FiPrinter />
                Print Layouts
              </CustomizationTitle>
              <PrintLayoutGrid>
                <PrintLayout
                  selected={selectedLayout === 'single'}
                  onClick={() => setSelectedLayout('single')}
                >
                  <PrintLayoutTitle>Single QR Code</PrintLayoutTitle>
                  <PrintLayoutDescription>One large QR code per page</PrintLayoutDescription>
                </PrintLayout>
                <PrintLayout
                  selected={selectedLayout === 'multiple'}
                  onClick={() => setSelectedLayout('multiple')}
                >
                  <PrintLayoutTitle>Multiple QR Codes</PrintLayoutTitle>
                  <PrintLayoutDescription>4 QR codes per page</PrintLayoutDescription>
                </PrintLayout>
                <PrintLayout
                  selected={selectedLayout === 'table-tent'}
                  onClick={() => setSelectedLayout('table-tent')}
                >
                  <PrintLayoutTitle>Table Tent</PrintLayoutTitle>
                  <PrintLayoutDescription>Foldable table display</PrintLayoutDescription>
                </PrintLayout>
                <PrintLayout
                  selected={selectedLayout === 'sticker'}
                  onClick={() => setSelectedLayout('sticker')}
                >
                  <PrintLayoutTitle>Sticker Sheet</PrintLayoutTitle>
                  <PrintLayoutDescription>Small stickers for various uses</PrintLayoutDescription>
                </PrintLayout>
              </PrintLayoutGrid>
              
              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <PrimaryButton>
                  <FiPrinter />
                  Generate Print Layout
                </PrimaryButton>
              </div>
            </CustomizationPanel>

            <CustomizationPanel>
              <CustomizationTitle>
                Print Tips & Guidelines
              </CustomizationTitle>
              <PlaceholderSection>
                <h4>Best Practices for Printing QR Codes:</h4>
                <ul style={{ textAlign: 'left', margin: '1rem 0' }}>
                  <li>• Use high contrast colors (dark on light background)</li>
                  <li>• Ensure minimum size of 2cm x 2cm for reliable scanning</li>
                  <li>• Test printed codes with multiple devices before mass printing</li>
                  <li>• Use high-quality paper for better scan reliability</li>
                  <li>• Include your business name and "Scan for Menu" text</li>
                </ul>
              </PlaceholderSection>
            </CustomizationPanel>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <QRContainer>
      <Header>
        <BackButton onClick={() => navigate('/dashboard')}>
          <FiArrowLeft />
          Back to Dashboard
        </BackButton>
        <HeaderContent>
          <Title>QR Code Generator</Title>
          <Subtitle>Create, customize, and track your digital menu QR codes</Subtitle>
        </HeaderContent>
      </Header>

      <TabContainer>
        <TabList>
          <Tab active={activeTab === 'generate'} onClick={() => setActiveTab('generate')}>
            <FiSettings style={{ marginRight: '0.5rem' }} />
            Generate
          </Tab>
          <Tab active={activeTab === 'customize'} onClick={() => setActiveTab('customize')}>
            <FiPalette style={{ marginRight: '0.5rem' }} />
            Customize
          </Tab>
          <Tab active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')}>
            <FiBarChart2 style={{ marginRight: '0.5rem' }} />
            Analytics
          </Tab>
          <Tab active={activeTab === 'print'} onClick={() => setActiveTab('print')}>
            <FiPrinter style={{ marginRight: '0.5rem' }} />
            Print
          </Tab>
        </TabList>

        {renderTabContent()}
      </TabContainer>
    </QRContainer>
  );
};

export default QRGenerator;