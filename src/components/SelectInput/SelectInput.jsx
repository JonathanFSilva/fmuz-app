import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// @material-ui/core components
import { createMuiTheme, withStyles, MuiThemeProvider } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
// @material-ui/icons
import Clear from "@material-ui/icons/Clear";
import Check from "@material-ui/icons/Check";
// core components
import customInputStyle from "../../assets/jss/fruticulture/components/customInputStyle.jsx";
import dropdownStyle from "../../assets/jss/fruticulture/dropdownStyle.jsx";

const styles = createMuiTheme({
  overrides: {
    MuiInput: {
      root: {
        fontSize: "12px !important",
        fontWeight: "400",
        color: "#555 !important",
      },
      input: {
        padding: "4px 0 5px",
      },
      underline: {
        "&:hover:not($disabled):not($focused):not($error):before,&:before": {
          borderColor: "#D2D2D2 !important",
          borderWidth: "1px !important"
        },
        "&:after": {
          borderColor: "#4caf50"
        }
      },
    },
    MuiSelect: {
      select: {
        "&:focus": {
          backgroundColor: "#FFFFFF !important",
        },
      }
    },
    MuiPaper: {
      root: {
        marginTop: "45px",
      }
    }
  },
});

var optionsList = [];

function CustomSelect(props) {
  const { classes, inputRef, ...other } = props;

  return (
    <Select {...other} ref={inputRef}>
      {
        optionsList.map((item, key) => {
          return (
            <MenuItem className={classes.dropdownItem} classes={{ selected: classes.dropdownItemSelected }} value={item[0]} key={key}>{item[1]}</MenuItem>
          );
        })
      }
    </Select>
  );
}

CustomSelect.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

// eslint-disable-next-line
CustomSelect = withStyles(dropdownStyle)(CustomSelect);


function SelectInput({ ...props }) {
  const {
    classes,
    formControlProps,
    labelText,
    id,
    labelProps,
    inputProps,
    error,
    success,
    helperText,
    options
  } = props;

  optionsList = options;

  const labelClasses = classNames({
    [" " + classes.labelRootError]: error,
    [" " + classes.labelRootSuccess]: success && !error
  });
  const underlineClasses = classNames({
    [classes.underlineError]: error,
    [classes.underlineSuccess]: success && !error,
    [classes.underline]: true
  });
  const marginTop = classNames({
    [classes.marginTop]: labelText === undefined
  });
  return (
    <MuiThemeProvider theme={styles}>
      <FormControl
        {...formControlProps}
        className={formControlProps.className + " " + classes.formControl}
      >
        {labelText !== undefined ? (
          <InputLabel
            className={classes.labelRoot + labelClasses}
            htmlFor={id}
            {...labelProps}
          >
            {labelText}
          </InputLabel>
        ) : null}
        <Input
          classes={{
            root: marginTop,
            disabled: classes.disabled,
            underline: underlineClasses
          }}
          id={id}
          {...inputProps}
          inputComponent={CustomSelect}
        />
        {error ? (
          <Clear className={classes.feedback + " " + classes.labelRootError} />
        ) : success ? (
          <Check className={classes.feedback + " " + classes.labelRootSuccess} />
        ) : null}
        {
          helperText && helperText.trim().length > 0
            ? <FormHelperText>{helperText}</FormHelperText>
            : null
        }
      </FormControl>
    </MuiThemeProvider>
  );
}

SelectInput.propTypes = {
  classes: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  error: PropTypes.bool,
  success: PropTypes.bool,
  helperText: PropTypes.string,
};

export default withStyles(customInputStyle)(SelectInput);
