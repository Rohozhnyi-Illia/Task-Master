import { CATEGORIES_OPTIONS } from '../../../../../types/task';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DropdownPortal from './DropdownPortal';
import React from 'react';

const setup = (isOpen = true) => {
  const onSelect = jest.fn();
  const onClose = jest.fn();

  const anchor = document.createElement('div');
  document.body.appendChild(anchor);

  const anchorRef = {
    current: anchor,
  } as React.RefObject<HTMLDivElement>;

  if (anchorRef.current) {
    anchorRef.current.getBoundingClientRect = jest.fn(() => ({
      top: 100,
      left: 100,
      width: 200,
      height: 50,
      bottom: 150,
      right: 300,
      x: 100,
      y: 100,
      toJSON: () => ({}),
    }));
  }
  render(
    <DropdownPortal
      isOpen={isOpen}
      anchorRef={anchorRef}
      options={CATEGORIES_OPTIONS}
      onSelect={onSelect}
      onClose={onClose}
    />,
  );

  return { onSelect, onClose, anchor };
};

describe('DropdownPortal', () => {
  test('renders when open', async () => {
    setup(true);

    expect(await screen.findByText('High')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getByText('Middle')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    setup(false);

    expect(screen.queryByText('High')).not.toBeInTheDocument();
  });

  test('select option calls onSelect and onClose', async () => {
    const { onSelect, onClose } = setup(true);

    const option = await screen.findByText('High');

    await userEvent.click(option);

    expect(onSelect).toHaveBeenCalledWith('High');

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  test('click outside calls onClose', async () => {
    const { onClose } = setup(true);

    await userEvent.click(document.body);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  test('press Escape calls onClose', async () => {
    const { onClose } = setup(true);

    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
