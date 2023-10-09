/**
 * @type { Array<import('@types/mapbox-gl').AnyLayer> }
 */
export default [
  {
    id: 'gl-draw-point-arrow',
    type: 'symbol',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'arrow'], ['==', 'active', 'false']],
    paint: {
      'icon-color': [
        'case',
        ['==', ['get', 'is-active'], 'true'],
        '#ff0000',
        ['coalesce', ['get', 'arrow-color'], ['get', 'line-color'], '#FF0000'],
      ],
    },
    layout: {
      'icon-anchor': 'center',
      'icon-allow-overlap': true,
      'icon-image': 'mapbox-gl-draw-icon-arrow',
      'icon-rotate': ['get', 'icon-rotate'],
      'text-allow-overlap': true,
      'icon-size': ['coalesce', ['get', 'arrow-size'], 0.5],
    },
  },
  {
    id: 'gl-draw-polygon-fill-inactive',
    type: 'fill',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static'],
    ],
    paint: {
      'fill-color': ['coalesce', ['get', 'fill-color'], '#ff0000'],
      'fill-outline-color': ['coalesce', ['get', 'fill-color'], '#ff0000'],
      'fill-opacity': ['coalesce', ['get', 'fill-opacity'], 0.1],
    },
  },
  {
    id: 'gl-draw-polygon-fill-active',
    type: 'fill',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': ['coalesce', ['get', 'fill-active-color'], ['get', 'fill-color'], '#ff0000'],
      'fill-outline-color': ['coalesce', ['get', 'fill-active-color'], ['get', 'fill-color'], '#ff0000'],
      'fill-opacity': ['coalesce', ['get', 'fill-opacity'], 0.1],
    },
  },
  {
    id: 'gl-draw-polygon-midpoint',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
    paint: {
      'circle-radius': ['coalesce', ['+', ['get', 'line-width'], 2], 3],
      'circle-color': ['coalesce', ['get', 'line-active-color'], '#FF0000'],
    },
  },
  {
    id: 'gl-draw-polygon-stroke-inactive',
    type: 'line',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static'],
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': ['coalesce', ['get', 'line-color'], '#e600ff'],
      'line-width': ['coalesce', ['get', 'line-width'], 2],
    },
  },
  {
    id: 'gl-draw-polygon-stroke-active',
    type: 'line',
    filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': ['coalesce', ['get', 'line-active-color'], '#FF0000'],
      'line-dasharray': [0.2, 2],
      'line-width': ['coalesce', ['get', 'line-width'], 2],
    },
  },
  // 线非选中态 实线
  {
    id: 'gl-draw-line-inactive-solid',
    type: 'line',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'LineString'],
      ['!=', 'mode', 'static'],
      ['!=', 'line-type', 'dashed']
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': ['coalesce', ['get', 'line-color'], '#e600ff'],
      'line-width': ['coalesce', ['get', 'line-width'], 2],
    },
  },
  // 线非选中态 虚线
  {
    id: 'gl-draw-line-inactive-dashed',
    type: 'line',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'LineString'],
      ['!=', 'mode', 'static'],
      ['==', 'line-type', 'dashed']
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': ['coalesce', ['get', 'line-color'], '#e600ff'],
      'line-width': ['coalesce', ['get', 'line-width'], 2],
      'line-dasharray': [0.2, 2],
    },
  },
  // 线要素选中态
  {
    id: 'gl-draw-line-active-dashed',
    type: 'line',
    filter: ['all',
      ['==', '$type', 'LineString'],
      ['==', 'active', 'true'],
      ['==', 'line-active-type', 'dashed']
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': ['coalesce', ['get', 'line-active-color'], '#ff0000'],
      'line-dasharray': [0.2, 2],
      'line-width': ['coalesce', ['get', 'line-width'], 2]
    },
  },
  {
    id: 'gl-draw-line-active-solid',
    type: 'line',
    filter: ['all',
      ['==', '$type', 'LineString'],
      ['==', 'active', 'true'],
      ['!=', 'line-active-type', 'dashed']
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': ['coalesce', ['get', 'line-active-color'], '#ff0000'],
      'line-width': ['coalesce', ['get', 'line-width'], 2]
    },
  },
  // 面和线要素 顶点 非选中状态描边
  {
    id: 'gl-draw-polygon-and-line-vertex-stroke-inactive',
    type: 'circle',
    filter: [
      'all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static'],
    ],
    paint: {
      'circle-radius': ['coalesce', ['+', ['get', 'line-width'], 3], 5],
      'circle-color': '#fff',
    },
  },
  // 面和线要素 顶点 - 非选中状态
  {
    id: 'gl-draw-polygon-and-line-vertex-inactive',
    type: 'circle',
    filter: [
      'all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static'],
    ],
    paint: {
      'circle-radius': ['coalesce', ['+', ['get', 'line-width'], 1], 3],
      'circle-color': ['coalesce', ['get', 'line-active-color'], '#ff0000'],
    },
  },
   // 线要素 名称显示
  {
    id: 'gl-draw-line-name',
    type: 'symbol',
    filter: [
      'all',
      ['==', '$type', 'LineString'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static'],
      ['all', ['!=', 'symbol-placement', 'line'], ['!=', 'symbol-placement', 'line-center']],
    ],
    layout: {
      'text-allow-overlap': true,
      'text-field': ['get', 'name'],
      'text-anchor': ['coalesce', ['get', 'text-anchor'], 'left'],
      'text-line-height': 1,
      'text-size': ['coalesce', ['get', 'text-size'], 14],
      'text-justify': 'center',
      'text-offset': [
        'case',
        ['to-boolean', ['get', 'text-offset']],
        ['get', 'text-offset'],
        [
          'match',
          ['get', 'text-anchor'],
          'left',  ['literal', [0.6, 0]],
          'right', ['literal', [-0.6, 0]],
          'top', ['literal', [0, 0.6]],
          'bottom', ['literal', [0, -0.6]],
          ['literal', [0, 0]]
        ]
      ],
    },
    paint: {
      'text-color': ['coalesce', ['get', 'text-color'], '#FF0000'],
      'text-halo-width': ['coalesce', ['get', 'text-halo-width'], 1],
      'text-halo-color': ['coalesce', ['get', 'text-halo-color'], '#FFFFFF'],
      'text-halo-blur': ['get', 'text-halo-blur'],
    }
  },
  {
    id: 'gl-draw-line-name-inline',
    type: 'symbol',
    filter: [
      'all',
      ['==', '$type', 'LineString'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static'],
      ['any', ['==', 'symbol-placement', 'line'], ['==', 'symbol-placement', 'line-center']]
    ],
    layout: {
      'text-allow-overlap': true,
      'text-field': ['get', 'name'],
      'text-anchor': ['coalesce', ['get', 'text-anchor'], 'left'],
      'text-line-height': 1,
      'text-size': ['coalesce', ['get', 'text-size'], 14],
      'text-justify': 'auto',
      'text-offset': [
        'case',
        ['to-boolean', ['get', 'text-offset']],
        ['get', 'text-offset'],
        [
          'match',
          ['get', 'text-anchor'],
          'left',  ['literal', [0.6, 0]],
          'right', ['literal', [-0.6, 0]],
          'top', ['literal', [0, 0.6]],
          'bottom', ['literal', [0, -0.6]],
          ['literal', [0, 0]]
        ]
      ],
      'symbol-placement': 'line',
      'text-pitch-alignment': 'viewport',
      'text-padding': 0,
      'symbol-spacing': [
        'interpolate',
        ['exponential', 1],
        ['zoom'],
        8,
        40,
        20,
        80
      ]
    },
    paint: {
      'text-color': ['coalesce', ['get', 'text-color'], '#FF0000'],
      'text-halo-width': ['coalesce', ['get', 'text-halo-width'], 1],
      'text-halo-color': ['coalesce', ['get', 'text-halo-color'], '#FFFFFF'],
      'text-halo-blur': ['get', 'text-halo-blur'],
    },
    minzoom: 10,
  },
  // 点标绘非选中态 底层模拟描边
  {
    id: 'gl-draw-point-point-stroke-inactive',
    type: 'circle',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static'],
      ['!=', 'featureType', 'customPoint'],
      ['!=', 'featureType', 'text'],
    ],
    paint: {
      'circle-radius': 5,
      'circle-opacity': 1,
      'circle-color': '#fff',
    },
  },
  // 点标绘非选中态 圆
  {
    id: 'gl-draw-point-inactive',
    type: 'circle',
    filter: [
      'all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static'],
      ['!=', 'featureType', 'customPoint'],
      ['!=', 'featureType', 'text'],
    ],
    paint: {
      'circle-radius': 3,
      'circle-color': ['coalesce', ['get', 'circle-color'], '#e600ff'],
    },
  },
  // 非选中状态 点标绘的名称
  {
    id: 'gl-draw-point-name',
    type: 'symbol',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static'],
      // ['==', 'active', 'false'],
    ],
    layout: {
      'text-allow-overlap': true,
      'icon-allow-overlap': true,
      'text-field': ['get', 'name'],
      'text-anchor': ['coalesce', ['get', 'text-anchor'], 'left'],
      'text-line-height': 1,
      'text-size': ['coalesce', ['get', 'text-size'], 14],
      'text-justify': 'center',
      'text-offset': [
        'case',
        ['to-boolean', ['get', 'text-offset']],
        ['get', 'text-offset'],
        [
          'match',
          ['get', 'text-anchor'],
          'left',  ['literal', [0.6, 0]],
          'right', ['literal', [-0.6, 0]],
          'top', ['literal', [0, 0.6]],
          'bottom', ['literal', [0, -0.6]],
          ['literal', [0, 0]]
        ]
      ],
      'icon-image': ['concat', 'mapbox-gl-draw-', ['get', 'icon-image']],
      'icon-anchor': ['coalesce', ['get', 'icon-anchor'], 'bottom'],
      'icon-size': ['interpolate', ['linear'], ['zoom'], 0, 0.01, 19, ['coalesce', ['get', 'icon-size'], 1]],
    },
    paint: {
      'text-color': ['coalesce', ['get', 'text-color'], '#FF0000'],
      'text-halo-width': ['coalesce', ['get', 'text-halo-width'], 1],
      'text-halo-color': ['coalesce', ['get', 'text-halo-color'], '#FFFFFF'],
      'text-halo-blur': ['get', 'text-halo-blur'],
    },
    // minzoom: 10,
  },
  // 点要素以及顶点被选中时 底层模拟描边
  {
    id: 'gl-draw-point-stroke-active',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'active', 'true'],
      ['!=', 'meta', 'midpoint'],
      ['!=', 'featureType', 'customPoint'],
      ['!=', 'featureType', 'text'],
    ],
    paint: {
      'circle-radius': ['case', ['has', 'line-width'], ['+', ['get', 'line-width'], 5], 7],
      'circle-color': '#fff',
    },
  },
  // 点要素以及顶点被选中时 非中心分割点
  {
    id: 'gl-draw-point-active',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['!=', 'meta', 'midpoint'],
      ['==', 'active', 'true'],
      ['!=', 'featureType', 'customPoint'],
      ['!=', 'featureType', 'text'],
    ],
    paint: {
      'circle-radius': ['coalesce', ['+', ['get', 'line-width'], 3], 5],
      'circle-color': ['coalesce',
        ['get', 'line-active-color'],
        ['get', 'circle-active-color'],
        '#FF0000'
      ],
    },
  },
  // 点标绘选中态 名称
  // {
  //   id: 'gl-draw-point-name-active',
  //   type: 'symbol',
  //   filter: [
  //     'all',
  //     ['==', '$type', 'Point'],
  //     ['==', 'meta', 'feature'],
  //     ['!=', 'mode', 'static'],
  //     ['==', 'active', 'true'],
  //   ],
  //   layout: {
  //     'text-allow-overlap': true,
  //     'text-field': ['get', 'name'],
  //     'text-anchor': ['coalesce', ['get', 'text-anchor'], 'left'],
  //     'text-line-height': 1,
  //     'text-size': ['coalesce', ['get', 'text-size'], 14],
  //     'text-justify': 'center',
  //     'text-offset': [
  //       'case',
  //       ['to-boolean', ['get', 'text-offset']],
  //       ['get', 'text-offset'],
  //       [
  //         'match',
  //         ['get', 'text-anchor'],
  //         'left',  ['literal', [0.6, 0]],
  //         'right', ['literal', [-0.6, 0]],
  //         'top', ['literal', [0, 0.6]],
  //         'bottom', ['literal', [0, -0.6]],
  //         ['literal', [0, 0]]
  //       ]
  //     ],
  //     'icon-image': ['concat', 'mapbox-gl-draw-', ['get', 'icon-image']],
  //     'icon-anchor': ['coalesce', ['get', 'icon-anchor'], 'bottom'],
  //     'icon-size': ['interpolate', ['linear'], ['zoom'], 0, 0.01, 19, ['coalesce', ['get', 'user_size'], 1]],
  //   },
  //   paint: {
  //     'text-color': ['coalesce', ['get', 'text-color'], '#FF0000'],
  //   },
  // },
  /**
   * 以下是静态模式下各种标绘图层显示样式
   */
  // {
  //   id: 'gl-draw-polygon-fill-static',
  //   type: 'fill',
  //   filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
  //   paint: {
  //     'fill-color': '#404040',
  //     'fill-outline-color': '#404040',
  //     'fill-opacity': 0.1,
  //   },
  // },
  // {
  //   id: 'gl-draw-polygon-stroke-static',
  //   type: 'line',
  //   filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
  //   layout: {
  //     'line-cap': 'round',
  //     'line-join': 'round',
  //   },
  //   paint: {
  //     'line-color': '#404040',
  //     'line-width': 2,
  //   },
  // },
  // {
  //   id: 'gl-draw-line-static',
  //   type: 'line',
  //   filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'LineString']],
  //   layout: {
  //     'line-cap': 'round',
  //     'line-join': 'round',
  //   },
  //   paint: {
  //     'line-color': '#404040',
  //     'line-width': 2,
  //   },
  // },
  // {
  //   id: 'gl-draw-point-static',
  //   type: 'circle',
  //   filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Point']],
  //   paint: {
  //     'circle-radius': 5,
  //     'circle-color': '#404040',
  //   },
  // },
];
