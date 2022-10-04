import { Types } from 'mongoose';
export const stringToOjbectId = (id: string): Types.ObjectId => {
  return new Types.ObjectId(id);
};

export const dtoToOjbectId = <T>(obj: T, keys: Array<keyof T>): T => {
  const newObj = JSON.parse(JSON.stringify(obj));

  keys.forEach((key) => {
    const value = obj[key];

    if (typeof value === 'string') {
      newObj[key] = stringToOjbectId(value);
    }
  });

  return newObj;
};
