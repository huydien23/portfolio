import { deleteField } from 'firebase/firestore';

/**
 * Strip `undefined` fields from a Firestore patch payload, converting them
 * to `deleteField()` so `updateDoc` actually removes the field from the doc.
 *
 * Why this matters: simply doing `delete payload[k]` would leave the field
 * in Firestore untouched — turning "clear this field" into a silent no-op.
 * That bug is what caused maintenance schedules to persist forever after
 * the user clicked "Hủy lịch" in the admin form.
 */
export const cleanPatch = (payload: Record<string, unknown>): Record<string, unknown> => {
  Object.keys(payload).forEach(k => {
    if (payload[k] === undefined) payload[k] = deleteField();
  });
  return payload;
};
