import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FiUser,
  FiSettings as FiPalette,
  FiBell,
  FiShield,
  FiCreditCard,
  FiLink,
  FiDownload,
  FiSave,
  FiToggleLeft,
  FiToggleRight,
  FiEye,
  FiEyeOff,
  FiCamera,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiUpload
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const SettingsContainer = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  background: ${props => props.theme.colors.background.primary};
`;

const Header = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes.xxl};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.lg};
  }
`;

const Sidebar = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border.light};
  height: fit-content;
  position: sticky;
  top: ${props => props.theme.spacing.xl};
`;

const SidebarTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.md};
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.primary};
`;

const NavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  border: none;
  background: ${props => props.active ? props.theme.colors.primary.light + '22' : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary.main : props.theme.colors.text.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  text-align: left;
  font-size: ${props => props.theme.fontSizes.sm};
  margin-bottom: ${props => props.theme.spacing.xs};

  &:hover {
    background: ${props => props.theme.colors.background.secondary};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const MainContent = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border.light};
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: ${props => props.theme.spacing.xl};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const SectionDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  font-size: ${props => props.theme.fontSizes.sm};
`;

const SectionContent = styled.div`
  padding: ${props => props.theme.spacing.xl};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  font-weight: ${props => props.theme.fontWeights.medium};
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.sm};
  transition: ${props => props.theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary.main}22;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.sm};
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: ${props => props.theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary.main}22;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.sm};
  background: white;
  transition: ${props => props.theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary.main}22;
  }
`;

const ToggleGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md} 0;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};

  &:last-child {
    border-bottom: none;
  }
`;

const ToggleLabel = styled.div`
  flex: 1;
`;

const ToggleTitle = styled.div`
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ToggleDescription = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 28px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.active ? props.theme.colors.primary.main : props.theme.colors.border.medium};
  color: white;
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  position: relative;

  &:hover {
    background: ${props => props.active ? props.theme.colors.primary.dark : props.theme.colors.border.dark};
  }

  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    transition: ${props => props.theme.transitions.normal};
    transform: translateX(${props => props.active ? '10px' : '-10px'});
  }
`;

const ColorPicker = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
`;

const ColorOption = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 2px solid ${props => props.selected ? props.theme.colors.primary.main : props.theme.colors.border.light};
  background: ${props => props.color};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    transform: scale(1.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.xl};
  padding-top: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.border.light};
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

const ImageUpload = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const ImagePreview = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border.light};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  font-size: ${props => props.theme.fontSizes.sm};

  &:hover {
    background: ${props => props.theme.colors.border.light};
  }

  input {
    display: none;
  }
`;

const PlanCard = styled.div`
  border: 2px solid ${props => props.current ? props.theme.colors.primary.main : props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  position: relative;

  ${props => props.current && `
    &::before {
      content: 'Current Plan';
      position: absolute;
      top: -10px;
      left: 16px;
      background: ${props.theme.colors.primary.main};
      color: white;
      padding: 4px 12px;
      border-radius: ${props.theme.borderRadius.sm};
      font-size: ${props.theme.fontSizes.xs};
      font-weight: ${props.theme.fontWeights.semibold};
    }
  `}
`;

const PlanName = styled.h4`
  font-size: ${props => props.theme.fontSizes.lg};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const PlanPrice = styled.div`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary.main};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text.secondary};

  li {
    margin-bottom: ${props => props.theme.spacing.xs};
    
    &::before {
      content: '✓';
      color: ${props => props.theme.colors.success.main};
      margin-right: ${props => props.theme.spacing.sm};
    }
  }
