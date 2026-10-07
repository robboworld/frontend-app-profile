/**
 * Whether a profile field has user-visible content.
 */
export function hasFieldValue(value) {
  if (value == null) {
    return false;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return Boolean(value);
}

/**
 * Show a profile block when it has content, is open for editing, or is an
 * editable empty field on the authenticated user's own profile.
 */
export function isProfileBlockVisible(
  formId,
  value,
  currentlyEditingField,
  { showEmptyForEditing = false } = {},
) {
  if (currentlyEditingField === formId) {
    return true;
  }
  if (hasFieldValue(value)) {
    return true;
  }
  if (showEmptyForEditing) {
    return true;
  }
  return false;
}
