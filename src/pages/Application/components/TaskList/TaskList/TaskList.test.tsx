import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { mockTasks, mockTasksForPagination } from '../../../../../../__mocks__/tasks';
import TaskList from './TaskList';
import { FilterOption } from '@utils/fields/filterOptions';
import { TaskInterface } from '../../../../../types/task';

const renderTaskList = (tasks: TaskInterface[], keyword: string, selected: FilterOption) => {
  const store = configureStore({
    reducer: {
      tasks: () => tasks,
    },
  });

  return render(
    <Provider store={store}>
      <TaskList keyword={keyword} selected={selected} />
    </Provider>,
  );
};

describe('TaskList', () => {
  test('displaying tasks after receipt', async () => {
    renderTaskList(mockTasks, '', 'All');

    const taskList = await screen.findByTestId('task-list');
    expect(taskList).toBeInTheDocument();

    const tasks = await within(taskList).findAllByTestId('task-row');
    expect(tasks).toHaveLength(3);
  });

  test('Displaying cards on mobile devices after receipt', async () => {
    renderTaskList(mockTasks, '', 'All');

    const taskList = await screen.findByTestId('task-list');
    expect(taskList).toBeInTheDocument();

    const tasks = await within(taskList).findAllByTestId('task-mobile');
    expect(tasks).toHaveLength(3);
  });

  test('Filter tasks by keyword', async () => {
    renderTaskList(mockTasks, '2', 'All');

    const table = await screen.findByTestId('task-list-table');
    let rows = within(table).queryAllByTestId('task-row');

    expect(rows).toHaveLength(1);
    expect(within(rows[0]).getByText('Test 2')).toBeInTheDocument();
  });

  test('Filter tasks by category', async () => {
    renderTaskList(mockTasks, '', 'Low');

    const table = await screen.findByTestId('task-list-table');
    let rows = within(table).queryAllByTestId('task-row');

    expect(rows).toHaveLength(1);
    expect(within(rows[0]).getByText('Test 2')).toBeInTheDocument();
  });

  test('An empty block is displayed if there are no tasks', async () => {
    renderTaskList([], '', 'All');

    const emptyBlock = await screen.findByTestId('empty-block');
    const emptyImg = await screen.findByAltText('no data');

    expect(emptyBlock).toBeInTheDocument();
    expect(emptyImg).toBeInTheDocument();
    expect(emptyBlock).toHaveTextContent(/Nothing to see here… yet!/i);
  });

  test('Pagination does not render if there are fewer than 10 tasks', async () => {
    renderTaskList(mockTasks, '', 'All');

    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  test('Pagination is displayed if there are more than 10 tasks', async () => {
    renderTaskList(mockTasksForPagination, '', 'All');

    const pagination = screen.getByTestId('pagination');
    expect(pagination).toBeInTheDocument();
  });

  test('Page turning on a computer', async () => {
    renderTaskList(mockTasksForPagination, '', 'All');

    const pagination = screen.getByTestId('pagination');
    const nextButton = within(pagination).getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    let taskRows = await screen.findAllByTestId('task-row');
    expect(taskRows).toHaveLength(10);
    expect(within(taskRows[0]).getByText('Test 11')).toBeInTheDocument();
    expect(within(taskRows[9]).getByText('Test 20')).toBeInTheDocument();

    const backButton = within(pagination).getByRole('button', { name: /back/i });
    await userEvent.click(backButton);

    taskRows = await screen.findAllByTestId('task-row');
    expect(taskRows[0]).toHaveTextContent('Test 1');
    expect(taskRows[9]).toHaveTextContent('Test 10');
  });

  test('Page turning on a phone ', async () => {
    renderTaskList(mockTasksForPagination, '', 'All');

    const pagination = screen.getByTestId('pagination');
    const nextButton = within(pagination).getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    let taskMobile = await screen.findAllByTestId('task-mobile');
    expect(taskMobile).toHaveLength(10);
    expect(within(taskMobile[0]).getByText('Test 11')).toBeInTheDocument();
    expect(within(taskMobile[9]).getByText('Test 20')).toBeInTheDocument();

    const backButton = within(pagination).getByRole('button', { name: /back/i });
    await userEvent.click(backButton);

    taskMobile = await screen.findAllByTestId('task-row');
    expect(taskMobile[0]).toHaveTextContent('Test 1');
    expect(taskMobile[9]).toHaveTextContent('Test 10');
  });
});
