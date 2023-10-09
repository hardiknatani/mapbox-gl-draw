import events from './events';
import Store from './store';
import ui from './ui';
import * as Constants from './constants';
import xtend from 'xtend';

export default function(ctx) {

  let controlContainer = null;
  let mapLoadedInterval = null;

  const iconPrefix = "mapbox-gl-draw-";

  const setup = {
    onRemove() {
      // Stop connect attempt in the event that control is removed before map is loaded
      ctx.map.off('load', setup.connect);
      clearInterval(mapLoadedInterval);

      setup.removeLayers();
      setup.removeIcons();
      ctx.store.restoreMapConfig();
      ctx.ui.removeButtons();
      ctx.events.removeEventListeners();
      ctx.ui.clearMapClasses();
      ctx.map = null;
      ctx.container = null;
      ctx.store = null;

      if (controlContainer && controlContainer.parentNode) controlContainer.parentNode.removeChild(controlContainer);
      controlContainer = null;

      return this;
    },
    connect() {
      ctx.map.off('load', setup.connect);
      clearInterval(mapLoadedInterval);
      setup.addLayers();
      // setup.addIcons();
      ctx.store.storeMapConfig();
      ctx.events.addEventListeners();
    },
    onAdd(map) {
      if (ctx.options.debug) {
        // Monkey patch to resolve breaking change to `fire` introduced by
        // mapbox-gl-js. See mapbox/mapbox-gl-draw/issues/766.
        const _fire = map.fire;
        map.fire = function(type, event) {
          // eslint-disable-next-line
          let args = arguments;

          if (_fire.length === 1 && arguments.length !== 1) {
            args = [xtend({}, { type }, event)];
          }

          return _fire.apply(map, args);
        };
      }

      ctx.map = map;
      ctx.events = events(ctx);
      ctx.ui = ui(ctx);
      ctx.container = map.getContainer();
      ctx.store = new Store(ctx);


      controlContainer = ctx.ui.addButtons();

      if (ctx.options.boxSelect) {
        map.boxZoom.disable();
        // Need to toggle dragPan on and off or else first
        // dragPan disable attempt in simple_select doesn't work
        map.dragPan.disable();
        map.dragPan.enable();
      }

      if (map.loaded()) {
        setup.connect();
      } else {
        map.on('load', setup.connect);
        mapLoadedInterval = setInterval(() => { if (map.loaded()) setup.connect(); }, 16);
      }

      ctx.events.start();
      ctx.options.debug && console.log(ctx);
      return controlContainer;
    },
    addLayers() {
      // drawn features style
      ctx.map.addSource(Constants.sources.COLD, {
        data: {
          type: Constants.geojsonTypes.FEATURE_COLLECTION,
          features: []
        },
        type: 'geojson'
      });

      // hot features style
      ctx.map.addSource(Constants.sources.HOT, {
        data: {
          type: Constants.geojsonTypes.FEATURE_COLLECTION,
          features: []
        },
        type: 'geojson'
      });

      ctx.options.styles.forEach((style) => {
        ctx.map.addLayer(style);
      });

      ctx.store.setDirty(true);
      ctx.store.render();
    },
    // Check for layers and sources before attempting to remove
    // If user adds draw control and removes it before the map is loaded, layers and sources will be missing
    removeLayers() {
      ctx.options.styles.forEach((style) => {
        if (ctx.map.getLayer(style.id)) {
          ctx.map.removeLayer(style.id);
        }
      });

      if (ctx.map.getSource(Constants.sources.COLD)) {
        ctx.map.removeSource(Constants.sources.COLD);
      }

      if (ctx.map.getSource(Constants.sources.HOT)) {
        ctx.map.removeSource(Constants.sources.HOT);
      }
    },
    // 添加icon
    addIcons () {
      Object.keys(ctx.options.icons).forEach((iconName) => {
        const icon = ctx.options.icons[iconName];
        ctx.map.loadImage(icon.url, (error, image) => {
          if (!error && !ctx.map.hasImage(`${iconPrefix}${iconName}`)) ctx.map.addImage(`${iconPrefix}${iconName}`, image, icon.options);
        });
      });
    },
    // 移除icon
    removeIcons () {
      Object.keys(ctx.options.icons).forEach((iconName) => {
        if (ctx.map.hasImage(`${iconPrefix}${iconName}`)) ctx.map.removeImage(`${iconPrefix}${iconName}`);
      });
    }
  };

  ctx.setup = setup;

  return setup;
}