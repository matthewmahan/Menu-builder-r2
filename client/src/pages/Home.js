import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Bars3Icon as MenuIcon,
  QrCodeIcon,
  DevicePhoneMobileIcon as SmartphoneIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  UsersIcon,
  BoltIcon as ZapIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary.main} 0%, ${props => props.theme.colors.primary.dark} 100%);
`;

const Header = styled.header`
  padding: ${props => props.theme.spacing.md} 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: ${props => props.theme.breakpoints.xl};
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: white;
  
  svg {
    margin-right: ${props => props.theme.spacing.sm};
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    gap: ${props => props.theme.spacing.md};
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeights.medium};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: ${props => props.theme.transitions.normal};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    text-decoration: none;
  }
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  background: white;
  color: ${props => props.theme.colors.primary.main};
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  transition: ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
    text-decoration: none;
    color: ${props => props.theme.colors.primary.main};
  }
`;

const HeroSection = styled.section`
  padding: ${props => props.theme.spacing.xxxl} 0;
  text-align: center;
  color: white;
`;

const HeroContent = styled.div`
  max-width: ${props => props.theme.breakpoints.lg};
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  margin-bottom: ${props => props.theme.spacing.lg};
  line-height: 1.1;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: ${props => props.theme.spacing.xxl};
  opacity: 0.9;
  line-height: 1.6;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes.lg};
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Button)`
  background: white;
  color: ${props => props.theme.colors.primary.main};
  font-size: ${props => props.theme.fontSizes.lg};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: white;
  border: 2px solid white;
  font-size: ${props => props.theme.fontSizes.lg};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  
  &:hover {
    background: white;
    color: ${props => props.theme.colors.primary.main};
  }
`;

const FeaturesSection = styled.section`
  padding: ${props => props.theme.spacing.xxxl} 0;
  background: white;
`;

const FeaturesContainer = styled.div`
  max-width: ${props => props.theme.breakpoints.xl};
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.text.primary};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.xxl};
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.primary.light};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
`;

const FeatureTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.primary};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.6;
`;

const Footer = styled.footer`
  background: ${props => props.theme.colors.text.primary};
  color: white;
  padding: ${props => props.theme.spacing.xl} 0;
  text-align: center;
`;

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const features = [
    {
      icon: <MenuIcon className="w-6 h-6" />,
      title: 'Easy Menu Creation',
      description: 'Create beautiful digital menus in minutes with our intuitive drag-and-drop editor.'
    },
    {
      icon: <QrCodeIcon className="w-6 h-6" />,
      title: 'QR Code Generation',
      description: 'Generate high-quality QR codes that customers can scan to view your menu instantly.'
    },
    {
      icon: <SmartphoneIcon className="w-6 h-6" />,
      title: 'Mobile Optimized',
      description: 'Your menus look perfect on all devices, ensuring a great experience for your customers.'
    },
    {
      icon: <ZapIcon className="w-6 h-6" />,
      title: 'Real-time Updates',
      description: 'Update your menu instantly and changes appear immediately for all customers.'
    },
    {
      icon: <TrendingUpIcon className="w-6 h-6" />,
      title: 'Analytics & Insights',
      description: 'Track menu views and popular items to make data-driven decisions.'
    },
    {
      icon: <UsersIcon className="w-6 h-6" />,
      title: 'Customer Friendly',
      description: 'Clean, easy-to-read menus that help customers find what they want quickly.'
    }
  ];

  return (
    <HomeContainer>
      <Header>
        <Nav>
          <Logo>
            <MenuIcon className="w-6 h-6" />
            MenuBuilder
          </Logo>
          <NavLinks>
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <Button to="/dashboard">Go to App</Button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <Button to="/register">Get Started</Button>
              </>
            )}
          </NavLinks>
        </Nav>
      </Header>

      <HeroSection>
        <HeroContent>
          <HeroTitle>
            Create Beautiful Digital Menus for Your Food Truck
          </HeroTitle>
          <HeroSubtitle>
            Build, customize, and share professional digital menus with QR codes. 
            Perfect for food trucks, restaurants, and cafes.
          </HeroSubtitle>
          <CTAButtons>
            <PrimaryButton as="button" onClick={handleGetStarted}>
              Get Started Free
            </PrimaryButton>
            <SecondaryButton to="#features">
              Learn More
            </SecondaryButton>
          </CTAButtons>
        </HeroContent>
      </HeroSection>

      <FeaturesSection id="features">
        <FeaturesContainer>
          <SectionTitle>Everything You Need to Go Digital</SectionTitle>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureIcon>
                  {feature.icon}
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      <Footer>
        <div className="container">
          <p>&copy; 2024 MenuBuilder. Built for food truck owners who want to go digital.</p>
        </div>
      </Footer>
    </HomeContainer>
  );
};

export default Home;