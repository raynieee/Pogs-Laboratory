// Import necessary libraries and components
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Signup from '@/app/signup/page';
import { signup } from '@/utils/createUser';
import '@testing-library/jest-dom';

window.alert = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

// Mock external dependencies
jest.mock('@/utils/createUser', () => ({
  signup: jest.fn(),
}));
jest.mock('validator', () => ({
  isEmail: jest.fn(),
}));
jest.mock('axios');

describe('Signup Component', () => {
  let router;

  beforeEach(() => {
    router = {
      push: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render signup form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<Signup />);
    expect(getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('should display error message when email is invalid', async () => {
    const { getByPlaceholderText, getByText } = render(<Signup />);
    const emailInput = getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const errorMessage = getByText(/please enter a valid email address./i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('should display error message when password is too short', async () => {
    const { getByPlaceholderText, getByText } = render(<Signup />);
    const emailInput = getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const passwordInput = getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'short' } });

    const errorMessage = getByText(/password must be at least 10 characters long./i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('should submit form and redirect to login page on success', async () => {
    const { getByPlaceholderText, getByText, getByRole } = render(<Signup />);
    const emailInput = getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const passwordInput = getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password123456789' } });

    const firstNameInput = getByPlaceholderText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    const lastNameInput = getByPlaceholderText('Last Name');
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    const positionSelect = getByRole('position');
    fireEvent.change(positionSelect, { target: { value: 'Admin' } });

    const submitButton = getByRole('signUpButton');
    fireEvent.click(submitButton);

    await waitFor(() => expect(signup).toHaveBeenCalled());
    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/login'));
  });

  it('should handle signup failure', async () => {
    const { getByPlaceholderText, getByText, getByRole } = render(<Signup />);
    const emailInput = getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const passwordInput = getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    const firstNameInput = getByPlaceholderText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    const lastNameInput = getByPlaceholderText('Last Name');
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    const positionSelect = getByRole('position');
    fireEvent.change(positionSelect, { target: { value: 'Admin' } });

    const submitButton = getByRole('signUpButton');
    fireEvent.click(submitButton);

    await waitFor(() => expect(signup).toHaveBeenCalled());
    expect(getByText(/an error occurred during registration./i)).toBeInTheDocument();
  });
});