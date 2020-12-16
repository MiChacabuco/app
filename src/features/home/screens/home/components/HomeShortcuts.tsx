import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { connect } from 'react-redux';
import { NavigationScreenProp, withNavigation } from 'react-navigation';
import { Caption } from 'react-native-paper';

// @ts-ignore
import DeliveryIcon from '../../../../../assets/icons/delivery.svg';
// @ts-ignore
import IceCreamsIcon from '../../../../../assets/icons/icecream.svg';
// @ts-ignore
import PhoneBookIcon from '../../../../../assets/icons/phone-book.svg';
// @ts-ignore
import TaxiIcon from '../../../../../assets/icons/taxi.svg';
// @ts-ignore
import PharmacyIcon from '../../../../../assets/icons/pharmacy.svg';
// @ts-ignore
import NewsPaperIcon from '../../../../../assets/icons/newspaper.svg';
import { theme } from '../../../../../theme';
import newsSlice, { FetchNewsParams } from '../../../../news/slices';
import { NewsState } from '../../../../news/models/news-state';
import { DynamoDbResponse } from '../../../../../models/response';
import { setTimeoutWorkaround } from '../../../../../utils';
import { News, NewsKey } from '../../../../news/models/news';

interface HomeShortcutsState {
  highlightNews: boolean;
}

interface HomeShortcutsProps {
  news: NewsState;
  fetchNews: (
    params?: FetchNewsParams
  ) => Promise<DynamoDbResponse<News, NewsKey>>;
  navigation: NavigationScreenProp<any>;
}

interface HomeShortcut {
  key: string;
  title: string;
  icon;
  onPress: () => void;
  highlight?: () => boolean;
}

const ICON_SIZE = 40;

class HomeShortcuts extends React.Component<
  HomeShortcutsProps,
  HomeShortcutsState
> {
  state = {
    highlightNews: false,
  };

  shortcuts = [
    {
      key: '1',
      title: 'Num. útiles',
      icon: <PhoneBookIcon width={ICON_SIZE} height={ICON_SIZE} />,
      onPress: () => this.goTo('UsefulNumbers'),
    },
    {
      key: '2',
      title: 'Noticias',
      icon: <NewsPaperIcon width={ICON_SIZE} height={ICON_SIZE} />,
      onPress: () => this.goToNews(),
      highlight: () => this.state.highlightNews,
    },
    {
      key: '3',
      title: 'Heladerías',
      icon: <IceCreamsIcon width={ICON_SIZE} height={ICON_SIZE} />,
      onPress: () => this.goTo('IceCreams'),
    },
    {
      key: '4',
      title: 'Farmacias',
      icon: <PharmacyIcon width={ICON_SIZE} height={ICON_SIZE} />,
      onPress: () => this.goTo('Pharmacies'),
    },
    {
      key: '5',
      title: 'Remises',
      icon: <TaxiIcon width={ICON_SIZE} height={ICON_SIZE} />,
      onPress: () => this.goTo('Taxi'),
    },
    {
      key: '6',
      title: 'Delivery',
      icon: <DeliveryIcon width={ICON_SIZE} height={ICON_SIZE} />,
      onPress: () => this.goTo('Deliveries'),
    },
  ];

  componentDidMount() {
    this.checkUnreadNews();
  }

  goTo(route: string) {
    this.props.navigation.navigate(route);
  }

  goToNews() {
    this.goTo('News');
    this.setState({ highlightNews: false });
  }

  checkUnreadNews() {
    const { lastFetch } = this.props.news.news;
    if (!lastFetch) {
      this.setState({ highlightNews: true });
    } else {
      const params: FetchNewsParams = {
        Limit: 1,
        ProjectionExpression: 'Id, CreatedAt',
      };
      this.props.fetchNews(params).then(response => {
        const { Items } = response.body;
        if (Items.length) {
          const lastNews = Items[0];
          const timestamp = lastNews.CreatedAt;
          if (timestamp > lastFetch) {
            this.setState({ highlightNews: true });
          }
        }
      });
    }
  }

  renderShortcut(shortcut: HomeShortcut) {
    return (
      <View key={shortcut.key} style={{ paddingVertical: 8, width: '30%' }}>
        <TouchableWithoutFeedback
          onPress={() => setTimeoutWorkaround(shortcut.onPress)}
        >
          <View style={{ alignItems: 'center' }}>
            {shortcut.icon}
            {shortcut.highlight && shortcut.highlight() && (
              <View style={styles.highlight} />
            )}
            <Caption style={{ fontWeight: 'bold' }}>{shortcut.title}</Caption>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.shortcuts.map(shortcut => this.renderShortcut(shortcut))}
      </View>
    );
  }
}

const highlightSize = 16;
const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  highlight: {
    width: highlightSize,
    height: highlightSize,
    borderRadius: highlightSize,
    backgroundColor: theme.colors.accent,
    position: 'absolute',
    right: 16,
    top: -8,
  },
});

const newsActions = newsSlice.actions as any;

const mapStateToProps = (state: { news: NewsState }) => ({
  news: state.news,
});

const mapDispatchToProps = {
  fetchNews: newsActions.fetchNews,
};

const ConnectedHomeShortcuts = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeShortcuts);

export default withNavigation(ConnectedHomeShortcuts);
