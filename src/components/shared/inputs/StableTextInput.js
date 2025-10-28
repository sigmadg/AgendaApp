import React, { forwardRef } from 'react';
import { TextInput, StyleSheet } from 'react-native';

const StableTextInput = forwardRef((props, ref) => {
  const {
    style,
    onChangeText,
    onSubmitEditing,
    returnKeyType = 'done',
    blurOnSubmit = true,
    autoFocus = false,
    caretHidden = false,
    contextMenuHidden = false,
    selectTextOnFocus = false,
    textContentType,
    ...otherProps
  } = props;

  return (
    <TextInput
      ref={ref}
      style={[styles.defaultStyle, style]}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      returnKeyType={returnKeyType}
      blurOnSubmit={blurOnSubmit}
      autoFocus={autoFocus}
      caretHidden={caretHidden}
      contextMenuHidden={contextMenuHidden}
      selectTextOnFocus={selectTextOnFocus}
      textContentType={textContentType}
      {...otherProps}
    />
  );
});

const styles = StyleSheet.create({
  defaultStyle: {
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 16,
    paddingHorizontal: 0,
    textAlignVertical: 'center',
  },
});

StableTextInput.displayName = 'StableTextInput';

export default StableTextInput;
