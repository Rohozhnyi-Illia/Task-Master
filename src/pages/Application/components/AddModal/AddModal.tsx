import React, { useEffect, useRef, useState } from 'react';
import styles from './AddModal.module.scss';
import { CategorySelect, ErrorMessage } from '@components/index';
import AddButton from '../AddButton/AddButton';
import { FaCircleXmark } from 'react-icons/fa6';
import addTaskSchema from '@utils/validation/addTask-validation';
import TaskService from '@services/taskService';
import { createTask } from '@store/tasksSlice';
import { useDispatch, useSelector } from 'react-redux';
import capitalize from '@utils/helpers/capitalize';
import { showError } from '@store/UI/errorSlice';
import { showLoader, closeLoader } from '@store/UI/loaderSlice';
import { showSuccess } from '@store/UI/toastSlice';
import { RootState } from '@store/store';
import { CategoryType } from '../../../../types/task';
import { AddTaskValues } from '@utils/validation/addTask-validation';
import * as yup from 'yup';

interface AddModalProps {
  openModalHandler: () => void;
  isAddModalOpen: boolean;
}
type FormErrors = {
  task?: string;
  category?: string;
  day?: string;
  month?: string;
  year?: string;
  date?: string;
};

const AddModal = ({ openModalHandler, isAddModalOpen }: AddModalProps) => {
  const [categorySelected, setCategorySelected] = useState<CategoryType | ''>('');
  const [reminderSelected, setReminderSelected] = useState<string>('');
  const [task, setTask] = useState<string>('');
  const [deadline, setDeadline] = useState<{ day: string; month: string; year: string }>({
    day: '',
    month: '',
    year: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const dispatch = useDispatch();
  const isSubmittingRef = useRef(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const isLoaderShown: boolean = useSelector((state: RootState) => state.loader.isLoaderShown);

  const closeModalSmooth = () => {
    setIsClosing(true);
    setTimeout(() => {
      openModalHandler();
      setIsClosing(false);
    }, 400);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length > 30) return;
    setTask(value);
  };

  const deadlineHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeadline({ ...deadline, [name]: value });
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const formDataRaw = {
      task: capitalize(task.trim()),
      category: categorySelected,
      day: deadline.day,
      month: deadline.month,
      year: deadline.year,
    };

    try {
      const validatedData: AddTaskValues = await addTaskSchema.validate(formDataRaw, {
        abortEarly: false,
      });
      setErrors({});

      dispatch(showLoader());

      const formattedDate = new Date(
        Date.UTC(
          Number(validatedData.year),
          Number(validatedData.month) - 1,
          Number(validatedData.day),
        ),
      );
      const now = new Date();
      now.setHours(0, 0, 0);

      if (formattedDate < now) {
        setErrors({ date: 'Deadline must be in the future' });
        return;
      }

      const res = await TaskService.createTask({
        task: validatedData.task,
        status: 'Active',
        category: validatedData.category,
        remainingTime: Number(reminderSelected),
        deadline: formattedDate.toISOString(),
      });

      if (!res.success) {
        dispatch(showError(res.error));
        return;
      }

      dispatch(createTask(res.data));

      setTask('');
      setCategorySelected('');
      setReminderSelected('');
      setDeadline({ day: '', month: '', year: '' });

      closeModalSmooth();
      dispatch(showSuccess('The task has been added'));
    } catch (err: unknown) {
      if (err instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};

        err.inner.forEach((e) => {
          if (e.path) {
            newErrors[e.path] = e.message;
          }
        });

        setErrors(newErrors);
      } else if (err instanceof Error) {
        dispatch(showError(err.message));
      } else {
        dispatch(showError('Something went wrong'));
      }
    } finally {
      isSubmittingRef.current = false;
      dispatch(closeLoader());
    }
  };

  useEffect(() => {
    if (!isAddModalOpen) return;

    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      } else if (e.key === 'Escape') {
        openModalHandler();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isAddModalOpen, openModalHandler]);

  return (
    <div
      className={`${styles.addModal} ${isClosing ? styles.closing : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          openModalHandler();
        }
      }}
      ref={modalRef}
    >
      <fieldset disabled={isLoaderShown}>
        <form className={styles.addModal__content} onSubmit={onSubmitHandler}>
          <button className={styles.addModal__button} onClick={openModalHandler} type="button">
            <FaCircleXmark />
          </button>

          <div>
            <label htmlFor="task">Task Name</label>
            <textarea
              name="task"
              id="task"
              className={styles.addModal__textarea}
              placeholder="Write text..."
              onChange={onChangeHandler}
              value={task}
            />
            <p
              className={
                task.length < 30
                  ? styles.addModal__length
                  : `${styles.addModal__length} ${styles.warning}`
              }
            >
              {task.length}/30
            </p>
            {errors.task && <ErrorMessage error={errors.task} className={styles.addModal__error} />}
          </div>

          <div>
            <label htmlFor="reminder">When to remind?</label>
            <CategorySelect
              id="reminder"
              options={['None', '24', '48', '72', '96', '120']}
              onChange={(val) => setReminderSelected(val === 'None' ? '0' : val)}
              selected={reminderSelected}
              label="Hours before task deadline"
            />
          </div>

          <div>
            <label htmlFor="category">Category</label>
            <CategorySelect
              id="category"
              options={['Critical', 'High', 'Middle', 'Low']}
              onChange={(val) => setCategorySelected(val)}
              selected={categorySelected}
              label="Select a category"
            />
            {errors.category && (
              <ErrorMessage error={errors.category} className={styles.addModal__error} />
            )}
          </div>

          <div>
            <label htmlFor="deadline">Task Deadline</label>
            <div className={styles.addModal__deadline} id="deadline">
              <input
                type="number"
                name="day"
                id="day"
                placeholder="Day"
                onChange={deadlineHandler}
                value={deadline.day}
                autoComplete="bday-day"
              />
              <input
                type="number"
                name="month"
                id="month"
                placeholder="Month"
                onChange={deadlineHandler}
                value={deadline.month}
                autoComplete="bday-month"
              />
              <input
                type="number"
                name="year"
                id="year"
                placeholder="Year"
                onChange={deadlineHandler}
                value={deadline.year}
                autoComplete="bday-year"
              />
            </div>
            {errors.day && <ErrorMessage error={errors.day} className={styles.addModal__error} />}
            {errors.month && (
              <ErrorMessage error={errors.month} className={styles.addModal__error} />
            )}
            {errors.year && <ErrorMessage error={errors.year} className={styles.addModal__error} />}
            {errors.date && <ErrorMessage error={errors.date} className={styles.addModal__error} />}
          </div>

          <div className={styles.addModal__submit}>
            <AddButton type="submit" disabled={isLoaderShown} />
          </div>
        </form>
      </fieldset>
    </div>
  );
};

export default AddModal;
