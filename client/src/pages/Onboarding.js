import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiArrowLeft, FiArrowRight, FiCheck, FiUpload, FiMenu, FiPlus } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useMenu } from '../contexts/MenuContext';
import LoadingSpinner from '../components/LoadingSpinner';

const OnboardingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary.light} 0%, ${props => props.theme.colors.primary.main} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.md};
`;

const OnboardingCard = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.xl};
  width: 100%;
  max-width: 600px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 4px;
  background: ${props => props.theme.colors.background.secondary};
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.theme.colors.primary.main};
  width: ${props => (props.step / props.totalSteps) * 100}%;
  transition: width 0.3s ease;
`;

const StepContent = styled.div`
  padding: ${props => props.theme.spacing.xxl};
  text-align: center;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StepIcon = styled.div`
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

const StepTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes.xxl};
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.primary};
`;

const StepDescription = styled.p`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xl};
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
  max-width: 400px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const Label = styled.label`
  font-weight: ${props => props.theme.fontWeights.medium};
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.primary};
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.base};
  transition: ${props => props.theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary.light}33;
  }
`;

const TextArea = styled.textarea`
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.base};
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: ${props => props.theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary.light}33;
  }
`;

const FileUpload = styled.div`
  border: 2px dashed ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    border-color: ${props => props.theme.colors.primary.main};
    background: ${props => props.theme.colors.primary.light}11;
  }

  input {
    display: none;
  }
`;

const UploadIcon = styled.div`
  font-size: 2rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const UploadText = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.xl};
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
  font-size: ${props => props.theme.fontSizes.base};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BackButton = styled(Button)`
  background: transparent;
  color: ${props => props.theme.colors.text.secondary};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.background.secondary};
  }
`;

const NextButton = styled(Button)`
  background: ${props => props.theme.colors.primary.main};
  color: white;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary.dark};
    transform: translateY(-1px);
  }
`;

const SkipButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  font-size: ${props => props.theme.fontSizes.sm};
  text-decoration: underline;

  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

const MenuItemsForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  max-width: 500px;
  margin: 0 auto;
`;

const MenuItemRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr auto;
  gap: ${props => props.theme.spacing.sm};
  align-items: center;
  padding: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const MenuItemInput = styled.input`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.sm};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.main};
  }
`;

const MenuItemPriceInput = styled(MenuItemInput)`
  text-align: right;
`;

const MenuItemSelect = styled.select`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.sm};
  background: white;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.main};
  }
`;

const RemoveButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: ${props => props.theme.colors.error.main};
  color: white;
  cursor: pointer;
  font-size: ${props => props.theme.fontSizes.sm};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.colors.error.dark};
  }
