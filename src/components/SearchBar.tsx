import React from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';

import { HeaderTitle } from 'react-navigation-stack';

import { theme } from '../theme';

interface SearchBarProps {
  value: string;
  title: string;
  placeholder?: string;
  onChange: (value: string) => any;
  onSearch?: (query: string) => any;
}

class SearchBar extends React.Component<SearchBarProps> {
  inputRef: React.RefObject<TextInput>;

  constructor(props) {
    super(props);
    this.inputRef = React.createRef<TextInput>();
  }

  componentDidUpdate(prevProps: Readonly<SearchBarProps>) {
    if (prevProps.value === null && this.props.value !== null) {
      this.focusInput();
    } else if (prevProps.value !== null && this.props.value === null) {
      this.blurInput();
    }
  }

  get isActive(): boolean {
    return this.props.value !== null;
  }

  get inputPlatformStyles() {
    return Platform.OS === 'android' ? styles.inputAndroid : styles.inputIos;
  }

  get placeholder(): string {
    return this.props.placeholder || 'Buscar ...';
  }

  focusInput() {
    setTimeout(() => {
      this.inputRef.current.focus();
    }, 0);
  }

  blurInput() {
    this.inputRef.current.blur();
  }

  submit(query: string) {
    if (this.props.onSearch) {
      this.props.onSearch(query);
    }
  }

  render() {
    return (
      <View>
        <TextInput
          value={this.props.value}
          placeholder={this.placeholder}
          onChangeText={this.props.onChange}
          onSubmitEditing={() => this.submit(this.props.value)}
          returnKeyType="search"
          ref={this.inputRef}
          placeholderTextColor={theme.colors.transparentWhite}
          autoCorrect={false}
          style={[
            styles.whiteColor,
            this.inputPlatformStyles,
            !this.isActive && styles.hidden,
          ]}
        />
        <HeaderTitle
          style={[styles.whiteColor, this.isActive && styles.hidden]}
        >
          {this.props.title}
        </HeaderTitle>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  whiteColor: {
    color: '#fff',
  },
  inputAndroid: {
    fontSize: 20,
    padding: 0,
  },
  inputIos: {
    fontSize: 17,
    fontWeight: '600',
  },
  hidden: {
    display: 'none',
  },
});

export default SearchBar;
