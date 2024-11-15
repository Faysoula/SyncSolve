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
