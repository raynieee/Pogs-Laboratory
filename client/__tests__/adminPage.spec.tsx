import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Admin from '@/app/admin/page';
import { addPog } from '@/utils/addPog';
import { deletePog } from '@/utils/deletePog';
import { fetchAllPogs } from '@/utils/getPogs';
import '@testing-library/jest-dom';

window.alert = jest.fn();

// Mock the entire module and restore the original implementations of the functions you want to keep
jest.mock('@/utils/addPog', () => {
  const originalModule = jest.requireActual('@/utils/addPog');
  return {
  ...originalModule,
    addPog: jest.fn((name, price, tickerSymbol, color) => Promise.resolve({ id: 1, name, tickerSymbol, price, color })),
  };
});

jest.mock('@/utils/deletePog', () => {
  const originalModule = jest.requireActual('@/utils/deletePog');
  return {
  ...originalModule,
    deletePog: jest.fn((id) => Promise.resolve()),
  };
});

jest.mock('@/utils/getPogs', () => {
  const originalModule = jest.requireActual('@/utils/getPogs');
  return {
   ...originalModule,
    fetchAllPogs: jest.fn(() => Promise.resolve([
      { id: 1, name: 'Rabbit', tickerSymbol: 'PGRAAH', price: 100, color: 'Yellow' },
      { id: 2, name: 'Winnie the Pooh', tickerSymbol: 'PGWPAB', price: 200, color: '#fff19c' },
    ])),
  };
});

jest.mock('@/utils/updatePog', () => {
  const originalModule = jest.requireActual('@/utils/updatePog');
  return {
  ...originalModule,
    updatePog: jest.fn(() => Promise.resolve()),
  };
});

describe('Admin', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('adds a new pog', async () => {
    const mockAddPog = jest.fn((name, price, tickerSymbol, color) => Promise.resolve({ id: 1, name, tickerSymbol, price, color }));
    (addPog as jest.MockedFunction<typeof addPog>).mockImplementation(mockAddPog);

    render(<Admin />);
    fireEvent.click(screen.getByText('Add Pog'));

    const nameInput = screen.getByPlaceholderText('Enter Pog Name');
    const tickerSymbolInput = screen.getByPlaceholderText('Enter Pog Ticker Symbol');
    const priceInput = screen.getByPlaceholderText('Enter Pog Price');
    const colorInput = screen.getByPlaceholderText('Enter Pog Color');

    fireEvent.change(nameInput, { target: { value: 'Rabbit' } });
    fireEvent.change(tickerSymbolInput, { target: { value: 'PGRAAH' } });
    fireEvent.change(priceInput, { target: { value: '100' } });
    fireEvent.change(colorInput, { target: { value: 'Yellow' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(addPog).toHaveBeenCalledWith('Rabbit', 100, 'PGRAAH', 'Yellow'));
    expect(screen.queryByPlaceholderText('Enter Pog Name')).not.toBeInTheDocument();
  });

  test('deletes a pog', async () => {
    const mockDeletePog = jest.fn((id) => Promise.resolve());
    (deletePog as jest.MockedFunction<typeof deletePog>).mockImplementation(mockDeletePog);

    const pogs = [
      { id: 1, name: 'Rabbit', tickerSymbol: 'PGRAAH', price: 100, color: 'Yellow' },
      { id: 2, name: 'Winnie the Pooh', tickerSymbol: 'PGWPAB', price: 200, color: '#fff19c' },
    ];

    (fetchAllPogs as jest.MockedFunction<typeof fetchAllPogs>).mockResolvedValue(pogs);

    render(<Admin />);

    const deleteButton = await screen.findAllByText('Delete');
    fireEvent.click(deleteButton[0]);

    await waitFor(() => expect(mockDeletePog).toHaveBeenCalledWith(1));
    expect(await screen.findByText('Rabbit')).not.toBeInTheDocument();
    expect(screen.getByText('Winnie the Pooh')).toBeInTheDocument();
  });
});
