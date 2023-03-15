import { Types } from 'mongoose';
export const stringToOjbectId = (id: string): Types.ObjectId => {
  return new Types.ObjectId(id);
};

export const dtoToOjbectId = <T>(obj: T, keys: Array<keyof T>): T => {
  const newObj = JSON.parse(JSON.stringify(obj));

  keys.forEach((key) => {
    const value = obj[key];

    if (Array.isArray(value)) {
      newObj[key] = value.map((val) => {
        if (typeof val === 'string') return stringToOjbectId(val);

        return val;
      });
    }

    if (typeof value === 'string') {
      newObj[key] = stringToOjbectId(value);
    }
  });

  return newObj;
};

export const isObjectId = (obj: any): boolean => {
  return Types.ObjectId.isValid(obj);
};
