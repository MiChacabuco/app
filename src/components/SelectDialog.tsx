import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  Button,
  Checkbox,
  Dialog,
  Portal,
  RadioButton,
  Subheading,
} from 'react-native-paper';

import Touchable from './Touchable';

export type ItemValue = string | number;

export interface SelectItem {
  value: ItemValue;
  label: string;
}

export interface SelectDialogProps {
  title: string;
  items: SelectItem[];
  value: ItemValue | ItemValue[];
  isVisible: boolean;
  setVisible: (isVisible: boolean) => any;
  onSubmit: (value: ItemValue | ItemValue[]) => any;
  isMultiple?: boolean;
  submitText?: string;
  cancelText?: string;
  isFullScreen?: boolean;
}

interface SelectDialogState {
  value: ItemValue | ItemValue[];
}

class SelectDialog extends React.Component<
  SelectDialogProps,
  SelectDialogState
> {
  readonly MAX_HEIGHT = 160;

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<SelectDialogProps>,
    prevState: Readonly<SelectDialogState>
  ) {
    const { value } = this.props;
    if (value !== prevProps.value) {
      this.setState({ value });
    }
  }

  hide() {
    this.props.setVisible(false);
  }

  submit() {
    this.props.onSubmit(this.state.value);
    this.hide();
  }

  cancel() {
    this.hide();
    // wait for animation to finish before resetting the state
    setTimeout(() => {
      this.setState({ value: this.props.value });
    }, 250);
  }

  onItemPressed(item: SelectItem) {
    const { value } = item;
    if (this.props.isMultiple) {
      const values = this.state.value as ItemValue[];
      const wasSelected = values.some(v => v === value);
      if (wasSelected) {
        // Unselect
        this.setState(prevState => {
          const prevValues = prevState.value as ItemValue[];
          const newValues = prevValues.filter(v => v !== value);
          return { value: newValues };
        });
      } else {
        // Select
        this.setState(prevState => {
          const prevValues = prevState.value as ItemValue[];
          const newValues = [...prevValues, value];
          return { value: newValues };
        });
      }
    } else {
      this.setState({ value });
    }
  }

  renderButton(item: SelectItem) {
    const { value } = item;
    const { isMultiple } = this.props;
    const currentValue = this.state.value;
    let isChecked: boolean;
    if (isMultiple) {
      isChecked = (currentValue as ItemValue[]).some(v => v === value);
    } else {
      isChecked = currentValue === value;
    }
    const status = isChecked ? 'checked' : 'unchecked';
    if (isMultiple) {
      return <Checkbox status={status} />;
    } else {
      const value = item.value ? item.value.toString() : '';
      return <RadioButton status={status} value={value} />;
    }
  }

  renderItem(item: SelectItem) {
    return (
      <Touchable onPress={() => this.onItemPressed(item)} key={item.value}>
        <View style={styles.row}>
          <View pointerEvents="none">{this.renderButton(item)}</View>
          <Subheading style={styles.label}>{item.label}</Subheading>
        </View>
      </Touchable>
    );
  }

  render() {
    const {
      isVisible,
      title,
      items,
      cancelText,
      submitText,
      isFullScreen,
    } = this.props;

    return (
      <Portal>
        <Dialog
          visible={isVisible}
          onDismiss={() => this.cancel()}
          style={isFullScreen && { flex: 1 }}
        >
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.ScrollArea
            style={{
              maxHeight: isFullScreen ? 'auto' : this.MAX_HEIGHT,
              paddingHorizontal: 16,
            }}
          >
            <ScrollView>{items.map(item => this.renderItem(item))}</ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => this.cancel()}>
              {cancelText || 'Cancelar'}
            </Button>
            <Button onPress={() => this.submit()}>
              {submitText || 'Aceptar'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    paddingLeft: 8,
  },
});

export default SelectDialog;
