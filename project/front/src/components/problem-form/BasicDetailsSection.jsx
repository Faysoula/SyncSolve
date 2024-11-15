import React from "react";
import { TextField, MenuItem, Autocomplete, Chip } from "@mui/material";
import { AVAILABLE_TAGS } from "../../utils/constants";
import { styles } from "../../utils/styles";

const BasicDetailsSection = ({ formData, onChange, onTagsChange }) => (
  <>
    <TextField
      label="Problem Title"
      name="title"
      value={formData.title}
      onChange={onChange}
      required
      fullWidth
      sx={styles.textField}
    />

    <TextField
      label="Problem Description"
      name="description"
      value={formData.description}
      onChange={onChange}
      required
      multiline
      rows={6}
      sx={styles.textField}
    />

    <TextField
      select
      label="Difficulty"
      name="difficulty"
      value={formData.difficulty}
      onChange={onChange}
      required
      sx={styles.difficultySelect}
    >
      <MenuItem value="easy">Easy</MenuItem>
      <MenuItem value="medium">Medium</MenuItem>
      <MenuItem value="hard">Hard</MenuItem>
    </TextField>

    <TagsSelector tags={formData.tags} onTagsChange={onTagsChange} />
  </>
);

const TagsSelector = ({ tags, onTagsChange }) => (
  <Autocomplete
    multiple
    options={AVAILABLE_TAGS}
    value={tags}
    onChange={onTagsChange}
    renderInput={(params) => (
      <TextField {...params} label="Tags" sx={styles.textField} />
    )}
    renderTags={(value, getTagProps) =>
      value.map((option, index) => (
        <Chip
          key={option}
          label={option}
          {...getTagProps({ index })}
          sx={styles.tag}
        />
      ))
    }
    sx={styles.tagAutocomplete}
  />
);

export default BasicDetailsSection;