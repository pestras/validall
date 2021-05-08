const schemaRepo = {};
export function saveValidator(id, schema) {
    schemaRepo[id] = schema;
}
export function getValidator(id) {
    if (!id)
        return null;
    return schemaRepo[id] || null;
}
export function hasId(id) {
    return schemaRepo.hasOwnProperty(id);
}
