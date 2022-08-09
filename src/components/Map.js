import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import '@arcgis/core/assets/esri/themes/dark/main.css';

import crimeData from '../data/crime.geojson';

const Wrapper = styled.div`
  height: 800px;
`;

export default function Map() {
  const mapBox = useRef(null);

  useEffect(() => {
    const map = new WebMap({
      basemap: 'topo-vector',
    });

    const view = new MapView({
      map,
      center: [-83.10517, 42.38788],
      zoom: 12,
      container: mapBox.current,
    });

    const renderer = {
      type: 'simple',
      field: 'arrest_charge',
      symbol: {
        type: 'simple-marker',
        color: 'orange',
        outline: {
          color: 'white',
        },
      },
      visualVariables: [
        {
          type: 'color',
          field: 'arrest_charge',
          stops: [
            {
              value: '12000', // robbery
              color: '#191970',
            },
            {
              value: '20000', // arson
              color: '#006400',
            },
            {
              value: '26003', // fraud
              color: '#ff0000',
            },
            {
              value: '38003', // domestic
              color: '#ffd700',
            },
            {
              value: '26009', // larceny
              color: '#00ff00',
            },
            {
              value: '70000', // runaway
              color: '#00FFFF',
            },
            {
              value: '24001', // stolen vehicle
              color: '#ff00ff',
            },
            {
              value: '13002', // aggravated assault
              color: '#ffb6c1',
            },
          ],
        },
      ],
    };

    const popupTemplate = {
      title: 'Crime Information',
      content: '{offense_description} at {address}',
    };

    const layer = new GeoJSONLayer({
      url: crimeData,
      renderer,
      popupTemplate,
    });

    map.add(layer);

    return () => {
      if (view) view.destroy();
    };
  }, []);

  return <Wrapper ref={mapBox} />;
}
