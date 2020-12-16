import React from 'react';

import { AppState, AppStateStatus, Dimensions } from 'react-native';
import {
  NavigationEventSubscription,
  NavigationScreenProp,
  withNavigation,
} from 'react-navigation';
import Carousel, { CarouselStatic } from 'react-native-snap-carousel';

interface LoopedCarouselProps {
  data: any[];
  renderItem: ({ item, index }) => React.ReactNode;
  seconds?: number;
  padding?: number;
  navigation: NavigationScreenProp<any>;
}

class LoopedCarousel extends React.Component<LoopedCarouselProps> {
  carousel: CarouselStatic<any>;
  interval: number;
  appState = '';
  handleAppStateChangeBound: () => void;
  focusListener: NavigationEventSubscription = null;

  constructor(props) {
    super(props);
    this.handleAppStateChangeBound = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
    this.listenToFocus();
    AppState.addEventListener('change', this.handleAppStateChangeBound);
  }

  componentWillUnmount() {
    this.focusListener.remove();
    AppState.removeEventListener('change', this.handleAppStateChangeBound);
  }

  listenToFocus() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      // Start autoplay on focus if not already started
      this.startAutoPlay();
    });
  }

  startAutoPlay() {
    if (this.interval) {
      // Already started, do nothing.
      return;
    }
    const seconds = this.props.seconds || 5;
    this.interval = setInterval(() => {
      if (this.carousel) {
        this.next();
      }
    }, seconds * 1000);
  }

  stopAutoPlay() {
    if (!this.interval) {
      // Already stopped, do nothing.
      return;
    }
    clearInterval(this.interval);
    this.interval = null;
  }

  next() {
    const { currentIndex } = this.carousel;
    const nextIndex = (currentIndex + 1) % this.props.data.length;
    this.carousel.snapToItem(nextIndex);
  }

  handleAppStateChange(nextAppState: AppStateStatus) {
    const backgroundRegex = /inactive|background/;
    if (nextAppState === 'active' && this.appState.match(backgroundRegex)) {
      // Moved to foreground
      this.startAutoPlay();
    } else if (
      nextAppState.match(backgroundRegex) &&
      this.appState === 'active'
    ) {
      // Moved to background
      this.stopAutoPlay();
    }
    this.appState = nextAppState;
  }

  render() {
    const width = Dimensions.get('window').width;
    const { data, renderItem, padding } = this.props;

    return (
      <Carousel
        data={data}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width - (padding || 0)}
        activeSlideAlignment="start"
        onLayout={() => this.startAutoPlay()}
        onTouchStart={() => this.stopAutoPlay()}
        ref={c => (this.carousel = c)}
      />
    );
  }
}

export default withNavigation(LoopedCarousel);
