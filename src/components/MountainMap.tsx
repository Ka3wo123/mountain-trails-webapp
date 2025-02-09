import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Peak } from '../models/Peak';
import icon from '../assets/mountain-marker.png';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

const fetchPeaks = async (bounds: { lat1: number; lon1: number; lat2: number; lon2: number }) => {
    try {
        const response = await fetch(`http://localhost:5000/peaks?lat1=${bounds.lat1}&lon1=${bounds.lon1}&lat2=${bounds.lat2}&lon2=${bounds.lon2}`);
        const data = await response.json();
        return data.peaks;
    } catch (error) {
        console.error('Error fetching peaks:', error);
        return [];
    }
};

const MapUpdater = ({ setPeaks }: { setPeaks: (peaks: Peak[]) => void }) => {
    const map = useMap();

    useEffect(() => {
        const updatePeaks = async () => {
            const bounds = map.getBounds();
            const boundsParams = {
                lat1: bounds.getSouthWest().lat,
                lon1: bounds.getSouthWest().lng,
                lat2: bounds.getNorthEast().lat,
                lon2: bounds.getNorthEast().lng
            };

            if (map.getZoom() >= 10) {
                const newPeaks = await fetchPeaks(boundsParams);
                setPeaks(newPeaks);
            } else {
                setPeaks([])
            }
        };

        map.on('moveend', updatePeaks);
        updatePeaks();

        return () => {
            map.off('moveend', updatePeaks);
        };
    }, [map, setPeaks]);

    return null;
};

const MountainTrailsMap = () => {
    const [peaks, setPeaks] = useState<Peak[]>([]);

    const peakMarker = new Icon({
        iconUrl: icon,
        iconSize: [38, 38]
    });

    return (
        
        <MapContainer 
        center={[50.0044, 20.5910]} 
        zoom={13} 
        zoomSnap={0.1}
        zoomDelta={0.1}
        style={{ height: '50vh', width: '40vw' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <MapUpdater setPeaks={setPeaks} />

            {peaks.map((peak) => (
                <Marker
                    key={peak.id}
                    position={[peak.lat, peak.lon]}
                    icon={peakMarker}
                >
                    <Popup>
                        <b>{peak.tags.name}</b>
                        <br />
                        Wysokość: {peak.tags.ele} m n.p.m.
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
        
    );
};

export default MountainTrailsMap;
