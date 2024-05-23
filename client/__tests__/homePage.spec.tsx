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

window.alert = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock('@/utils/userDetails', () => ({
  ...jest.requireActual('@/utils/userDetails'),
  getUserProfile: jest.fn(() => Promise.resolve({ name: "John Doe", eWallet: "$1000" }))
}));

jest.mock('@/utils/getPogs', () => ({
  ...jest.requireActual('@/utils/getPogs'),
  fetchAllPogs: jest.fn(() => Promise.resolve([
    { id: 1, name: 'Pog1', tickerSymbol: 'POG1', price: 10, previousPrice: 9, color: 'blue' }
  ]))
}));

jest.mock('@/utils/buyPog', () => ({
  ...jest.requireActual('@/utils/buyPog'),
    buyPog: jest.fn(async (id: number, userId: number, sharesToBuy: number) => {})
}));

jest.mock('@/utils/sellPog', () => ({
  ...jest.requireActual('@/utils/sellPog'),
    sellPog: jest.fn(async (id: number, userId: number, sharesToSell: number) => {})
}));

describe('Home Page', () => {
  beforeEach(() => {
    localStorage.setItem('userId', '123'); // Simulate logged-in user
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the home page with user profile and pogs', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Welcome John Doe')).toBeInTheDocument();
      expect(screen.getByText('E-Wallet Amount: $1000')).toBeInTheDocument();
      expect(screen.getByText('Pog1')).toBeInTheDocument();
    });
  });

  it('should handle buying a pog', async () => {
    render(<Home />);

    const buyButton = await screen.findByRole('button', { name: /Buy Pog/i });
    fireEvent.click(buyButton);

    await waitFor(() => {
      expect(buyPog).toHaveBeenCalledWith(1, 123, 1);
      expect(alert).toHaveBeenCalledWith('Pog bought successfully.');
    });
  });

  it('should handle selling a pog', async () => {
    render(<Home />);

    const sellButton = await screen.findByRole('button', { name: /Sell Pog/i });
    fireEvent.click(sellButton);

    await waitFor(() => {
      expect(sellPog).toHaveBeenCalledWith(1, 123, 1);
      expect(alert).toHaveBeenCalledWith('Pog sold successfully.');
    });
  });
});