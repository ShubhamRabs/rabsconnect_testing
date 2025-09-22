import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Field, ErrorMessage } from "formik";
import { useBootstrap, useMui } from "../../hooks/Hooks";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./FormUtility.css";
import parsePhoneNumber from "libphonenumber-js";
let crm_countries = document.getElementById("crm_countries");

export const CustomFormGroup = (props) => {
  const { Row, Col } = useBootstrap();
  return (
    <Col
      xs={props.xs === undefined ? 12 : props.xs}
      md={props.md === undefined ? 6 : props.md}
      className="mb-3"
      style={props.style}
    >
      <Row className="align-items-center">
        <Col xs={12} md={4}>
          <h3 className="custom-form-label">
            {props.formlabel}
            <span className="required-label">{props.star}</span>
          </h3>
        </Col>
        <Col xs={12} md={8}>
          {props.FormField}
        </Col>
      </Row>
    </Col>
  );
};

export const CustomInputField = (props) => {
  return (
    <div style={{ width: props.InputWidth }}>
      <Field
        type={props.type}
        name={props.name}
        className="custom-input"
        placeholder={props.placeholder}
        disabled={props.disabled}
        description={props.description}
        suffix={props.suffix}
        min={props.min}
        max={props.max}
        style={{
          background: props.disabled && "#f2f2f2",
          cursor: props.disabled && "not-allowed",
        }}
        {...props}
      />
      <ErrorMessage name={props.name} component="div" className="error" />
    </div>
  );
};

export const CustomSelectField = (props) => {
  const { Autocomplete, TextField } = useMui();
  const [selectValue, setSelectValue] = React.useState(
    props.initialValue || null
  );
  // Determine the default value and placeholder to use
  const defaultValue =
    props.defaultValue === undefined || props.defaultValue === null
      ? null
      : props.defaultValue;
  const placeholder = defaultValue === null ? props.placeholder : null;
  const showLabel = (selectValue === null || selectValue === "") && placeholder;

  const filterOptions = (options) => {
    if (props.disabledOptions) {
      return options.filter(
        (option) => !props.disabledOptions.includes(option.value)
      );
    }
    return options;
  };

  const handleChange = (_, value) => {
    props.FieldValue(props.name, props.isLabelValue ? value?.value : value);
    setSelectValue(value);
  };

  return (
    <>
      <Autocomplete
        options={filterOptions(props.options || [])}
        className="custom-select"
        getOptionLabel={(option) =>
          props.isLabelValue ? option.label : option
        }
        isOptionEqualToValue={(option, value) =>
          props.isLabelValue ? option.value === value?.value : option === value
        }
        onChange={handleChange}
        onFocus={props.onFocus}
        value={selectValue}
        renderInput={(params) => (
          <TextField {...params} label={showLabel ? placeholder : null} />
        )}
        defaultValue={defaultValue}
        disabled={props.disabled}
      />
      <ErrorMessage name={props.name} component="div" className="error" />
    </>
  );
};

//Used in Add,edit Lead page for Broker Name Field
export const CustomSelectIdNameField = (props) => {
  const { Autocomplete, TextField } = useMui();
  const [selectValue, setSelectValue] = React.useState(
    props.initialValue || null
  );

  const [isChange, setIsChange] = React.useState(false);

  React.useEffect(() => {
    if (props.initialValue && isChange === false) {
      setSelectValue(props.initialValue);
    }
  }, [props.initialValue, isChange]);

  // Determine the default value and placeholder to use
  const defaultValue =
    props.defaultValue === undefined || props.defaultValue === null
      ? null
      : props.defaultValue;
  const placeholder = defaultValue === null ? props.placeholder : null;
  const showLabel = (selectValue === null || selectValue === "") && placeholder;

  const filterOptions = (options) => {
    if (props.disabledOptions) {
      return options.filter(
        (option) => !props.disabledOptions.includes(option.value)
      );
    }
    return options;
  };

  const handleChange = (_, value) => {
    if (!isChange) {
      setIsChange(true);
    }
    props.FieldValue(props.name, props.isLabelValue ? value?.value : value);
    setSelectValue(value);
  };

  return (
    <>
      <Autocomplete
        options={filterOptions(props.options || [])}
        className="custom-select"
        getOptionLabel={(option) =>
          props.isLabelValue ? option.label : option
        }
        isOptionEqualToValue={(option, value) =>
          props.isLabelValue ? option.value === value?.value : option === value
        }
        onChange={handleChange}
        onFocus={props.onFocus}
        value={selectValue}
        renderInput={(params) => (
          <TextField {...params} label={showLabel ? placeholder : null} />
        )}
        defaultValue={defaultValue}
        disabled={props.disabled}
      />
      <ErrorMessage name={props.name} component="div" className="error" />
    </>
  );
};