`;

const PlaceholderBox = styled.div`
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  margin: ${props => props.theme.spacing.md} 0;
`;

const Settings = () => {
  const { user, updateProfile, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState({
    businessName: user?.businessName || '',
    ownerName: user?.ownerName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    website: user?.website || '',
    description: user?.description || '',
    instagram: user?.socialMedia?.instagram || '',
    facebook: user?.socialMedia?.facebook || '',
    twitter: user?.socialMedia?.twitter || ''
  });

  const [settings, setSettings] = useState({
    // Appearance
    primaryColor: '#2563eb',
    theme: 'light',
    showPrices: true,
    showImages: true,
    
    // Notifications
    emailNotifications: true,
    orderNotifications: true,
    marketingEmails: false,
    weeklyReports: true,
    
    // Privacy
    publicProfile: true,
    showContactInfo: true,
    allowReviews: true,
    
    // Menu
    autoPublish: false,
    requireApproval: true
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSave = async () => {
    // Placeholder for save functionality
    console.log('Saving settings...', formData, settings);
  };

  const sections = [
    { id: 'profile', label: 'Business Profile', icon: FiUser },
    { id: 'appearance', label: 'Appearance', icon: FiPalette },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'billing', label: 'Billing', icon: FiCreditCard },
    { id: 'integrations', label: 'Integrations', icon: FiLink },
    { id: 'export', label: 'Export/Import', icon: FiDownload }
  ];

  const colorOptions = [
    '#2563eb', '#dc2626', '#16a34a', '#ca8a04', 
    '#9333ea', '#c2410c', '#0891b2', '#be123c'
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <>
            <SectionHeader>
              <SectionTitle>Business Profile</SectionTitle>
              <SectionDescription>
                Manage your business information and public profile details
              </SectionDescription>
            </SectionHeader>
            <SectionContent>
              <FormGroup>
                <Label>Business Logo</Label>
                <ImageUpload>
                  <ImagePreview>
                    {user?.logo ? (
                      <img src={user.logo} alt="Business logo" />
                    ) : (
                      <FiCamera size={24} color="#9ca3af" />
                    )}
                  </ImagePreview>
                  <UploadButton>
                    <FiCamera />
                    Upload Logo
                    <input type="file" accept="image/*" />
                  </UploadButton>
                </ImageUpload>
              </FormGroup>

              <FormGroup>
                <Label>Business Name</Label>
                <Input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Enter your business name"
                />
              </FormGroup>

              <FormGroup>
                <Label>Owner Name</Label>
                <Input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  placeholder="Enter owner name"
                />
              </FormGroup>

              <FormGroup>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </FormGroup>

              <FormGroup>
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </FormGroup>

              <FormGroup>
                <Label>Business Address</Label>
                <TextArea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your business address"
                />
              </FormGroup>

              <FormGroup>
                <Label>Website</Label>
                <Input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://yourwebsite.com"
                />
              </FormGroup>

              <FormGroup>
                <Label>Business Description</Label>
                <TextArea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell customers about your business..."
                />
              </FormGroup>

              <FormGroup>
                <Label>Social Media</Label>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <Input
                    type="url"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="Instagram URL"
                  />
                  <Input
                    type="url"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    placeholder="Facebook URL"
                  />
                  <Input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    placeholder="Twitter URL"
                  />
                </div>
              </FormGroup>
            </SectionContent>
          </>
        );

      case 'appearance':
        return (
          <>
            <SectionHeader>
              <SectionTitle>Menu Appearance</SectionTitle>
              <SectionDescription>
                Customize how your digital menu looks to customers
              </SectionDescription>
            </SectionHeader>
            <SectionContent>
              <FormGroup>
                <Label>Primary Color</Label>
                <ColorPicker>
                  {colorOptions.map(color => (
                    <ColorOption
                      key={color}
                      color={color}
                      selected={settings.primaryColor === color}
                      onClick={() => setSettings(prev => ({ ...prev, primaryColor: color }))}
                    />
                  ))}
                </ColorPicker>
              </FormGroup>

              <FormGroup>
                <Label>Theme</Label>
                <Select
                  value={settings.theme}
                  onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </Select>
              </FormGroup>

              <ToggleGroup>
                <ToggleLabel>
                  <ToggleTitle>Show Prices</ToggleTitle>
                  <ToggleDescription>Display item prices on your menu</ToggleDescription>
                </ToggleLabel>
                <ToggleButton
                  active={settings.showPrices}
                  onClick={() => handleToggle('showPrices')}
                />
              </ToggleGroup>

              <ToggleGroup>
                <ToggleLabel>
                  <ToggleTitle>Show Images</ToggleTitle>
                  <ToggleDescription>Display item images when available</ToggleDescription>
                </ToggleLabel>
                <ToggleButton
                  active={settings.showImages}
                  onClick={() => handleToggle('showImages')}
                />
              </ToggleGroup>
            </SectionContent>
          </>
        );

      case 'notifications':
        return (
          <>
            <SectionHeader>
              <SectionTitle>Notification Preferences</SectionTitle>
              <SectionDescription>
                Choose what notifications you want to receive
              </SectionDescription>
            </SectionHeader>
            <SectionContent>
              <ToggleGroup>
                <ToggleLabel>
                  <ToggleTitle>Email Notifications</ToggleTitle>
                  <ToggleDescription>Receive important updates via email</ToggleDescription>
                </ToggleLabel>
                <ToggleButton
                  active={settings.emailNotifications}
                  onClick={() => handleToggle('emailNotifications')}
                />
              </ToggleGroup>

              <ToggleGroup>
                <ToggleLabel>
                  <ToggleTitle>Order Notifications</ToggleTitle>
                  <ToggleDescription>Get notified about new orders (when available)</ToggleDescription>
                </ToggleLabel>
                <ToggleButton
                  active={settings.orderNotifications}
                  onClick={() => handleToggle('orderNotifications')}
                />
              </ToggleGroup>

              <ToggleGroup>
                <ToggleLabel>
                  <ToggleTitle>Marketing Emails</ToggleTitle>
                  <ToggleDescription>Receive tips and promotional content</ToggleDescription>
                </ToggleLabel>
                <ToggleButton
                  active={settings.marketingEmails}
                  onClick={() => handleToggle('marketingEmails')}
                />
              </ToggleGroup>

              <ToggleGroup>
                <ToggleLabel>
                  <ToggleTitle>Weekly Reports</ToggleTitle>
                  <ToggleDescription>Get weekly analytics and insights</ToggleDescription>
                </ToggleLabel>
                <ToggleButton
                  active={settings.weeklyReports}
                  onClick={() => handleToggle('weeklyReports')}
                />
              </ToggleGroup>
            </SectionContent>
          </>
        );

      case 'security':
        return (
          <>
            <SectionHeader>
              <SectionTitle>Account Security</SectionTitle>
              <SectionDescription>
                Manage your account security and privacy settings
              </SectionDescription>
            </SectionHeader>
            <SectionContent>
              <FormGroup>
                <Label>Current Password</Label>
                <Input
                  type="password"
                  placeholder="Enter current password"
                />
              </FormGroup>

              <FormGroup>
                <Label>New Password</Label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                />
              </FormGroup>

              <FormGroup>
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                />
              </FormGroup>

              <ToggleGroup>
                <ToggleLabel>
                  <ToggleTitle>Public Profile</ToggleTitle>
                  <ToggleDescription>Allow your business to be found in search</ToggleDescription>
                </ToggleLabel>
                <ToggleButton
                  active={settings.publicProfile}
                  onClick={() => handleToggle('publicProfile')}
                />
              </ToggleGroup>

              <ToggleGroup>
                <ToggleLabel>
                  <ToggleTitle>Show Contact Information</ToggleTitle>
                  <ToggleDescription>Display contact details on your menu</ToggleDescription>
                </ToggleLabel>
                <ToggleButton
                  active={settings.showContactInfo}
                  onClick={() => handleToggle('showContactInfo')}
                />
              </ToggleGroup>

              <ToggleGroup>
                <ToggleLabel>
                  <ToggleTitle>Allow Reviews</ToggleTitle>
                  <ToggleDescription>Let customers leave reviews (coming soon)</ToggleDescription>
                </ToggleLabel>
                <ToggleButton
                  active={settings.allowReviews}
                  onClick={() => handleToggle('allowReviews')}
                />
              </ToggleGroup>
            </SectionContent>
          </>
        );

      case 'billing':
        return (
          <>
            <SectionHeader>
              <SectionTitle>Billing & Subscription</SectionTitle>
              <SectionDescription>
                Manage your subscription and billing information
              </SectionDescription>
            </SectionHeader>
            <SectionContent>
              <PlanCard current>
                <PlanName>Free Plan</PlanName>
                <PlanPrice>$0/month</PlanPrice>
                <PlanFeatures>
                  <li>1 Digital Menu</li>
                  <li>Up to 50 Menu Items</li>
                  <li>QR Code Generation</li>
                  <li>Basic Analytics</li>
                  <li>Email Support</li>
                </PlanFeatures>
              </PlanCard>

              <PlanCard>
                <PlanName>Pro Plan</PlanName>
                <PlanPrice>$19/month</PlanPrice>
                <PlanFeatures>
                  <li>Unlimited Digital Menus</li>
                  <li>Unlimited Menu Items</li>
                  <li>Custom Branding</li>
                  <li>Advanced Analytics</li>
                  <li>Online Ordering (Coming Soon)</li>
                  <li>Priority Support</li>
                </PlanFeatures>
              </PlanCard>

              <PlanCard>
                <PlanName>Enterprise Plan</PlanName>
                <PlanPrice>$49/month</PlanPrice>
                <PlanFeatures>
                  <li>Everything in Pro</li>
                  <li>Multi-location Support</li>
                  <li>API Access</li>
                  <li>White-label Solution</li>
                  <li>Dedicated Account Manager</li>
                  <li>Custom Integrations</li>
                </PlanFeatures>
              </PlanCard>

              <FormGroup>
                <Label>Payment Method</Label>
                <PlaceholderBox>
                  No payment method on file. Upgrade to Pro to add payment details.
                </PlaceholderBox>
              </FormGroup>
            </SectionContent>
          </>
        );

      case 'integrations':
        return (
          <>
            <SectionHeader>
              <SectionTitle>Integrations</SectionTitle>
              <SectionDescription>
                Connect your menu with third-party services
              </SectionDescription>
            </SectionHeader>
            <SectionContent>
              <PlaceholderBox>
                <FiLink size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h3>Integrations Coming Soon</h3>
                <p>We're working on integrations with popular services like:</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
                  <li>• POS Systems</li>
                  <li>• Delivery Platforms</li>
                  <li>• Payment Processors</li>
                  <li>• Inventory Management</li>
                  <li>• Social Media</li>
                </ul>
                <p>Stay tuned for updates!</p>
              </PlaceholderBox>
            </SectionContent>
          </>
        );

      case 'export':
        return (
          <>
            <SectionHeader>
              <SectionTitle>Export & Import</SectionTitle>
              <SectionDescription>
                Backup your menu data or import from other systems
              </SectionDescription>
            </SectionHeader>
            <SectionContent>
              <FormGroup>
                <Label>Export Menu Data</Label>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <SecondaryButton>
                    <FiDownload />
                    Export as JSON
                  </SecondaryButton>
                  <SecondaryButton>
                    <FiDownload />
                    Export as CSV
                  </SecondaryButton>
                  <SecondaryButton>
                    <FiDownload />
                    Export as PDF
                  </SecondaryButton>
                </div>
              </FormGroup>

              <FormGroup>
                <Label>Import Menu Data</Label>
                <UploadButton>
                  <FiUpload />
                  Import from File
                  <input type="file" accept=".json,.csv" />
                </UploadButton>
                <PlaceholderBox style={{ marginTop: '1rem' }}>
                  <p>Supported formats: JSON, CSV</p>
                  <p>Import menus from other systems or restore from backup</p>
                </PlaceholderBox>
              </FormGroup>

              <FormGroup>
                <Label>Backup Settings</Label>
                <ToggleGroup>
                  <ToggleLabel>
                    <ToggleTitle>Auto Backup</ToggleTitle>
                    <ToggleDescription>Automatically backup your menu data weekly</ToggleDescription>
                  </ToggleLabel>
                  <ToggleButton
                    active={settings.autoBackup || false}
                    onClick={() => handleToggle('autoBackup')}
                  />
                </ToggleGroup>
              </FormGroup>
            </SectionContent>
          </>
        );

      default:
        return (
          <PlaceholderBox>
            <h3>Section not found</h3>
            <p>Please select a valid settings section.</p>
          </PlaceholderBox>
        );
    }
  };

  if (loading) {
    return (
      <SettingsContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <LoadingSpinner size="large" text="Loading settings..." />
        </div>
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer>
      <Header>
        <Title>Settings</Title>
        <Subtitle>Manage your account, business profile, and preferences</Subtitle>
      </Header>

      <SettingsGrid>
        <Sidebar>
          <SidebarTitle>Settings</SidebarTitle>
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <NavItem
                key={section.id}
                active={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
              >
                <IconComponent size={16} />
                {section.label}
              </NavItem>
            );
          })}
        </Sidebar>

        <MainContent>
          {renderSection()}
          
          {activeSection !== 'billing' && activeSection !== 'integrations' && (
            <SectionContent>
              <ButtonGroup>
                <PrimaryButton onClick={handleSave} disabled={loading}>
                  <FiSave />
                  Save Changes
                </PrimaryButton>
                <SecondaryButton onClick={() => window.location.reload()}>
                  Cancel
                </SecondaryButton>
              </ButtonGroup>
            </SectionContent>
          )}
        </MainContent>
      </SettingsGrid>
    </SettingsContainer>
  );
};

export default Settings;