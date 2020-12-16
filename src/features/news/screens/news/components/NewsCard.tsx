import React from 'react';
import { StyleSheet } from 'react-native';

import { WebViewProps } from 'react-native-webview';
import { NavigationScreenProp, withNavigation } from 'react-navigation';
import { Avatar, Button, Card, Paragraph, Title } from 'react-native-paper';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { News } from '../../../models/news';
import { getImage } from '../../../../../utils';

export interface NewsCardProps {
  news: News;
  navigation: NavigationScreenProp<any>;
}

class NewsCard extends React.Component<NewsCardProps> {
  get date() {
    const timestamp = this.props.news.CreatedAt;
    const date = new Date(timestamp);
    return format(date, "d 'de' MMMM 'de' Y", { locale: es });
  }

  get avatar() {
    const { Source } = this.props.news;
    if (!Source.Avatar) {
      // No avatar, show nothing.
      return null;
    }

    const size = 40;
    const resolution = { width: size, height: size };
    const uri = getImage(Source.Avatar, { dimensions: resolution });
    return <Avatar.Image size={size} source={{ uri }} />;
  }

  getNewsImage(news: News): string {
    const resolution = { width: 360 };
    return getImage(news.Image, { dimensions: resolution, quality: 25 });
  }

  readMore() {
    const { Link } = this.props.news;
    if (!Link) {
      return;
    }
    const webViewProps: WebViewProps = {
      source: { uri: Link },
      cacheMode: 'LOAD_CACHE_ELSE_NETWORK',
    };
    this.props.navigation.navigate('WebViewScreen', {
      webViewProps,
      showTabBar: false,
    });
  }

  render() {
    const { news } = this.props;

    return (
      <Card
        onPress={() => {
          this.readMore();
        }}
      >
        <Card.Title
          title={news.Source.Name}
          titleStyle={styles.title}
          subtitle={this.date}
          left={() => this.avatar}
        />
        {news.Image && <Card.Cover source={{ uri: this.getNewsImage(news) }} />}
        <Card.Content style={{ marginTop: 8 }}>
          <Title style={{ marginBottom: 8 }}>{news.Title}</Title>
          <Paragraph numberOfLines={5}>{news.Summary}</Paragraph>
        </Card.Content>
        <Card.Actions style={{ alignSelf: 'flex-end' }}>
          {news.Link && (
            <Button onPress={() => this.readMore()}>Leer más</Button>
          )}
        </Card.Actions>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    color: '#333',
    textTransform: 'uppercase',
    marginVertical: 0,
    letterSpacing: 0.5,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default withNavigation(NewsCard);
