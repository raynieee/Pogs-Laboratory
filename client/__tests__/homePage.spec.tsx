import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/app/home/page';
import { fetchAllPogs } from '@/utils/getPogs';
import { getUserProfile } from '@/utils/userDetails';
import { buyPog } from '@/utils/buyPog';
import { sellPog } from '@/utils/sellPog';

// Define interfaces for the return types of your mocked functions
interface FetchAllPogsReturn {
  id: number;
  name: string;
  tickerSymbol: string;
  price: number;
  previousPrice: number;
  color: string;
}

interface UserProfile {
  name: string;
  eWallet: string;
}

// Mock implementations with the correct return types
const mockFetchAllPogs = jest.fn(async () => Promise.resolve([{ id: 1, name: 'Pog1', tickerSymbol: 'POG1', price: 10, previousPrice: 9, color: 'blue' }]));
const mockGetUserProfile = jest.fn(async () => Promise.resolve({ name: 'John Doe', eWallet: '$1000' }));
const mockBuyPog = jest.fn(async (id: number, userId: number, sharesToBuy: number) => {});
const mockSellPog = jest.fn(async (id: number, userId: number, sharesToSell: number) => {});

// Mock modules
jest.mock('@/utils/getPogs', () => ({
  fetchAllPogs: mockFetchAllPogs,
}));

jest.mock('@/utils/userDetails', () => ({
  getUserProfile: mockGetUserProfile,
}));

jest.mock('@/utils/buyPog', () => ({
  buyPog: mockBuyPog,
}));

jest.mock('@/utils/sellPog', () => ({
  sellPog: mockSellPog,
}));

describe('Home Page', () => {
  beforeEach(() => {
    localStorage.setItem('userId', '123'); // Simulate logged-in user
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the home page with user profile and pogs', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Welcome John Doe')).toBeInTheDocument();
      expect(screen.getByText('E-Wallet Amount: $1000')).toBeInTheDocument();
      expect(screen.getByText('Pog1')).toBeInTheDocument();
    });
  });

  test('handles buying a pog', async () => {
    render(<Home />);

    const buyButton = await screen.findByRole('button', { name: /Buy Pog/i });
    fireEvent.click(buyButton);

    await waitFor(() => {
      expect(mockBuyPog).toHaveBeenCalledWith(1, 123, 1);
      expect(alert).toHaveBeenCalledWith('Pog bought successfully.');
    });
  });

  test('handles selling a pog', async () => {
    render(<Home />);

    const sellButton = await screen.findByRole('button', { name: /Sell Pog/i });
    fireEvent.click(sellButton);

    await waitFor(() => {
      expect(mockSellPog).toHaveBeenCalledWith(1, 123, 1);
      expect(alert).toHaveBeenCalledWith('Pog sold successfully.');
    });
  });
});