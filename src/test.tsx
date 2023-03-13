import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Checkout from './Checkout';
describe('Checkout', () => {
  beforeEach(() => {
    render(<Checkout />);
  });

  test('renders checkout heading', () => {
    const heading = screen.getByRole('heading', { name: /checkout/i });
    expect(heading).toBeInTheDocument();
  });

  test('adds item to cart', () => {
    const itemName = 'Product A';
    const addToCartButton = screen.getByRole('button', { name: `Add ${itemName} to cart` });

    fireEvent.click(addToCartButton);

    const cartItem = screen.getByText(itemName);
    expect(cartItem).toBeInTheDocument();
  });

  test('removes item from cart', () => {
    const itemName = 'Product A';
    const addToCartButton = screen.getByRole('button', { name: `Add ${itemName} to cart` });
    fireEvent.click(addToCartButton);

    const removeItemButton = screen.getByRole('button', { name: `Remove ${itemName} from cart` });
    fireEvent.click(removeItemButton);

    const cartItem = screen.queryByText(itemName);
    expect(cartItem).not.toBeInTheDocument();
  });
});