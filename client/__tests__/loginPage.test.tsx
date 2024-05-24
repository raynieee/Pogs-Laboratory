// Import necessary libraries and components
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Login from '@/app/login/page';
import '@testing-library/jest-dom';

// Mock the login function
jest.mock('@/utils/userLogin', () => ({
  login: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Login Component', () => {
  let router;

  beforeEach(() => {
    router = {
      push: jest.fn(), // Mock the push method to control navigation
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      query: {},
      pathname: '',
      route: '',
      asPath: '',
      basePath: '',
      locale: undefined,
      locales: [],
      defaultLocale: undefined,
      isFallback: false,
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  it('renders login form correctly', () => {
    const { getByPlaceholderText } = render(<Login />);
    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('displays error message when email is invalid', async () => {
    const { getByPlaceholderText, getByRole, getByText } = render(<Login />);

    // Find the email input field by its placeholder text
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByRole('loginButton');

    // Simulate user input of an invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'validpassword123' } });
    fireEvent.click(loginButton);

    expect(getByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  it('displays error message when password is too short', async () => {
    const { getByPlaceholderText, getByRole, getByText } = render(<Login />);

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByRole('loginButton');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(loginButton);

    expect(getByText("Password must be at least 10 characters long.")).toBeInTheDocument();
  });
});