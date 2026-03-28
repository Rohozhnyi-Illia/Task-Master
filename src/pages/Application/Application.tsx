import React, { ChangeEvent, useEffect, useState } from 'react';
import styles from './Application.module.scss';
import { search, DragAndDrop } from '@assets/index';
import { CategorySelect } from '@components/index';
import AddButton from './components/AddButton/AddButton';
import TaskList from './components/TaskList/TaskList/TaskList';
import AddModal from './components/AddModal/AddModal';
import TaskService from '@services/taskService';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks } from '@store/tasksSlice';
import { showError } from '@store/UI/errorSlice';
import { showLoader, closeLoader } from '@store/UI/loaderSlice';
import { setFirstAppLoadDone } from '@store/appSlice';
import DragAndDropContainer from './components/DragAndDrop/Container/Container';
import { FILTER_OPTIONS, FilterOption } from '@utils/fields/filterOptions';
import { RootState } from '@store/store';
import { TaskInterface } from '../../types/task';

const Application = () => {
  const [selected, setSelected] = useState<FilterOption | undefined>(undefined);
  const [keywordValue, setKeyWordValue] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isDragAndDropOpen, setIsDragAndDropOpen] = useState<boolean>(false);
  const firstAppLoadDone: boolean = useSelector((state: RootState) => state.app.firstAppLoadDone);
  const tasks: TaskInterface[] = useSelector((state: RootState) => state.tasks);

  const dispatch = useDispatch();

  const keywordValueHandler = (e: ChangeEvent<HTMLInputElement>) => setKeyWordValue(e.target.value);
  const openModalHandler = () => setIsAddModalOpen(!isAddModalOpen);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!firstAppLoadDone) {
        dispatch(showLoader());
      }

      try {
        const res = await TaskService.getAllTasks();
        if (res.success) {
          dispatch(getTasks(res.data));
        } else {
          dispatch(showError(res.error));
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          dispatch(showError(error.message || 'Something went wrong'));
        } else if (typeof error === 'string') {
          dispatch(showError(error));
        } else {
          dispatch(showError('Something went wrong'));
        }
      } finally {
        if (!firstAppLoadDone) {
          dispatch(setFirstAppLoadDone());
          dispatch(closeLoader());
        }
      }
    };

    fetchTasks();
  }, [dispatch]);

  const openDropAndDownHandler = () => {
    setIsDragAndDropOpen(!isDragAndDropOpen);
  };

  return (
    <div className={styles.application}>
      <div className="container">
        <div className={styles.application__wrapper}>
          <header className={styles.application__header}>
            <h3 className={styles.application__title}>Task List</h3>

            {tasks.length > 0 && (
              <div className={styles.application__search} data-testid="keyword-input">
                <input
                  type="text"
                  className={styles.application__search_input}
                  placeholder="Keyword"
                  onChange={keywordValueHandler}
                  value={keywordValue}
                />
                <img src={search} alt="search" className={styles.application__search_icon} />
              </div>
            )}

            {tasks.length > 0 && (
              <div className={styles.application__categories} data-testid="category-select">
                <CategorySelect<FilterOption>
                  label="Select a category"
                  options={FILTER_OPTIONS}
                  onChange={(val) => setSelected(val)}
                  selected={selected}
                />
              </div>
            )}

            <AddButton
              className={styles.application__newTaskBtn}
              onClick={openModalHandler}
              type="button"
              data-testid="add-button"
            />
          </header>

          {tasks.length > 1 && (
            <div className={styles.drag}>
              <button
                className={styles.drag__button}
                onClick={openDropAndDownHandler}
                data-testid="drag-and-drop-button"
              >
                <img src={DragAndDrop} alt="" />
              </button>

              <p className={styles.drag__text}>Change the order</p>
            </div>
          )}

          <TaskList keyword={keywordValue} selected={selected} />
        </div>

        <DragAndDropContainer
          isDragAndDropOpen={isDragAndDropOpen}
          openDropAndDownHandler={openDropAndDownHandler}
        />

        {isAddModalOpen && (
          <AddModal openModalHandler={openModalHandler} isAddModalOpen={isAddModalOpen} />
        )}
      </div>
    </div>
  );
};

export default Application;
