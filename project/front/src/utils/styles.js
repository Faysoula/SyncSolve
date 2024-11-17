export const styles = {
  textField: {
    "& .MuiOutlinedInput-root": {
      color: "#FAF0CA",
      "& fieldset": { borderColor: "#5A189A" },
    },
    "& .MuiInputLabel-root": { color: "#FAF0CA" },
  },
  difficultySelect: {
    width: 200,
    "& .MuiOutlinedInput-root": {
      color: "#FAF0CA",
      "& fieldset": { borderColor: "#5A189A" },
    },
    "& .MuiInputLabel-root": { color: "#FAF0CA" },
  },
  tag: {
    backgroundColor: "rgba(157, 78, 221, 0.3)",
    color: "#FAF0CA",
    "& .MuiChip-deleteIcon": {
      color: "#FAF0CA",
      "&:hover": {
        color: "#ff4444",
      },
    },
  },
  tagAutocomplete: {
    "& .MuiAutocomplete-tag": {
      backgroundColor: "rgba(157, 78, 221, 0.3)",
      color: "#FAF0CA",
    },
  },
  testCaseCard: {
    bgcolor: "#240046",
    p: 3,
  },
  cancelButton: {
    color: "#FAF0CA",
    borderColor: "#5A189A",
    "&:hover": { borderColor: "#7B2CBF", bgcolor: "#240046" },
  },
  submitButton: {
    bgcolor: "#7B2CBF",
    "&:hover": { bgcolor: "#9D4EDD" },
    "&:disabled": { bgcolor: "#5A189A" },
  },
};

export const teamstyles = {
  dialogPaper: {
    sx: {
      bgcolor: "#1A1626",
      color: "#FAF0CA",
    },
  },
  dialogTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    pb: 1,
  },
  dialogActions: {
    p: 3,
    pt: 1,
  },
};

export const problemListStyles = {
  problemCard: {
    bgcolor: "#3C096C",
    borderRadius: 2,
    transition: "all 0.2s",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-2px)",
      bgcolor: "#5A189A",
    },
  },
  emptyState: {
    bgcolor: "#3C096C",
    borderRadius: 2,
    p: 4,
    textAlign: "center",
  },
};