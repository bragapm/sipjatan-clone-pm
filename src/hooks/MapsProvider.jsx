import React, { useReducer, useContext } from 'react';
import ReactDOM from 'react-dom';
import Popup from '../components/Popup';
import maplibregl from 'maplibre-gl';
const MapsContext = React.createContext();

export const ACTIONS = {
  ON_MOVE_MAP: 'on-move-map',
  CHANGE_BASEMAP: 'change-basemap',
  ZOOM_IN: 'zoom-in',
  ZOOM_OUT: 'zoom-out',
  TOGGLE_LAYER: 'toggle-layer',
  SELECT_BOUNDARY: 'select_boundary',
  ZOOM_TO: 'zoom-to',
};

export function useMapsReducer() {
  return useContext(MapsContext);
}

function reducer(mapState, action) {
  const layer = action.payload.layer;

  switch (action.type) {
    case ACTIONS.CHANGE_BASEMAP:
      if (action.payload.basemap == mapState.basemap) return mapState;
      action.payload.map.current.setStyle(
        `https://api.maptiler.com/maps/${action.payload.basemap}/style.json?key=xzn4adPBWgyxYwsaho8N`
      );
      setTimeout(() => {
        action.payload.addLayers();
      }, 1000);

      return {
        ...mapState,
        basemap: action.payload.basemap,
      };
    case ACTIONS.ON_MOVE_MAP:
      return {
        ...mapState,
        viewport: {
          center: [
            action.payload.current.getCenter().lng.toFixed(4),
            action.payload.current.getCenter().lat.toFixed(4),
          ],
          zoom: action.payload.current.getZoom().toFixed(2),
        },
      };
    case ACTIONS.ZOOM_IN:
      action.payload.current.zoomIn({ duration: 300 });
      return {
        ...mapState,
        viewport: {
          ...mapState.viewport,
          zoom: action.payload.current.getZoom().toFixed(2),
        },
      };
    case ACTIONS.ZOOM_OUT:
      action.payload.current.zoomOut({ duration: 300 });
      return {
        ...mapState,
        viewport: {
          ...mapState.viewport,
          zoom: action.payload.current.getZoom().toFixed(2),
        },
      };
    case ACTIONS.TOGGLE_LAYER:
      if (mapState.activeLayers[layer]) {
        action.payload.map.current.setLayoutProperty(
          layer,
          'visibility',
          'none'
        );
      } else {
        action.payload.map.current.setLayoutProperty(
          layer,
          'visibility',
          'visible'
        );
      }
      return {
        ...mapState,
        activeLayers: {
          ...mapState.activeLayers,
          [layer]: !mapState.activeLayers[layer],
        },
      };
    case ACTIONS.SELECT_BOUNDARY:
      const otherLayer =
        layer == 'list_kecamatan' ? 'list_desa_kelurahan' : 'list_kecamatan';
      if (mapState.activeLayers[layer]) {
        action.payload.map.current.setLayoutProperty(
          layer,
          'visibility',
          'none'
        );
        action.payload.map.current.setLayoutProperty(
          layer + '-line',
          'visibility',
          'none'
        );

        return {
          ...mapState,
          activeLayers: {
            ...mapState.activeLayers,
            [layer]: !mapState.activeLayers[layer],
          },
        };
      }
      action.payload.map.current.setLayoutProperty(
        layer,
        'visibility',
        'visible'
      );
      action.payload.map.current.setLayoutProperty(
        layer + '-line',
        'visibility',
        'visible'
      );
      action.payload.map.current.setLayoutProperty(
        otherLayer,
        'visibility',
        'none'
      );
      action.payload.map.current.setLayoutProperty(
        otherLayer + '-line',
        'visibility',
        'none'
      );
      return {
        ...mapState,
        activeLayers: {
          ...mapState.activeLayers,
          [otherLayer]: false,
          [layer]: true,
        },
      };
    case ACTIONS.ZOOM_TO:
      if (action.payload.layer == 'jembatan') {
        action.payload.map.current.flyTo({
          center: action.payload.feature.geom.coordinates,
          zoom: 16,
        });
      } else {
        const sw = new maplibregl.LngLat(
          action.payload.feature.x_min,
          action.payload.feature.y_min
        );
        const ne = new maplibregl.LngLat(
          action.payload.feature.x_max,
          action.payload.feature.y_max
        );
        const bounds = new maplibregl.LngLatBounds(sw, ne);
        action.payload.map.current.fitBounds(bounds, {
          padding: 20,
        });
      }
      const popupNode = document.createElement('div');
      const { geom, centroid, ...properties } = action.payload.feature;
      ReactDOM.render(
        <Popup layerName={action.payload.layer} properties={properties} />,
        popupNode
      );
      action.payload.popup.current
        .setLngLat(
          action.payload.layer == 'jembatan'
            ? geom.coordinates
            : centroid.coordinates
        )
        .setDOMContent(popupNode)
        .addTo(action.payload.map.current);
      return mapState;
    default:
      return mapState;
  }
}

function MapsProvider({ children }) {
  const [mapState, dispatch] = useReducer(reducer, {
    basemap: 'basic',
    viewport: {
      center: [107.57954441836489, -7.060325544128176],
      zoom: 9.5,
    },
    activeLayers: {
      ruas_jalan: true,
    },
  });
  return (
    <MapsContext.Provider value={{ mapState, dispatch }}>
      {children}
    </MapsContext.Provider>
  );
}

export default MapsProvider;
