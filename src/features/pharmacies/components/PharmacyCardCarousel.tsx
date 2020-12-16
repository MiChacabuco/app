import React from 'react';

import { connect } from 'react-redux';
import { AppState, AppStateStatus } from 'react-native';
import { differenceInMilliseconds } from 'date-fns';

import { PharmacyShift } from '../models/pharmacy-shift';
import { PharmaciesState } from '../models/pharmacies-state';
import pharmaciesSlice from '../slices';
import { AdminRequestParams } from '../../../models/request-params';
import PharmacyCard from './PharmacyCard';
import LoopedCarousel from '../../../components/LoopedCarousel';

interface PharmacyCardCarouselProps {
  fetchShifts: (params: AdminRequestParams) => Promise<any>;
  shifts: PharmacyShift[];
}

interface PharmacyCardCarouselState {
  isLoading: boolean;
}

class PharmacyCardCarousel extends React.Component<
  PharmacyCardCarouselProps,
  PharmacyCardCarouselState
> {
  state = {
    isLoading: true,
  };
  appState = '';
  refreshTimeout = null;
  handleAppStateChangeBound: () => void;

  constructor(props) {
    super(props);
    this.handleAppStateChangeBound = this.handleAppStateChange.bind(this);
  }

  get shifts(): PharmacyShift[] {
    const now = new Date().toISOString();
    return this.props.shifts.filter(shift => {
      return now >= shift.start && now <= shift.end;
    });
  }

  get firstEndingShift() {
    const shifts = this.shifts;
    if (!shifts.length) {
      return null;
    }
    const shiftsSortedByEnd = shifts.sort((shiftA, shiftB) =>
      shiftA.end < shiftB.end ? -1 : 1
    );
    return shiftsSortedByEnd[0];
  }

  componentDidMount() {
    this.init();
    AppState.addEventListener('change', this.handleAppStateChangeBound);
  }

  componentWillUnmount() {
    this.replaceRefreshTimeout(null, false);
    AppState.removeEventListener('change', this.handleAppStateChangeBound);
  }

  init() {
    this.fetchShifts();
  }

  fetchShifts() {
    this.setState({ isLoading: true });
    return this.doFetchShifts().finally(() => {
      this.setState({ isLoading: false });
    });
  }

  doFetchShifts() {
    return this.props.fetchShifts({ limit: 14 }).finally(() => {
      const shifts = this.shifts;
      if (shifts.length) {
        this.scheduleRefresh(this.firstEndingShift);
      }
    });
  }

  scheduleRefresh(shift: PharmacyShift) {
    /** Refresh shifts when current shift ends **/
    const ms = differenceInMilliseconds(new Date(shift.end), new Date());
    const refreshTimeout = setTimeout(() => this.doFetchShifts(), ms);
    this.replaceRefreshTimeout(refreshTimeout);
  }

  handleAppStateChange(nextAppState: AppStateStatus) {
    const backgroundRegex = /inactive|background/;
    if (nextAppState === 'active' && this.appState.match(backgroundRegex)) {
      // Moved to foreground
      const now = new Date().toISOString();
      const firstEndingShift = this.firstEndingShift;
      if (!firstEndingShift || now > firstEndingShift.end) {
        this.fetchShifts();
      }
    } else if (
      nextAppState.match(backgroundRegex) &&
      this.appState === 'active'
    ) {
      // Moved to background
      this.replaceRefreshTimeout(null);
    }
    this.appState = nextAppState;
  }

  replaceRefreshTimeout(newTimeout: number, setState = true) {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
    if (setState) {
      this.refreshTimeout = newTimeout;
    }
  }

  render() {
    if (this.state.isLoading) {
      // Used as placeholder (loading state)
      return <PharmacyCard />;
    }

    return (
      <LoopedCarousel
        data={this.shifts}
        renderItem={({ item }) => <PharmacyCard shift={item} />}
        padding={32}
      />
    );
  }
}

const actions = pharmaciesSlice.actions as any;

const mapStateToProps = (state: { pharmacies: PharmaciesState }) => ({
  shifts: state.pharmacies.shifts,
});

const mapDispatchToProps = {
  fetchShifts: actions.fetchShifts,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PharmacyCardCarousel);
