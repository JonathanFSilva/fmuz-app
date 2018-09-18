import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// masked input
import MaskedInput from "react-text-mask";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
// @material-ui/icons
import Clear from "@material-ui/icons/Clear";
import Check from "@material-ui/icons/Check";
// core components
import customInputStyle from "../../assets/jss/material-dashboard-react/components/customInputStyle.jsx";

function MacMask(props) {
  const { inputRef, ...other } = props;
  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      mask={[
        /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, ':',
        /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, ':',
        /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, ':',
        /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, ':',
        /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, ':',
        /[0-9A-Fa-f]/, /[0-9A-Fa-f]/
      ]}
    />
  );
}

MacMask.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

function CustomMaskedInput({ ...props }) {  
  const {
    classes,
    formControlProps,
    labelText,
    id,
    labelProps,
    inputProps,
    error,
    success,
    helperText
  } = props;

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
        inputComponent={MacMask}
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
  );
}

CustomMaskedInput.propTypes = {
  classes: PropTypes.object.isRequired,
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  error: PropTypes.bool,
  success: PropTypes.bool,
  helperText: PropTypes.string
};

export default withStyles(customInputStyle)(CustomMaskedInput);