// export const CustomMultipleSelectField = (props) => {
//   const {
//     Autocomplete,
//     TextField,
//     Paper,
//     Box,
//     FormControlLabel,
//     Checkbox,
//     Divider,
//   } = useMui();

//   const {
//     options,
//     initialValue,
//     isLabelValue,
//     disabledOptions,
//     onFocus,
//     name,
//     placeholder,
//     FieldValue,
//   } = props;

//   // Check if initialValue is empty and set selectValues accordingly
//   const isInitialValueEmpty =
//     initialValue &&
//     initialValue.length === 1 &&
//     (initialValue[0].value === undefined || initialValue[0].value === "");

//   const initialSelectValues = isInitialValueEmpty ? [] : initialValue || [];

//   const [selectValues, setSelectValues] = React.useState(initialSelectValues);

//   const [selectAll, setSelectAll] = React.useState(false);

//   const [searchValue, setSearchValue] = React.useState("");

//   const hasOptions = options && options.length > 0;

//   const filterOptions = (options) => {
//     if (disabledOptions) {
//       return options.filter(
//         (option) => !disabledOptions.includes(option.value)
//       );
//     }
//     return options;
//   };

//   const handleSelectAll = () => {
//     // setSelectValues((prev) => {
//     //   if (prev.length < options.length) return filterOptions(options);
//     //   return [];
//     // });
//     // setSelectAll((prev) => !prev);

//     setSelectValues((prev) => {
//       if (prev.length < options.length) {
//         FieldValue(
//           name,
//           isLabelValue
//             ? filterOptions(options).map((value) => value.value)
//             : filterOptions(options)
//         );
//         return filterOptions(options);
//       }
//       FieldValue(name, isLabelValue ? [] : []);
//       return [];
//     });
//     setSelectAll((prev) => !prev);
//   };

//   const handleChange = (_, values) => {
//     const allOptions = filterOptions(options);
//     setSelectAll(values.length === allOptions.length);
//     FieldValue(
//       name,
//       isLabelValue ? values.map((value) => value.value) : values
//     );
//     setSelectValues(values);
//   };

//   React.useEffect(() => {
//     if (props.resetField && props.resetField === true) {
//       setSelectValues([]);
//       setSelectAll(false);
//     }
//   }, [props]);

//   const handleInputChange = (event, newInputValue) => {
//     if (event?.type === "change") {
//       setSearchValue(newInputValue);
//     }
//   };

//   return (
//     <>
//       <Autocomplete
//         options={options}
//         disableCloseOnSelect
//         limitTags={1}
//         getOptionLabel={(option) => (isLabelValue ? option.label : option)}
//         isOptionEqualToValue={(option, value) =>
//           isLabelValue ? option.value === value?.value : option === value
//         }
//         onInputChange={handleInputChange}
//         inputValue={searchValue}
//         onChange={(e, value) => {
//           if (!value) {
//             setSearchValue("");
//           }
//           if (value && value.some((v) => v.value === "select_all")) {
//             handleSelectAll();
//           } else {
//             handleChange(
//               e,
//               value.filter((v) => v.value !== "select_all")
//             );
//           }
//         }}
//         renderOption={(props, option, { selected }) => (
//           <li {...props} style={{ padding: 0 }}>
//             <Checkbox style={{ marginRight: 8 }} checked={selected} />
//             {option.label}
//           </li>
//         )}
//         PaperComponent={(paperProps) => (
//           <Paper {...paperProps}>
//             <Box
//               onMouseDown={(e) => e.preventDefault()} // prevent blur
//             >
//               {hasOptions && (
//                 <FormControlLabel
//                   onClick={(e) => {
//                     e.preventDefault(); // prevent blur
//                     handleSelectAll();
//                   }}
//                   label="Select all"
//                   control={
//                     <Checkbox id="select-all-checkbox" checked={selectAll} />
//                   }
//                   style={{ paddingLeft: "1rem" }}
//                 />
//               )}
//             </Box>
//             <Divider />
//             {paperProps.children}
//           </Paper>
//         )}
//         onFocus={onFocus}
//         value={selectValues}
//         renderInput={(params) => <TextField {...params} label={placeholder} />}
//         multiple // Enable multiple selection
//       />
//       <ErrorMessage name={props.name} component="div" className="error" />
//     </>
//   );
// };

