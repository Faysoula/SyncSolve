/**
 * FormActions component renders action buttons for a form.
 *
 * @param {Object} props - The component props.
 * @param {string} props.mode - The mode of the form, either "edit" or "create".
 * @param {boolean} props.isLoading - Flag indicating if the form is in a loading state.
 * @param {Function} props.onCancel - Callback function to handle cancel action.
 * @returns {JSX.Element} The rendered component.
 */
import React from "react";
import { Stack, Button } from "@mui/material";
import { Save } from "lucide-react";
import { styles } from "../../utils/styles";

const FormActions = ({ mode, isLoading, onCancel }) => (
  <Stack direction="row" spacing={2} justifyContent="flex-end">
    <Button variant="outlined" onClick={onCancel} sx={styles.cancelButton}>
      Cancel
    </Button>
    <Button
      type="submit"
      variant="contained"
      disabled={isLoading}
      startIcon={isLoading ? null : <Save />}
      sx={styles.submitButton}
    >
      {isLoading
        ? "Creating..."
        : `${mode === "edit" ? "Update" : "Create"} Problem`}
    </Button>
  </Stack>
);

export default FormActions;
