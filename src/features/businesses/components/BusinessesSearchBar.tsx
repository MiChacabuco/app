import React from 'react';

import { NavigationScreenProp, withNavigation } from 'react-navigation';

import SearchBar from '../../../components/SearchBar';

interface BusinessesSearchBarProps {
  navigation: NavigationScreenProp<any>;
}

interface BusinessesSearchBarState {
  value: string;
}

class BusinessesSearchBar extends React.Component<
  BusinessesSearchBarProps,
  BusinessesSearchBarState
> {
  state = {
    value: null,
  };

  componentDidMount() {
    this.props.navigation.setParams({
      doActivateSearch: () => this.activate(),
    });
    this.props.navigation.setParams({ clearSearchFn: () => this.clear() });
  }

  activate() {
    this.setState({ value: '' });
  }

  clear() {
    if (this.state.value?.length) {
      this.doSearch(null);
    }
    this.setState({ value: null });
  }

  onWrite(value: string) {
    this.setState({ value });
    this.doSearch(value);
  }

  doSearch(search: string) {
    const searchFn = this.props.navigation.getParam('searchFn');
    if (searchFn) {
      searchFn(search);
    }
  }

  render() {
    const { value } = this.state;

    return (
      <SearchBar
        value={value}
        title={value || 'Guía'}
        placeholder="Nombre o rubro ..."
        onChange={value => this.onWrite(value)}
      />
    );
  }
}

export default withNavigation(BusinessesSearchBar);
