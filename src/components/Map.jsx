import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import SearchBox from './SearchBox';
import ZoomControl from './ZoomControl';
import Attribution from './Attribution';
import LayersControl from './LayersControl';
import Legend from './Legend';
import { useQuery } from 'urql';
import { ACTIONS, useMapsReducer } from '../hooks/MapsProvider';
import Popup from './Popup';

const MyQuery = `
query MyQuery {
  list_kecamatan {
    geom
    id_kec
    kec
    luas
    x_max
    x_min
    y_max
    y_min
    centroid
  }
  ruas_jalan {
    arah_lalin
    image_url
    lebar
    nama_jalan
    panjang
    geom
    kode_fungsi_jalan
    nomor_ruas
    centroid
    y_min
    y_max
    x_min
    x_max
  }
  list_desa_kelurahan {
    geom
    desa_kel
    id_desa_kel
    luas
    centroid
    x_max
    x_min
    y_max
    y_min
  }
  jembatan {
    geom
    lebar
    nama_jembatan
    panjang
    nomor_jembatan
    image_url
  }
}

`;

function Map() {
  const [{ fetching, error, data }, reexecuteQuery] = useQuery({
    query: MyQuery,
  });
  const { mapState, dispatch } = useMapsReducer();
  const mapRef = useRef(null);
  const map = useRef(null);
  const popUpRef = useRef(
    new maplibregl.Popup({ offset: 15, closeButton: false })
  );
  const addLayers = () => {
    if (!map.current) return;
    const lastBasemapLayerId =
      map.current.getStyle().layers[map.current.getStyle().layers.length - 1]
        .id;
    Object.keys(data).map((layer) => {
      const visibility = mapState.activeLayers[layer] ? 'visible' : 'none';
      if (!map.current.getSource(layer)) {
        map.current.addSource(layer, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: data[layer].map((dataObject) => {
              const { geom, ...dataProperties } = dataObject;
              return {
                type: 'Feature',
                geometry: geom,
                properties: dataProperties,
              };
            }),
          },
        });
      }
      if (map.current.getLayer(layer)) return;
      if (layer == 'jembatan') {
        if (!map.current.hasImage(layer)) {
          map.current.loadImage(
            `/icon/mapicon-jembatan.png`,
            (error, image) => {
              if (error) throw error;
              map.current.addImage(layer, image);
            }
          );
        }
        map.current.addLayer({
          id: layer,
          type: 'symbol',
          source: layer,
          layout: {
            'icon-image': layer,
            'icon-size': 1,
            visibility: visibility,
          },
        });
      }
      if (layer == 'ruas_jalan') {
        map.current.addLayer({
          id: layer,
          type: 'line',
          source: layer,
          layout: { visibility: visibility },
          paint: {
            'line-width': [
              'case',
              ['in', ['get', 'kode_fungsi_jalan'], 'AP'],
              4,
              ['in', ['get', 'kode_fungsi_jalan'], ['literal', 'KP-1,2']],
              3,
              [
                'in',
                ['get', 'kode_fungsi_jalan'],
                ['literal', ['KP-2,3', 'KP-4']],
              ],
              3,
              [
                'in',
                ['get', 'kode_fungsi_jalan'],
                ['literal', ['LP-1', 'LP-2', 'LP-3']],
              ],
              2,
              1,
            ],
            'line-color': [
              'case',
              ['in', ['get', 'kode_fungsi_jalan'], 'AP'],
              '#FF0000',
              ['in', ['get', 'kode_fungsi_jalan'], ['literal', 'KP-1,2']],
              '#0000FF',
              [
                'in',
                ['get', 'kode_fungsi_jalan'],
                ['literal', ['KP-2,3', 'KP-4']],
              ],
              '#A26834',
              [
                'in',
                ['get', 'kode_fungsi_jalan'],
                ['literal', ['LP-1', 'LP-2', 'LP-3']],
              ],
              '#01DB00',
              '#FF02FF',
            ],
          },
        });
      }
      if (layer == 'list_desa_kelurahan') {
        map.current.addLayer(
          {
            id: layer,
            type: 'fill',
            source: layer,
            paint: {
              'fill-color': '#16AED5',
              'fill-opacity': 0.5,
            },
            layout: {
              visibility: visibility,
            },
          },
          lastBasemapLayerId
        );
        map.current.addLayer(
          {
            id: layer + '-line',
            type: 'line',
            source: layer,
            paint: {
              'line-color': '#E2E2E2',
              'line-width': 2,
            },
            layout: {
              visibility: visibility,
            },
          },
          lastBasemapLayerId
        );
      }
      if (layer == 'list_kecamatan') {
        map.current.addLayer(
          {
            id: layer,
            type: 'fill',
            source: layer,
            paint: {
              'fill-color': '#57D8BD',
              'fill-opacity': 0.5,
            },
            layout: {
              visibility: visibility,
            },
          },
          lastBasemapLayerId
        );
        map.current.addLayer(
          {
            id: layer + '-line',
            type: 'line',
            source: layer,
            paint: {
              'line-color': '#FEE01E',
              'line-width': 2,
              'line-opacity': 0.5,
            },
            layout: {
              visibility: visibility,
            },
          },
          lastBasemapLayerId
        );
      }
      if (layer == 'jembatan' || layer == 'ruas_jalan') {
        map.current.on('mouseenter', layer, () => {
          map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('mouseleave', layer, () => {
          map.current.getCanvas().style.cursor = '';
        });
        map.current.on('click', layer, (e) => {
          e.preventDefault();
          const features = map.current.queryRenderedFeatures(e.point, {
            layers: [layer],
          });
          if (features.length > 0) {
            const feature = features[0];
            const layerName = features[0].layer.id;
            const popupNode = document.createElement('div');
            ReactDOM.render(
              <Popup layerName={layerName} properties={feature.properties} />,
              popupNode
            );
            popUpRef.current
              .setLngLat(
                layerName == 'jembatan'
                  ? feature.geometry.coordinates
                  : e.lngLat
              )
              .setDOMContent(popupNode)
              .addTo(map.current);
            if (layerName == 'jembatan') {
              map.current.flyTo({
                center: feature.geometry.coordinates,
              });
            }
          }
        });
      }
    });
  };
  useEffect(() => {
    if (map.current) return;
    map.current = new maplibregl.Map({
      container: mapRef.current,
      style: `https://api.maptiler.com/maps/${mapState.basemap}/style.json?key=xzn4adPBWgyxYwsaho8N`,
      ...mapState.viewport,
      attributionControl: false,
    });
    map.current.on('move', () => {
      dispatch({
        type: ACTIONS.ON_MOVE_MAP,
        payload: map,
      });
    });
  });

  useEffect(() => {
    if (fetching == true || error) return;
    addLayers();
  }, [fetching]);
  return (
    <div id='map-container' className='bg-[#000] relative'>
      <div id='map' ref={mapRef} />
      <SearchBox map={map} mapData={data} popup={popUpRef} />
      <ZoomControl map={map} />
      <LayersControl map={map} addLayers={addLayers} />
      <Legend map={map} />
      <Attribution />
    </div>
  );
}

export default Map;
