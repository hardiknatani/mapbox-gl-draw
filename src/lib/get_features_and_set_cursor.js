import featuresAt from './features_at';
import * as Constants from '../constants';

export default function getFeatureAtAndSetCursors(event, ctx) {
  const features = featuresAt.click(event, null, ctx);
  const classes = { mouse: Constants.cursors.NONE };

  if (features[0]) {
    if (features[0].properties.active === Constants.activeStates.ACTIVE) {
      classes.mouse = Constants.cursors.MOVE
    } else {
      if (features[0].properties.disabled === false) {
        classes.mouse = Constants.cursors.POINTER
      }
    }
    classes.feature = features[0].properties.meta;
  }

  if (ctx.events.currentModeName().indexOf('draw') !== -1) {
    classes.mouse = Constants.cursors.ADD;
  }

  ctx.ui.queueMapClasses(classes);
  ctx.ui.updateMapClasses();

  return features[0];
}
