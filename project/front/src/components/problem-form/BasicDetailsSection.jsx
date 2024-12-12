
/**
 * BasicDetailsSection component renders a form section for entering basic problem details.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.formData - The form data containing problem details.
 * @param {string} props.formData.title - The title of the problem.
 * @param {string} props.formData.description - The description of the problem.
 * @param {string} props.formData.difficulty - The difficulty level of the problem.
 * @param {Array<string>} props.formData.tags - The tags associated with the problem.
 * @param {Function} props.onChange - The function to handle changes in text fields.
 * @param {Function} props.onTagsChange - The function to handle changes in tags.
 *
 * @returns {JSX.Element} The rendered component.
 */

/**
 * TagsSelector component renders an Autocomplete input for selecting multiple tags.
 *
 * @param {Object} props - The component props.
 * @param {Array<string>} props.tags - The selected tags.
 * @param {Function} props.onTagsChange - The function to handle changes in tags.
 *
 * @returns {JSX.Element} The rendered component.
 */
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