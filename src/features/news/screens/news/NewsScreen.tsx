import React from 'react';
import { FlatList, InteractionManager, StyleSheet, View } from 'react-native';

import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import { NavigationScreenProp } from 'react-navigation';

import { NewsState } from '../../models/news-state';
import newsSlice, { FetchNewsParams } from '../../slices';
import { DynamoDbResponse } from '../../../../models/response';
import { News, NewsKey } from '../../models/news';
import { theme } from '../../../../theme';
import NewsCardItem from './components/NewsCardItem';
import PillButton from '../../../../components/PillButton';

interface NewsScreenProps {
  news: NewsState;
  fetchNews: (
    params?: FetchNewsParams
  ) => Promise<DynamoDbResponse<News, NewsKey>>;
  fetchNextNews: () => Promise<DynamoDbResponse<News, NewsKey>>;
  navigation: NavigationScreenProp<any>;
}

interface NewsScreenState {
  isInitialized: boolean;
  isLoading: boolean;
  isFetchingMore: boolean;
}

class NewsScreen extends React.Component<NewsScreenProps, NewsScreenState> {
  static navigationOptions = {
    title: 'Noticias',
  };

  state = {
    isInitialized: false,
    isLoading: true,
    isFetchingMore: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.init();
    });
  }

  init(forceAll = false) {
    let params: FetchNewsParams = {};
    if (!forceAll) {
      const CreatedAt = this.props.navigation.getParam('createdAt');
      if (CreatedAt) {
        params = { CreatedAt };
      }
    }
    this.fetchNews(params).finally(() => {
      this.setState({ isInitialized: true });
    });
  }

  fetchNews(args: FetchNewsParams): Promise<any> {
    this.setState({ isLoading: true });
    return this.props.fetchNews(args).finally(() => {
      this.setState({ isLoading: false });
    });
  }

  fetchNextNews() {
    if (!this.props.news.news.lastEvaluatedKey || this.state.isFetchingMore) {
      // No more places to fetch.
      return;
    }
    this.setState({ isFetchingMore: true });
    this.props.fetchNextNews().finally(() => {
      this.setState({ isFetchingMore: false });
    });
  }

  renderFooter() {
    return (
      <View style={{ marginBottom: 12 }}>
        {this.state.isFetchingMore && (
          <ActivityIndicator color={theme.colors.accent} />
        )}
      </View>
    );
  }

  render() {
    const { isInitialized, isLoading } = this.state;

    if (!isInitialized || isLoading) {
      return (
        <ActivityIndicator
          color={theme.colors.accent}
          size="large"
          style={{ height: '100%' }}
        />
      );
    } else {
      const { ids, byId } = this.props.news.news;

      return (
        <View>
          <FlatList
            data={ids.map(id => byId[id]) as News[]}
            renderItem={({ item }) => <NewsCardItem news={item} />}
            onEndReached={() => this.fetchNextNews()}
            ListHeaderComponent={() => <View style={{ marginTop: 8 }} />}
            ListFooterComponent={() => this.renderFooter()}
            keyExtractor={item => item.Id.toString()}
          />
          {this.props.navigation.getParam('id') && (
            <PillButton
              onPress={() => this.init(true)}
              mode="contained"
              style={styles.button}
            >
              Más noticias
            </PillButton>
          )}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  button: {
    width: 160,
    alignSelf: 'center',
    backgroundColor: theme.colors.accent,
  },
});

const actions = newsSlice.actions as any;

const mapStateToProps = (state: { news: NewsState }) => ({
  news: state.news,
});

const mapDispatchToProps = {
  fetchNews: actions.fetchNews,
  fetchNextNews: actions.fetchNextNews,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsScreen);
