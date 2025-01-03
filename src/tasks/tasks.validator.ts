import { body, ValidationChain } from 'express-validator';
import { Priority } from '../enums/Priority';
import { Status } from '../enums/Status';

export const createValidator: ValidationChain[] = [
  body('title')
    .not()
    .isEmpty()
    .withMessage('The task title mandatory')
    .trim()
    .isString()
    .withMessage('Title need to be in text format'),
  body('date')
    .not()
    .isEmpty()
    .withMessage('The task date is mandatory')
    .isString()
    .withMessage('The date needs to be in date format'),
  body('description')
    .trim()
    .isString()
    .withMessage('Description need to be in text format'),
  body('priority')
    .trim()
    .isIn([Priority.normal, Priority.high, Priority.low])
    .withMessage(
      'Prioriy can only be normal, high, or low',
    ),
  body('status')
    .trim()
    .isIn([
      Status.todo,
      Status.inProgress,
      Status.completed,
    ])
    .withMessage(
      'Status can only be todo, inProgress, or completed',
    ),
];

export const updateValidator: ValidationChain[] = [
  body('id')
    .not()
    .isEmpty()
    .withMessage('The task id is mandatory')
    .trim()
    .isString()
    .withMessage('The id needs to be in text format'),
  body('status')
    .trim()
    .isIn([
      Status.todo,
      Status.inProgress,
      Status.completed,
    ])
    .withMessage(
      'Status can only be todo, inProgress, or completed',
    ),
];
