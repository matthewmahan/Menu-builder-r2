import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiUpload, FiDollarSign } from 'react-icons/fi';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing.md};
`;

const ModalContent = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${props => props.theme.shadows.xl};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const ModalTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.lg};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  background: transparent;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    background: ${props => props.theme.colors.background.secondary};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const ModalBody = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
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

  &.error {
    border-color: ${props => props.theme.colors.error.main};
  }
`;

const TextArea = styled.textarea`
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.base};
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  transition: ${props => props.theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary.light}33;
  }

  &.error {
    border-color: ${props => props.theme.colors.error.main};
  }
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.base};
  background: white;
  transition: ${props => props.theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary.light}33;
  }
`;

const PriceInputWrapper = styled.div`
  position: relative;
`;

const PriceIcon = styled.div`
  position: absolute;
  left: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.text.secondary};
`;

const PriceInput = styled(Input)`
  padding-left: ${props => props.theme.spacing.xxl};
`;

const ImageUpload = styled.div`
  border: 2px dashed ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
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

const UploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const UploadIcon = styled.div`
  font-size: 2rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const UploadText = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  font-size: ${props => props.theme.fontSizes.sm};
`;

const ImagePreview = styled.div`
  width: 100px;
  height: 100px;
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  margin: 0 auto;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error.main};
  font-size: ${props => props.theme.fontSizes.sm};
  margin-top: ${props => props.theme.spacing.xs};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
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

const CancelButton = styled(Button)`
  background: transparent;
  color: ${props => props.theme.colors.text.secondary};
  border: 1px solid ${props => props.theme.colors.border.medium};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.background.secondary};
  }
`;

const SaveButton = styled(Button)`
  background: ${props => props.theme.colors.primary.main};
  color: white;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary.dark};
  }
`;

const MenuItemModal = ({ isOpen, onClose, onSave, editingItem, categories = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Dishes',
    image: null
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        description: editingItem.description || '',
        price: editingItem.price?.toString() || '',
        category: editingItem.category || 'Main Dishes',
        image: null
      });
      setImagePreview(editingItem.image || null);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: categories[0]?.name || 'Main Dishes',
        image: null
      });
      setImagePreview(null);
    }
    setErrors({});
  }, [editingItem, isOpen, categories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const itemData = {
      ...formData,
      price: parseFloat(formData.price)
    };

    onSave(itemData);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Main Dishes',
      image: null
    });
    setImagePreview(null);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Classic Burger"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Description</Label>
              <TextArea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your delicious item..."
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="price">Price *</Label>
              <PriceInputWrapper>
                <PriceIcon>
                  <FiDollarSign />
                </PriceIcon>
                <PriceInput
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className={errors.price ? 'error' : ''}
                />
              </PriceInputWrapper>
              {errors.price && <ErrorMessage>{errors.price}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Item Image (Optional)</Label>
              <ImageUpload onClick={() => document.getElementById('image-upload').click()}>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                  <ImagePreview>
                    <img src={imagePreview} alt="Preview" />
                  </ImagePreview>
                ) : (
                  <UploadContent>
                    <UploadIcon>
                      <FiUpload />
                    </UploadIcon>
                    <UploadText>Click to upload an image</UploadText>
                  </UploadContent>
                )}
              </ImageUpload>
            </FormGroup>
          </Form>
        </ModalBody>

        <ModalFooter>
          <CancelButton type="button" onClick={handleClose}>
            Cancel
          </CancelButton>
          <SaveButton type="submit" onClick={handleSubmit}>
            {editingItem ? 'Update Item' : 'Add Item'}
          </SaveButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default MenuItemModal;