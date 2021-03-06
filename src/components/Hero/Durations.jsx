import React from 'react';
import { string, shape, func, bool, arrayOf, number } from 'prop-types';
import { connect } from 'react-redux';
import { getHeroDurations } from 'actions';
import Spinner from 'components/Spinner';
import { HistogramGraph } from 'components/Visualizations';
import strings from 'lang';

class Durations extends React.Component {
  static propTypes = {
    match: shape({
      params: shape({
        heroId: string,
      }),
    }),
    onGetHeroDurations: func,
    isLoading: bool,
    data: arrayOf(shape({
      duration_bin: number,
      gamed_played: number,
      wins: number,
    })),
  }

  componentDidMount() {
    const { onGetHeroDurations, match } = this.props;

    if (match.params && match.params.heroId) {
      onGetHeroDurations(match.params.heroId);
    }
  }

  render() {
    const { isLoading, data } = this.props;

    if (isLoading) {
      return <Spinner />;
    }

    const result = data.map(item => ({
      win: item.wins,
      games: item.games_played,
      x: (item.duration_bin / 60),
    })).sort((a, b) => a.x - b.x);

    return (
      <div>
        <HistogramGraph columns={result} xAxisLabel={strings.hero_duration_x_axis} />
      </div>
    );
  }
}

const mapDispatchToProps = {
  onGetHeroDurations: getHeroDurations,
};

const mapStateToProps = ({ app }) => ({
  isLoading: app.heroDurations.loading,
  data: Object.values(app.heroDurations.data),
});

export default connect(mapStateToProps, mapDispatchToProps)(Durations);