export const CustomMultipleSelectField = ({
  options = [],
  initialValue = [],
  isLabelValue = false,
  disabledOptions = [],
  onFocus,
  name,
  placeholder,
  FieldValue,
  resetField,
}) => {
  const {
    Autocomplete,
    TextField,
    Paper,
    Box,
    FormControlLabel,
    Checkbox,
    Divider,
  } = useMui();

  // Initialize selectValues based on initialValue
  const isInitialValueEmpty =
    initialValue.length === 1 &&
    (!initialValue[0]?.value || initialValue[0].value === "");
  const initialSelectValues = isInitialValueEmpty ? [] : initialValue;

  const [selectValues, setSelectValues] = useState(initialSelectValues);
  const [selectAll, setSelectAll] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Filter options based on disabledOptions and searchValue
  const filteredOptions = useMemo(() => {
    let result = options.filter(
      (option) => !disabledOptions.includes(option.value)
    );
    if (searchValue) {
      result = result.filter((option) =>
        (isLabelValue ? option.label : option)
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      );
    }
    return result;
  }, [options, disabledOptions, searchValue, isLabelValue]);

  // Check if "Select All" already exists in options
  const hasSelectAll = options.some((option) => option.value === "select_all");
  const autocompleteOptions = hasSelectAll
    ? filteredOptions
    : [...filteredOptions];

  // Update selectAll state based on selected values
  useEffect(() => {
    setSelectAll(
      selectValues.length === filteredOptions.length &&
        filteredOptions.length > 0
    );
  }, [selectValues, filteredOptions]);

  // Reset form handling
  useEffect(() => {
    if (resetField) {
      setSelectValues([]);
      setSelectAll(false);
      setSearchValue("");
    }
  }, [resetField]);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    setSelectValues((prev) => {
      if (prev.length < filteredOptions.length) {
        const newValues = filteredOptions;
        FieldValue(
          name,
          isLabelValue ? newValues.map((value) => value.value) : newValues
        );
        return newValues;
      }
      FieldValue(name, isLabelValue ? [] : []);
      return [];
    });
    setSelectAll((prev) => !prev);
  }, [filteredOptions, FieldValue, name, isLabelValue]);

  // Handle individual option changes
  const handleChange = useCallback(
    (_, values) => {
      const filteredValues = values.filter((v) => v.value !== "select_all");
      FieldValue(
        name,
        isLabelValue
          ? filteredValues.map((value) => value.value)
          : filteredValues
      );
      setSelectValues(filteredValues);
    },
    [FieldValue, name, isLabelValue]
  );

  // Handle search input changes
  const handleInputChange = useCallback((event, newInputValue) => {
    if (event?.type === "change") {
      setSearchValue(newInputValue);
    }
  }, []);

  return (
    <div style={{ marginBottom: "16px" }}>
      <Autocomplete
        options={autocompleteOptions}
        disableCloseOnSelect
        limitTags={2}
        getOptionLabel={(option) => (isLabelValue ? option.label : option)}
        isOptionEqualToValue={(option, value) =>
          isLabelValue ? option.value === value?.value : option === value
        }
        onInputChange={handleInputChange}
        inputValue={searchValue}
        onChange={(e, value) => {
          if (!value) {
            setSearchValue("");
          }
          if (value.some((v) => v.value === "select_all")) {
            handleSelectAll();
          } else {
            handleChange(e, value);
          }
        }}
        renderOption={(props, option, { selected }) => (
          <li
            {...props}
            style={{
              padding: "8px 16px",
              backgroundColor: selected ? "#e6f0ff" : "transparent",
              transition: "background-color 0.2s ease",
              fontWeight: option.value === "select_all" ? "600" : "400",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#f5f5f5")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = selected
                ? "#e6f0ff"
                : "transparent")
            }
          >
            <Checkbox
              style={{ marginRight: "8px" }}
              checked={option.value === "select_all" ? selectAll : selected}
              aria-label={option.label}
            />
            {option.label}
          </li>
        )}
        PaperComponent={(paperProps) => (
          <Paper
            {...paperProps}
            style={{
              marginTop: "8px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            <Box
              onMouseDown={(e) => e.preventDefault()}
              style={{
                padding: "8px 16px",
                backgroundColor: "#fafafa",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              {options.length > 0 && (
                <FormControlLabel
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectAll();
                  }}
                  label="Select All"
                  control={
                    <Checkbox
                      id="select-all-checkbox"
                      checked={selectAll}
                      aria-label="Select all options"
                    />
                  }
                  style={{ margin: 0, fontWeight: "600" }}
                />
              )}
            </Box>
            {options.length > 0 && <Divider />}
            {paperProps.children}
          </Paper>
        )}
        onFocus={onFocus}
        value={selectValues}
        renderInput={(params) => (
          <TextField
            {...params}
            label={placeholder}
            variant="outlined"
            size="small"
            style={{
              borderRadius: "6px",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
            }}
            InputLabelProps={{
              style: { color: "#666", fontSize: "0.9rem" },
            }}
            aria-label={placeholder}
          />
        )}
        multiple
        style={{ width: "100%" }}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="error"
        style={{
          color: "#d32f2f",
          fontSize: "0.75rem",
          marginTop: "4px",
        }}
      />
    </div>
  );
};

export const CustomMultipleSelectTextField = (props) => {
  const {
    Autocomplete,
    TextField,
    Paper,
    Box,
    FormControlLabel,
    Checkbox,
    Divider,
  } = useMui();

  const {
    options,
    initialValue,
    isLabelValue,
    disabledOptions,
    onFocus,
    name,
    placeholder,
    FieldValue,
    values,
  } = props;

  // Check if initialValue is empty and set selectValues accordingly
  const isInitialValueEmpty =
    initialValue &&
    initialValue.length === 1 &&
    (initialValue[0].value === undefined || initialValue[0].value === "");

  const initialSelectValues = isInitialValueEmpty ? [] : initialValue || [];

  const [selectValues, setSelectValues] = React.useState(initialSelectValues);
  const [selectAll, setSelectAll] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [customLocality, setCustomLocality] = React.useState("");

  const hasOptions = options && options.length > 0;

  const filterOptions = (options) => {
    if (disabledOptions) {
      return options.filter(
        (option) => !disabledOptions.includes(option.value)
      );
    }
    return options;
  };

  const handleSelectAll = () => {
    setSelectValues((prev) => {
      if (prev.length < options.length) {
        FieldValue(
          name,
          isLabelValue
            ? filterOptions(options).map((value) => value.value)
            : filterOptions(options)
        );
        return filterOptions(options);
      }
      FieldValue(name, isLabelValue ? [] : []);
      return [];
    });
    setSelectAll((prev) => !prev);
  };

  const handleChange = (_, values) => {
    const allOptions = filterOptions(options);
    setSelectAll(values.length === allOptions.length);
    FieldValue(
      name,
      isLabelValue ? values.map((value) => value.value) : values
    );
    setSelectValues(values);
  };

  React.useEffect(() => {
    if (props.resetField && props.resetField === true) {
      setSelectValues([]);
      setSelectAll(false);
    }
  }, [props]);

  const handleInputChange = (event, newInputValue) => {
    if (event?.type === "change") {
      setSearchValue(newInputValue);
    }
  };

  const handleCustomLocalityChange = (event) => {
    setCustomLocality(event.target.value);
  };

  const handleBlur = () => {
    if (customLocality && !selectValues.includes(customLocality)) {
      // Manually typed locality should be added to select values
      setSelectValues((prev) => [...prev, customLocality]);
      FieldValue(name, [...selectValues, customLocality]);
    }
  };

  return (
    <>
      <Autocomplete
        options={options}
        disableCloseOnSelect
        limitTags={1}
        getOptionLabel={(option) => (isLabelValue ? option.label : option)}
        isOptionEqualToValue={(option, value) =>
          isLabelValue ? option.value === value?.value : option === value
        }
        onInputChange={handleInputChange}
        inputValue={searchValue}
        onChange={(e, value) => {
          if (!value) {
            setSearchValue("");
          }
          if (value && value.some((v) => v.value === "select_all")) {
            handleSelectAll();
          } else {
            handleChange(
              e,
              value.filter((v) => v.value !== "select_all")
            );
          }
        }}
        renderOption={(props, option, { selected }) => (
          <li {...props} style={{ padding: 0 }}>
            <Checkbox style={{ marginRight: 8 }} checked={selected} />
            {option.label}
          </li>
        )}
        PaperComponent={(paperProps) => (
          <Paper {...paperProps}>
            <Box
              onMouseDown={(e) => e.preventDefault()} // prevent blur
            >
              {hasOptions && (
                <FormControlLabel
                  onClick={(e) => {
                    e.preventDefault(); // prevent blur
                    handleSelectAll();
                  }}
                  label="Select all"
                  control={
                    <Checkbox id="select-all-checkbox" checked={selectAll} />
                  }
                  style={{ paddingLeft: "1rem" }}
                />
              )}
            </Box>
            <Divider />
            {paperProps.children}
          </Paper>
        )}
        onFocus={onFocus}
        value={selectValues}
        renderInput={(params) => (
          <TextField
            {...params}
            label={placeholder}
            value={customLocality || searchValue}
            onChange={handleCustomLocalityChange}
            onBlur={handleBlur} // Add blur to save custom input
          />
        )}
        multiple // Enable multiple selection
      />
      <ErrorMessage name={props.name} component="div" className="error" />
    </>
  );
};

export const CustomTextareaField = (props) => {
  return (
    <div className="customtextarea">
      <Field
        as="textarea"
        className="custom-textarea"
        name={props.name}
        placeholder={props.placeholder}
        rows={4}
        style={{ width: "100%", padding: "5px" }}
        required={props.required}
      />
      <ErrorMessage name={props.name} component="div" className="error" />
        
    </div>
  );
};

export const CustomMobileFiled = (props) => {
  const { Col } = useBootstrap();
  const { Typography } = useMui();

  const [number, setNumber] = React.useState(null);
  const [isValid, setIsValid] = React.useState(true);

  React.useEffect(() => {
    if (props.defaultVal && props.defaultVal !== "undefined") {
      let data = props.defaultVal.split(" ");
      setNumber(data[0] + data[1]);
    }
  }, [props]);

  const validatePhoneNumber = (value, country) => {
    const phoneNumber = parsePhoneNumber(value, country);
    return phoneNumber ? phoneNumber.isValid() : false;
  };

  const handleChange = (value, country) => {
    setNumber(value);
    setIsValid(validatePhoneNumber(value, country));
    props.onChange(value);
  };

  return (
    <>
      <Col xs={6} md={2} className="d-flex">
        <Typography
          variant="h6"
          className="custom-form-label"
          sx={{ marginTop: "5px" }}
        >
          {props.formlabel} <span className="required-label">{props.star}</span>
        </Typography>
      </Col>
      <Col xs={6} md={4}>
        <PhoneInput
          autoFormat
          // enableLongNumbers={true}
          enableSearch
          country={
            crm_countries.value.includes("India")
              ? "in"
              : crm_countries.value.includes("UAE")
              ? "ae"
              : "in"
          }
          placeholder="0000"
          preferredCountries={["in", "ae", "gb", "us"]}
          inputProps={{
            required: props.InputRequired,
            autoFocus: true,
          }}
          containerStyle={{ width: "100%" }}
          inputStyle={{
            width: "100%",
            background: props.disabled ? "#f2f2f2" : null,
          }}
          value={
            number === null
              ? crm_countries.value.includes("India")
                ? "+91"
                : crm_countries.value.includes("UAE")
                ? "+971"
                : number
              : number
          }
          onChange={props.onChange}
          disabled={props.disabled}
          isValid={(value, country) => validatePhoneNumber(value, country)}
        />
        {props.error === "" ? (
          <p className="error">Mobile No. is required</p>
        ) : null}
        {console.log(props.error, "Eroro")}
      </Col>
    </>
  );
};
