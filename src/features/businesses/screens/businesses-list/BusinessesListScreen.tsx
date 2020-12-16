import React from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { connect } from 'react-redux';
import { NavigationScreenProp } from 'react-navigation';
import { GeoPosition } from 'react-native-geolocation-service';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import { admin } from '../../../../utils';
import { Business, BusinessesListResponse } from '../../models/business';
import BusinessCardItem from './components/BusinessCardItem';
import { theme } from '../../../../theme';
import NoResults from './components/NoResults';
import { AdminDynamicRestMeta } from '../../../../models/response';
import SearchPlaceholder from '../../components/BusinessSearchPlaceholder';
import BusinessesListHeader from './components/BusinessesListHeader';
import appSlice from '../../../../reducers/slices';

interface BusinessesListScreenProps {
  getCurrentPosition: (retry?: () => any) => Promise<GeoPosition>;
  navigation: NavigationScreenProp<any>;
}

interface BusinessesListScreenState {
  businesses: Business[];
  isLoading: boolean;
  meta: AdminDynamicRestMeta;
  params: { [key: string]: string };
}

class BusinessesListScreen extends React.Component<
  BusinessesListScreenProps,
  BusinessesListScreenState
> {
  readonly ITEM_HEIGHT = 96;
  debouncedFetch: (query: string) => void;

  constructor(props) {
    super(props);
    this.state = {
      businesses: null,
      isLoading: false,
      meta: null,
      params: {},
    };
    this.debouncedFetch = AwesomeDebouncePromise(
      search => this.fetchBusinesses({ search }),
      500
    );
  }

  componentDidMount() {
    this.props.navigation.setParams({
      searchFn: search => this.doSearch(search ? search.trim() : ''),
    });
    const params = this.getQueryParams();
    if (params) {
      this.fetchBusinesses(params);
    }
  }

  getQueryParams() {
    return this.props.navigation.getParam('queryParams', null);
  }

  doSearch(search: string) {
    if (!search.length) {
      this.setState({ businesses: null });
      return;
    }
    this.setState({ isLoading: true });
    this.debouncedFetch(search.toLowerCase());
  }

  fetchBusinesses(params: { [key: string]: string }) {
    this.setState({ isLoading: true });
    return this.doFetchBusinesses(params)
      .then(businesses => {
        this.setState({ businesses, params });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  fetchNextBusinesses() {
    const { params, meta } = this.state;
    const { page, totalPages } = meta;
    if (totalPages > page) {
      this.doFetchBusinesses({ ...params, page: page + 1 }).then(businesses => {
        this.setState(state => ({
          businesses: [...state.businesses, ...businesses],
        }));
      });
    }
  }

  doFetchBusinesses(params: {}): Promise<Business[]> {
    return admin
      .get('businesses/', { params })
      .then((response: { body: BusinessesListResponse }) => {
        const { businesses, meta } = response.body;
        this.setState({ meta });
        return businesses;
      });
  }

  toggleDistance(on: boolean): Promise<void> {
    this.setState({ isLoading: true });
    if (on) {
      return this.props
        .getCurrentPosition(() => {
          this.toggleDistance(true);
        })
        .then(position => {
          const { longitude, latitude } = position.coords;
          const params = {
            ...this.state.params,
            point: JSON.stringify([longitude, latitude]),
          };
          this.fetchBusinesses(params);
        });
    } else {
      const params = { ...this.state.params };
      delete params['point'];
      return this.fetchBusinesses(params);
    }
  }

  renderBusiness(business: Business) {
    const params = this.getQueryParams();
    if (params?.search === 'Farmacias') {
      business = {
        ...business,
        name: `Farmacia ${business.name}`,
      };
    }

    return <BusinessCardItem business={business} />;
  }

  render() {
    const { businesses, isLoading, params, meta } = this.state;

    return (
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <ActivityIndicator
            color={theme.colors.accent}
            size="large"
            style={{ height: '100%' }}
          />
        ) : !businesses ? (
          <SearchPlaceholder />
        ) : businesses.length ? (
          <FlatList
            data={this.state.businesses as Business[]}
            renderItem={({ item }) => this.renderBusiness(item)}
            ListHeaderComponent={() => (
              <BusinessesListHeader
                total={meta.totalResults}
                isDistanceOn={!!params.point}
                toggleDistance={(on: boolean) => this.toggleDistance(on)}
              />
            )}
            keyExtractor={item => item.id.toString()}
            getItemLayout={(data, index) => ({
              length: this.ITEM_HEIGHT,
              offset: this.ITEM_HEIGHT * index,
              index,
            })}
            keyboardShouldPersistTaps="handled"
            onEndReached={() => this.fetchNextBusinesses()}
          />
        ) : (
          <NoResults />
        )}
      </View>
    );
  }
}

const appActions = appSlice.actions as any;

const mapDispatchToProps = {
  getCurrentPosition: retry => appActions.getCurrentPosition(retry),
};

const ConnectedBusinessesListScreen = connect(
  null,
  mapDispatchToProps
)(BusinessesListScreen);

export default ConnectedBusinessesListScreen;
