// Import necessary libraries and components
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Login from '@/app/login/page';
import { login } from '@/utils/userLogin';
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

  test('renders login form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<Login />);
    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('displays error message when email is invalid', async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);
    const emailInput = getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const errorMessage = getByText(/please enter a valid email address./i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('displays error message when password is too short', async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);
    const emailInput = getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const passwordInput = getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'short' } });

    const errorMessage = getByText(/password must be at least 10 characters long./i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('submits form and redirects to home page on success', async () => {
    const { getByPlaceholderText, getByRole } = render(<Login />);
    const emailInput = getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const passwordInput = getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password123456789' } });

    const submitButton = getByRole('loginButton');
    fireEvent.click(submitButton);

    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/home'));
  });

  test('handles login failure', async () => {
    const { getByPlaceholderText, getByText, getByRole} = render(<Login />);
    const emailInput = getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const passwordInput = getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    const submitButton = getByRole('loginButton');
    fireEvent.click(submitButton);

    await waitFor(() => expect(login).toHaveBeenCalled());
    expect(getByText(/an error occurred during login./i)).toBeInTheDocument();
  });
});
