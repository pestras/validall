import { Validall } from './validator';


const schemaRepo: { [key: string]: Validall } = {};

export function saveValidator(id: string, schema: Validall) {
  schemaRepo[id] = schema;
}

export function getValidator(id: string) {
  if (!id) 
    return null;

  return schemaRepo[id] || null;
}

export function hasId(id: string): boolean {
  return schemaRepo.hasOwnProperty(id);
}