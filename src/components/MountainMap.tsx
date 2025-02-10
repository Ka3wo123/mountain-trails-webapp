import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Peak } from '../models/Peak';
import { Saddle } from '../models/Saddle';
import icon from '../assets/mountain-marker.png';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { Accordion, TextField, Checkbox, FormControlLabel, List, ListItem, ListItemText } from '@mui/material';

const fetchData = async (url: string) => {
    try {
        const response = await fetch(url);
        const result = await response.json();
        return result.peaks || result.saddles || [];
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return [];
    }
};

const MapUpdater = ({ setPeaks, setSaddles, showSaddles }: {
    setPeaks: (peaks: Peak[]) => void;
    setSaddles: (saddles: Saddle[]) => void;
    showSaddles: boolean;
}) => {
    const map = useMap();

    useEffect(() => {
        const updateData = async () => {
            const bounds = map.getBounds();
            const boundsParams = `lat1=${bounds.getSouthWest().lat}&lon1=${bounds.getSouthWest().lng}&lat2=${bounds.getNorthEast().lat}&lon2=${bounds.getNorthEast().lng}`;

            if (map.getZoom() >= 10) {
                const newPeaks = await fetchData(`http://localhost:5000/peaks?${boundsParams}`);
                setPeaks(newPeaks);

                if (showSaddles) {
                    const newSaddles = await fetchData(`http://localhost:5000/saddles?${boundsParams}`);
                    setSaddles(newSaddles);
                }
            } else {
                setPeaks([]);
                setSaddles([]);
            }
        };

        map.on('moveend', updateData);
        updateData();

        return () => {
            map.off('moveend', updateData);
        };
    }, [map, setPeaks, setSaddles, showSaddles]);

    return null;
};

const MountainTrailsMap = () => {
    const [peaks, setPeaks] = useState<Peak[]>([]);
    const [saddles, setSaddles] = useState<Saddle[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSaddles, setShowSaddles] = useState(false);
    const [filteredPeaks, setFilteredPeaks] = useState<Peak[]>([]);

    const peakMarker = new Icon({
        iconUrl: icon,
        iconSize: [38, 38]
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value) {            
            const regex = new RegExp(value, 'i');
            const matchedPeaks = peaks.filter(peak => regex.test(peak.tags.name));
            setFilteredPeaks(matchedPeaks);
        } else {
            setFilteredPeaks([]);
        }
    };

    const handleSuggestionClick = (peak: Peak) => {
        const map = (document.querySelector('.leaflet-container') as any)?.__leaflet__;
        if (map) {
            map.setView([peak.lat, peak.lon], map.getZoom());
        }
        setSearchTerm(peak.tags.name);
        setFilteredPeaks([]);
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>            
            <div style={{ flex: 1 }}>
                <MapContainer center={[50.0044, 20.5910]} zoom={13} zoomSnap={0.1} zoomDelta={0.1} style={{ height: '100%', width: 'auto' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                    <MapUpdater setPeaks={setPeaks} setSaddles={setSaddles} showSaddles={showSaddles} />

                    {peaks.map((peak) => (
                        <Marker key={peak.id} position={[peak.lat, peak.lon]} icon={peakMarker}>
                            <Popup>
                                <b>{peak.tags.name}</b><br />
                                Wysokość: {peak.tags.ele} m n.p.m.
                            </Popup>
                        </Marker>
                    ))}
                    {showSaddles && saddles.map((saddle) => (
                        <Marker key={saddle.id} position={[saddle.lat, saddle.lon]}>
                            <Popup>
                                <b>{saddle.tags.name}</b><br />
                                Wysokość: {saddle.tags.ele} m n.p.m.
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
            
            <div style={{ width: 'auto', padding: '10px', backgroundColor: '#f4f4f4', overflowY: 'auto' }}>
                <TextField
                    label="Szukaj szczytu"
                    variant="outlined"
                    size="small"
                    style={{ marginBottom: '10px', width: '100%' }}
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <Accordion>
                    <FormControlLabel
                        control={<Checkbox checked={showSaddles} onChange={(e) => setShowSaddles(e.target.checked)} />}
                        label="Przełęcze"
                    />
                </Accordion>

                {filteredPeaks.length > 0 && (
                    <List style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: 'white' }}>
                        {filteredPeaks.map((peak) => (
                            <ListItem key={peak.id} onClick={() => handleSuggestionClick(peak)}>
                                <ListItemText primary={peak.tags.name} />
                            </ListItem>
                        ))}
                    </List>
                )}
            </div>
        </div>
    );
};

export default MountainTrailsMap;
