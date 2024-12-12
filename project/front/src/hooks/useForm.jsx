/**
 * Custom hook for form handling with validation
 * @param {Object} initialState - The initial state of the form data
 * @param {Function} validate - Validation function that takes form data and returns error object
 * @returns {Object} Form handling methods and state
 * @returns {Object} returns.formData - Current form data state
 * @returns {Object} returns.errors - Current form validation errors
 * @returns {Function} returns.handleChange - Event handler for form input changes
 * @returns {Function} returns.setFormData - State setter for form data
 * @returns {Function} returns.setErrors - State setter for validation errors
 * @returns {Function} returns.validateForm - Function to validate entire form
 */
import { useState } from "react";

const useForm = (initialState, validate) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = validate(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    handleChange,
    setFormData,
    setErrors,
    validateForm,
  };
};

export default useForm;
