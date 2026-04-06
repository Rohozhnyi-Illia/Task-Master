import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategorySelect from './CategorySelect';
import { CATEGORIES_OPTIONS, CategoryType } from '../../../types/task';

describe('CategorySelect', () => {
  const defaultProps = {
    options: CATEGORIES_OPTIONS,
    selected: undefined as CategoryType | undefined,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders label when no selected value', () => {
    render(<CategorySelect {...defaultProps} label="Choose category" />);

    expect(screen.getByText('Choose category')).toBeInTheDocument();
  });

  test('renders selected value', () => {
    render(<CategorySelect {...defaultProps} selected="High" />);

    expect(screen.getByText('High')).toBeInTheDocument();
  });

  test('opens dropdown on click', async () => {
    render(<CategorySelect {...defaultProps} />);

    const trigger = screen.getByTestId('category-select-trigger');

    await userEvent.click(trigger);

    expect(screen.getByTestId('category-options')).toBeInTheDocument();
  });

  test('renders all options from CATEGORIES_OPTIONS', async () => {
    render(<CategorySelect {...defaultProps} />);

    await userEvent.click(screen.getByTestId('category-select-trigger'));

    CATEGORIES_OPTIONS.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  test('closes dropdown when clicking outside', async () => {
    render(
      <div>
        <CategorySelect {...defaultProps} />
        <div data-testid="outside">Outside</div>
      </div>,
    );

    const trigger = screen.getByTestId('category-select-trigger');

    await userEvent.click(trigger);
    expect(screen.getByTestId('category-options')).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('outside'));

    expect(screen.queryByTestId('category-options')).not.toBeInTheDocument();
  });

  test('calls onChange with correct value when option is clicked', async () => {
    render(<CategorySelect {...defaultProps} />);

    await userEvent.click(screen.getByTestId('category-select-trigger'));
    await userEvent.click(screen.getByText('Critical'));

    expect(defaultProps.onChange).toHaveBeenCalledWith('Critical');
  });

  test('closes dropdown after selecting option', async () => {
    render(<CategorySelect {...defaultProps} />);

    await userEvent.click(screen.getByTestId('category-select-trigger'));
    await userEvent.click(screen.getByText('Low'));

    expect(screen.queryByTestId('category-options')).not.toBeInTheDocument();
  });

  test('opens dropdown with Enter key', () => {
    render(<CategorySelect {...defaultProps} />);

    fireEvent.keyDown(screen.getByTestId('category-select-component'), {
      key: 'Enter',
    });

    expect(screen.getByTestId('category-options')).toBeInTheDocument();
  });

  test('opens dropdown with Space key', () => {
    render(<CategorySelect {...defaultProps} />);

    fireEvent.keyDown(screen.getByTestId('category-select-component'), {
      key: ' ',
    });

    expect(screen.getByTestId('category-options')).toBeInTheDocument();
  });

  test('closes dropdown with Escape key', () => {
    render(<CategorySelect {...defaultProps} />);

    const wrapper = screen.getByTestId('category-select-component');

    fireEvent.keyDown(wrapper, { key: 'Enter' });
    expect(screen.getByTestId('category-options')).toBeInTheDocument();

    fireEvent.keyDown(wrapper, { key: 'Escape' });

    expect(screen.queryByTestId('category-options')).not.toBeInTheDocument();
  });

  test('selects option with keyboard (Enter)', async () => {
    render(<CategorySelect {...defaultProps} />);

    await userEvent.click(screen.getByTestId('category-select-trigger'));

    const option = screen.getByText('High');

    fireEvent.keyDown(option, { key: 'Enter' });

    expect(defaultProps.onChange).toHaveBeenCalledWith('High');
  });

  test('focuses first option when opened', async () => {
    render(<CategorySelect {...defaultProps} />);

    await userEvent.click(screen.getByTestId('category-select-trigger'));

    const firstOption = screen.getByText(CATEGORIES_OPTIONS[0]);

    expect(firstOption).toHaveFocus();
  });

  test('applies active class to selected option', async () => {
    render(<CategorySelect {...defaultProps} selected="Middle" />);

    await userEvent.click(screen.getByTestId('category-select-trigger'));

    const optionsList = screen.getByTestId('category-options');

    const activeOption = within(optionsList).getByText('Middle');

    expect(activeOption.className).toMatch(/active/);
  });
});
