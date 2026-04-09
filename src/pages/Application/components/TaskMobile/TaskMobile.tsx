import React, { useState, useRef, useEffect } from 'react';
import styles from './TaskMobile.module.scss';
import { calendar } from '@assets/index';
import { useDispatch } from 'react-redux';
import TaskService from '@services/taskService';
import { deleteTasks, updateStatus, restoreTask } from '@store/tasksSlice';
import { showError } from '@store/UI/errorSlice';
import { showSuccess } from '@store/UI/toastSlice';
import { AngleDown, trash } from '@assets/index';
import { updateCategory } from '@store/tasksSlice';
import {
  STATUS_OPTIONS,
  StatusType,
  TaskInterface,
  CATEGORIES_OPTIONS,
  CategoryType,
} from '../../../../types/task';
import DropdownPortal from '../TaskList/DropdownPortal/DropdownPortal';

interface TaskProps {
  task: TaskInterface;
}

const TaskMobile = ({ task }: TaskProps) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState<boolean>(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);
  const [isDeleteMenuOpen, setIsDeleteMenuOpen] = useState<boolean>(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const deleteRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const taskId: string = task._id;
  const isCompleted: boolean = task.status === 'Done';
  const displayDate: string = task.deadline.split('T')[0];

  const closeStatusDropdownHandler = () => setIsStatusDropdownOpen(false);
  const closeCategoryDropdownHandler = () => setIsCategoryDropdownOpen(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node))
        setIsStatusDropdownOpen(false);
      if (deleteRef.current && !deleteRef.current.contains(e.target as Node))
        setIsDeleteMenuOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const completeHandler = async () => {
    const prevStatus = task.status;
    const newStatus = isCompleted ? 'Active' : 'Done';
    dispatch(updateStatus({ id: taskId, status: newStatus }));

    const res = await TaskService.updateStatus(taskId, newStatus);
    if (!res.success) {
      dispatch(updateStatus({ id: taskId, status: prevStatus }));
      dispatch(showError(res.error));
    } else {
      dispatch(showSuccess(isCompleted ? 'Task is active again' : 'The task was completed'));
    }
  };

  const changeStatusHandler = async (status: StatusType) => {
    if (status === task.status) return dispatch(showError('This status is already active'));
    if (status === 'Done') {
      await completeHandler();
      setIsStatusDropdownOpen(false);
      return;
    }

    const prevStatus = task.status;
    dispatch(updateStatus({ id: taskId, status }));
    const res = await TaskService.updateStatus(taskId, status);
    if (!res.success) {
      dispatch(updateStatus({ id: taskId, status: prevStatus }));
      dispatch(showError(res.error));
    } else {
      dispatch(showSuccess('Status has been updated'));
      setIsStatusDropdownOpen(false);
    }
  };

  const changeCategoryHandler = async (newCategory: CategoryType) => {
    const prevCategory = task.category;

    if (newCategory === prevCategory) {
      dispatch(showError('This category is already active'));
      return;
    }

    dispatch(updateCategory({ id: taskId, category: newCategory }));

    const res = await TaskService.updateCategory(taskId, newCategory);
    if (!res.success) {
      dispatch(updateCategory({ id: taskId, category: prevCategory }));
      dispatch(showError(res.error));
      return;
    }

    dispatch(updateCategory({ id: taskId, category: newCategory }));
    dispatch(showSuccess('Category has been updated'));
  };

  const deleteTaskHandler = async () => {
    const deleted = task;
    dispatch(deleteTasks(taskId));
    setIsDeleteMenuOpen(false);

    const res = await TaskService.deleteTasks(taskId);
    if (!res.success) {
      dispatch(restoreTask(deleted));
      dispatch(showError(res.error));
    } else dispatch(showSuccess('The task has been deleted'));
  };

  const getStatusClass = (status: StatusType) => {
    switch (status?.toLowerCase()) {
      case 'done':
        return styles.done;
      case 'inprogress':
        return styles.inprogress;
      case 'archived':
        return styles.archived;
      default:
        return '';
    }
  };

  useEffect(() => {
    const close = () => closeStatusDropdownHandler();

    window.addEventListener('scroll', close, { passive: true });
    window.addEventListener('resize', close);

    return () => {
      window.removeEventListener('scroll', close);
      window.removeEventListener('resize', close);
    };
  }, []);

  useEffect(() => {
    const close = () => closeCategoryDropdownHandler();

    window.addEventListener('scroll', close, { passive: true });
    window.addEventListener('resize', close);

    return () => {
      window.removeEventListener('scroll', close);
      window.removeEventListener('resize', close);
    };
  }, []);

  return (
    <div
      className={`${styles.taskMobile} ${getStatusClass(task.status)}`}
      data-testid="task-mobile"
    >
      <div className={styles.taskMobile__header}>
        <div
          ref={categoryRef}
          className={`${styles.taskMobile__category} ${isCategoryDropdownOpen ? styles.open : ''}`}
          onClick={() => {
            setIsCategoryDropdownOpen((prev) => !prev);
            setIsDeleteMenuOpen(false);
          }}
        >
          <div className={styles.taskMobile__trigger}>
            <div className={styles.taskMobile__category}>{task.category}</div>
            <img
              src={AngleDown}
              alt=""
              style={{ rotate: isCategoryDropdownOpen ? '180deg' : '0deg' }}
            />
          </div>

          <DropdownPortal
            isOpen={isCategoryDropdownOpen}
            anchorRef={categoryRef}
            options={CATEGORIES_OPTIONS}
            onSelect={changeCategoryHandler}
            onClose={closeCategoryDropdownHandler}
          />
        </div>
        <input type="checkbox" checked={isCompleted} onChange={completeHandler} />
      </div>

      <div className={styles.taskMobile__body}>
        <h4 className={styles.taskMobile__title}>{task.task}</h4>

        <div className={styles.taskMobile__meta}>
          <span>
            <img src={calendar} alt="" />
            <p>{displayDate}</p>
          </span>

          <span>Remaining: {task.remainingTime === 0 ? 'None' : `${task.remainingTime}h`}</span>
        </div>
      </div>

      <div className={styles.taskMobile__footer}>
        <div
          ref={statusRef}
          className={`${styles.taskMobile__status} ${isStatusDropdownOpen ? styles.open : ''}`}
          onClick={() => {
            setIsStatusDropdownOpen((prev) => !prev);
            setIsDeleteMenuOpen(false);
          }}
        >
          <div className={styles.taskMobile__trigger}>
            <p>{task.status}</p>
            <img
              src={AngleDown}
              alt=""
              style={{ rotate: isStatusDropdownOpen ? '180deg' : '0deg' }}
            />
          </div>

          <DropdownPortal
            isOpen={isStatusDropdownOpen}
            anchorRef={statusRef}
            options={STATUS_OPTIONS}
            onSelect={changeStatusHandler}
            onClose={closeStatusDropdownHandler}
          />
        </div>

        <div ref={deleteRef} className={styles.taskMobile__actions}>
          <button
            className={styles.taskMobile__deleteButton}
            onClick={() => setIsDeleteMenuOpen((prev) => !prev)}
            data-testid="task-mobile-delete-button"
          >
            <img src={trash} alt="" />
          </button>

          <div
            className={`${styles.taskMobile__deleteMenu} ${
              isDeleteMenuOpen ? styles.taskMobile__deleteMenu_open : ''
            }`}
            data-testid="task-mobile-delete-menu"
          >
            <p>Delete task?</p>
            <div>
              <button onClick={deleteTaskHandler} className={styles.deleteButton}>
                Yes
              </button>
              <button onClick={() => setIsDeleteMenuOpen(false)}>No</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskMobile;
