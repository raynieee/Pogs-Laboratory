// Import necessary libraries and components
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Signup from '@/app/signup/page';
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

  it('renders signup form correctly', () => {
    const { getByPlaceholderText } = render(<Signup />);
    expect(getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('displays error message when email is invalid', async () => {
    const { getByPlaceholderText, getByText, getByRole } = render(<Signup />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const registerButton = getByRole('signUpButton');

    // Simulate user input of an invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'validpassword123' } });
    fireEvent.click(registerButton);

    const errorMessage = getByText(/please enter a valid email address./i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('displays error message when password is too short', async () => {
    const { getByPlaceholderText, getByText, getByRole } = render(<Signup />);

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const registerButton = getByRole('signUpButton');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(registerButton);

    const errorMessage = getByText(/password must be at least 10 characters long./i);
    expect(errorMessage).toBeInTheDocument();
  });
});