export const ConvertToJST = (date: Date | string | number) => {
  const dateObject = new Date(date);
  const localeDateString = dateObject.toLocaleString('en-US', {
    timeZone: 'Asia/Tokyo',
  });

  return new Date(localeDateString);
};

export const CalcFiscalYear = (dateObject: Date) => {
  return dateObject.getMonth() + 1 > 3 ? dateObject.getFullYear() : dateObject.getFullYear() - 1;
};

export const DisplayDefaultDateString = (dateObject: Date) => {
  return `${dateObject.getFullYear()}/${(dateObject.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${dateObject.getDate().toString().padStart(2, '0')}`;
};
