import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { IconButton, Text } from 'react-native-paper';

import SelectDialog, {
  ItemValue,
  SelectDialogProps,
  SelectItem,
} from './SelectDialog';
import Touchable from './Touchable';

interface SelectProps {
  label: string;
  items: SelectItem[];
  value: ItemValue | ItemValue[];
  onSubmit: (value: ItemValue | ItemValue[]) => any;
  isMultiple?: boolean;
  selectDialogProps?: Partial<SelectDialogProps>;
}

interface SelectState {
  isVisible: boolean;
  hint: string;
}

class Select extends React.Component<SelectProps, SelectState> {
  state = {
    isVisible: false,
    hint: '',
  };

  componentDidMount() {
    this.updateHint(this.props.value);
  }

  componentDidUpdate(
    prevProps: Readonly<SelectProps>,
    prevState: Readonly<SelectState>
  ) {
    const currentValue = this.props.value;
    if (currentValue !== prevProps.value) {
      this.updateHint(currentValue);
    }
  }

  show() {
    this.setState({ isVisible: true });
  }

  submit(values: ItemValue | ItemValue[]) {
    this.props.onSubmit(values);
    this.updateHint(values);
  }

  getItemLabel(value: ItemValue): string {
    const item = this.props.items.find(i => i.value === value);
    return item ? item.label : '';
  }

  updateHint(value: ItemValue | ItemValue[]) {
    let hint: string;
    if (this.props.isMultiple) {
      value = value as ItemValue[];
      if (!value.length) {
        hint = '';
      } else if (value.length === 1) {
        hint = this.getItemLabel(value[0]);
      } else {
        hint = `${value.length} seleccionado${value.length !== 1 ? 's' : ''}`;
      }
    } else {
      hint = this.getItemLabel(value as ItemValue);
    }
    this.setState({ hint });
  }

  render() {
    const { label, items, value, isMultiple, selectDialogProps } = this.props;
    const { hint, isVisible } = this.state;

    return (
      <View>
        <Touchable onPress={() => this.show()}>
          <View style={[styles.container, styles.flex]}>
            <Text>{label}</Text>
            <View style={styles.flex}>
              <Text>{hint}</Text>
              <IconButton
                icon="chevron-down"
                color="rgba(0, 0, 0, 0.5)"
                style={{ margin: 0 }}
              />
            </View>
          </View>
        </Touchable>

        <SelectDialog
          title={label}
          items={items}
          value={value}
          isVisible={isVisible}
          setVisible={isVisible => this.setState({ isVisible })}
          onSubmit={value => this.submit(value)}
          isMultiple={isMultiple}
          {...selectDialogProps}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        borderBottomWidth: 1,
        borderBottomColor: '#f4f4f5',
      },
      android: {
        elevation: 3,
      },
    }),
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default Select;
