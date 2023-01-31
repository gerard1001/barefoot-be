/* eslint-disable import/prefer-default-export */
import isAfter from 'date-fns/isAfter';
import parserISO from 'date-fns/parseISO';
import differenceInDays from 'date-fns/differenceInCalendarDays';

export const validateDate = (date, dateToCompare) => {
  const Formatteddate = parserISO(date);
  const anotherdate = parserISO(dateToCompare);
  const valid = isAfter(Formatteddate, anotherdate);
  return valid;
};

export const subDays = (date1, date2) => {
  const first = parserISO(date1);
  const second = parserISO(date2);
  const days = differenceInDays(first, second);
  return days;
};