`;

const AddItemButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  border: 2px dashed ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  background: transparent;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    border-color: ${props => props.theme.colors.primary.main};
    color: ${props => props.theme.colors.primary.main};
  }
`;

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, updateOnboarding } = useAuth();
  const { createMenu } = useMenu();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: user?.businessName || '',
    tagline: '',
    description: '',
    logo: null,
    menuItems: []
  });

  const totalSteps = 6;

  useEffect(() => {
    if (user?.onboardingStep) {
      setCurrentStep(Math.max(1, user.onboardingStep));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        logo: file
      }));
    }
  };

  const handleAddMenuItem = () => {
    const newItem = {
      id: Date.now(),
      name: '',
      description: '',
      price: '',
      category: 'Main Dishes'
    };
    setFormData(prev => ({
      ...prev,
      menuItems: [...prev.menuItems, newItem]
    }));
  };

  const handleUpdateMenuItem = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      menuItems: prev.menuItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleRemoveMenuItem = (id) => {
    setFormData(prev => ({
      ...prev,
      menuItems: prev.menuItems.filter(item => item.id !== id)
    }));
  };

  const handleNext = async () => {
    setLoading(true);
    
    try {
      // Update onboarding progress
      await updateOnboarding({
        step: currentStep + 1,
        data: currentStep === 1 ? { businessName: formData.businessName } : {}
      });

      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        // Complete onboarding and create first menu
        await completeOnboarding();
      }
    } catch (error) {
      console.error('Error updating onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      // Create the first menu with items
      const menuItems = formData.menuItems
        .filter(item => item.name.trim() && item.price)
        .map(item => ({
          name: item.name.trim(),
          description: item.description.trim(),
          price: parseFloat(item.price),
          category: item.category
        }));

      const menuResult = await createMenu({
        businessName: formData.businessName,
        tagline: formData.tagline,
        description: formData.description,
        items: menuItems,
        categories: [
          { name: 'Main Dishes', order: 0 },
          { name: 'Sides', order: 1 },
          { name: 'Beverages', order: 2 }
        ]
      });

      if (menuResult.success) {
        // Mark onboarding as completed
        await updateOnboarding({
          completed: true,
          step: totalSteps
        });

        // Navigate to menu editor
        navigate(`/menu-editor/${menuResult.data._id}`);
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const handleSkip = async () => {
    await updateOnboarding({
      completed: true,
      step: totalSteps
    });
    navigate('/dashboard');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <StepIcon>
              <FiMenu />
            </StepIcon>
            <StepTitle>Welcome to MenuBuilder!</StepTitle>
            <StepDescription>
              Let's get your food truck's digital menu set up in just a few steps. 
              We'll help you create a professional menu that your customers will love.
            </StepDescription>
            <Form onSubmit={(e) => e.preventDefault()}>
              <FormGroup>
                <Label htmlFor="businessName">What's your business name?</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="e.g., Joe's Food Truck"
                  required
                />
              </FormGroup>
            </Form>
          </>
        );

      case 2:
        return (
          <>
            <StepIcon>
              <FiCheck />
            </StepIcon>
            <StepTitle>Tell us about your business</StepTitle>
            <StepDescription>
              Add a catchy tagline that describes what makes your food special.
            </StepDescription>
            <Form onSubmit={(e) => e.preventDefault()}>
              <FormGroup>
                <Label htmlFor="tagline">Tagline (optional)</Label>
                <Input
                  id="tagline"
                  name="tagline"
                  type="text"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  placeholder="e.g., Authentic Street Tacos Since 2020"
                />
              </FormGroup>
            </Form>
          </>
        );

      case 3:
        return (
          <>
            <StepIcon>
              <FiMenu />
            </StepIcon>
            <StepTitle>Describe your cuisine</StepTitle>
            <StepDescription>
              Give customers a brief description of your food style and specialties.
            </StepDescription>
            <Form onSubmit={(e) => e.preventDefault()}>
              <FormGroup>
                <Label htmlFor="description">Description (optional)</Label>
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., We serve fresh, authentic Mexican street food made with locally sourced ingredients..."
                />
              </FormGroup>
            </Form>
          </>
        );

      case 4:
        return (
          <>
            <StepIcon>
              <FiUpload />
            </StepIcon>
            <StepTitle>Upload your logo</StepTitle>
            <StepDescription>
              Add your business logo to make your menu look professional. You can always add this later.
            </StepDescription>
            <Form onSubmit={(e) => e.preventDefault()}>
              <FormGroup>
                <Label>Logo (optional)</Label>
                <FileUpload onClick={() => document.getElementById('logo-upload').click()}>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <UploadIcon>
                    <FiUpload />
                  </UploadIcon>
                  <UploadText>
                    {formData.logo ? formData.logo.name : 'Click to upload your logo'}
                  </UploadText>
                </FileUpload>
              </FormGroup>
            </Form>
          </>
        );

      case 5:
        return (
          <>
            <StepIcon>
              <FiMenu />
            </StepIcon>
            <StepTitle>Add your first menu items</StepTitle>
            <StepDescription>
              Let's add a few items to get your menu started. You can always add more later!
            </StepDescription>
            <MenuItemsForm>
              {formData.menuItems.map((item) => (
                <MenuItemRow key={item.id}>
                  <MenuItemInput
                    type="text"
                    placeholder="Item name"
                    value={item.name}
                    onChange={(e) => handleUpdateMenuItem(item.id, 'name', e.target.value)}
                  />
                  <MenuItemInput
                    type="text"
                    placeholder="Description (optional)"
                    value={item.description}
                    onChange={(e) => handleUpdateMenuItem(item.id, 'description', e.target.value)}
                  />
                  <MenuItemPriceInput
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => handleUpdateMenuItem(item.id, 'price', e.target.value)}
                  />
                  <MenuItemSelect
                    value={item.category}
                    onChange={(e) => handleUpdateMenuItem(item.id, 'category', e.target.value)}
                  >
                    <option value="Main Dishes">Main Dishes</option>
                    <option value="Sides">Sides</option>
                    <option value="Beverages">Beverages</option>
                  </MenuItemSelect>
                  <RemoveButton
                    type="button"
                    onClick={() => handleRemoveMenuItem(item.id)}
                  >
                    ×
                  </RemoveButton>
                </MenuItemRow>
              ))}
              <AddItemButton type="button" onClick={handleAddMenuItem}>
                <FiPlus />
                Add Menu Item
              </AddItemButton>
            </MenuItemsForm>
          </>
        );

      case 6:
        return (
          <>
            <StepIcon>
              <FiCheck />
            </StepIcon>
            <StepTitle>You're all set!</StepTitle>
            <StepDescription>
              Perfect! We'll now create your digital menu with {formData.menuItems.filter(item => item.name.trim()).length} items.
              You can always add more items and customize your menu later.
            </StepDescription>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <OnboardingContainer>
      <OnboardingCard>
        <ProgressBar>
          <ProgressFill step={currentStep} totalSteps={totalSteps} />
        </ProgressBar>
        
        <StepContent>
          {renderStepContent()}
        </StepContent>

        <ButtonGroup>
          <div>
            {currentStep > 1 && (
              <BackButton onClick={handleBack} disabled={loading}>
                <FiArrowLeft />
                Back
              </BackButton>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {currentStep < totalSteps && (
              <SkipButton onClick={handleSkip}>
                Skip for now
              </SkipButton>
            )}
            
            <NextButton 
              onClick={handleNext} 
              disabled={loading || (currentStep === 1 && !formData.businessName.trim())}
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  {currentStep === totalSteps ? 'Create Menu' : 'Next'}
                  <FiArrowRight />
                </>
              )}
            </NextButton>
          </div>
        </ButtonGroup>
      </OnboardingCard>
    </OnboardingContainer>
  );
};

export default Onboarding;