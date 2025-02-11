import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Peak } from '@/models/Peak';
import { Saddle } from '@/models/Saddle';
import { Icon } from 'leaflet';
import { Input, Checkbox, Collapse, List, Typography, Card } from 'antd';
import icon from '@/assets/mountain-marker.png';

const { Panel } = Collapse;
const { Search } = Input;

const fetchData = async (url: string) => {
    try {
        const response = await fetch(url);
        const result = await response.json();        
        return result.data || [];
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
                const newPeaks = await fetchData(`/api/peaks?${boundsParams}`);
                setPeaks(newPeaks);

                if (showSaddles) {
                    const newSaddles = await fetchData(`/api/saddles?${boundsParams}`);
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

    const handleSearchChange = async (value: string) => {
        setSearchTerm(value);

        if (value) {      
            const encoded = encodeURIComponent(value);                  
            const searchPeaks = await fetchData(`/api/peaks?search=${encoded}`);            
            setFilteredPeaks(searchPeaks);
        } else {
            setFilteredPeaks([]);
        }
    };

    const handleSearch = async (value: string) => {
        setSearchTerm(value);
    
        if (value) {
            const encoded = encodeURIComponent(value);                  
            const searchPeaks = await fetchData(`/api/peaks?search=${encoded}`);            
            
            if (searchPeaks.length > 0) {
                const peak = searchPeaks[0];
                const map = (document.querySelector('.leaflet-container') as any)?.__leaflet__;
                if (map) {
                    map.setView([peak.lat, peak.lon], map.getZoom());
                }
            }
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
                <MapContainer center={[50.0044, 20.5910]} zoom={13} zoomSnap={0.5} zoomDelta={0.5} style={{ height: '100%', width: 'auto'}}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
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
                        
            <Card style={{ width: 320, padding: '10px', backgroundColor: '#f9f9f9', boxShadow: '2px 2px 10px rgba(0,0,0,0.1)' }}>
                <Typography.Title level={5}>Wyszukaj szczyt</Typography.Title>
                
                <Search
                    placeholder="Wpisz nazwę szczytu"
                    allowClear
                    onSearch={handleSearch}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    value={searchTerm}
                    style={{ marginBottom: '10px' }}
                />

                <Collapse>
                    <Panel header="Opcje" key="1">
                        <Checkbox checked={showSaddles} onChange={(e) => setShowSaddles(e.target.checked)}>
                            Przełęcze
                        </Checkbox>
                    </Panel>
                </Collapse>

                {filteredPeaks.length > 0 && (
                    <List
                        size="small"
                        bordered
                        style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: 'white' }}
                        dataSource={filteredPeaks}
                        renderItem={(peak) => (
                            <List.Item onClick={() => handleSuggestionClick(peak)} style={{ cursor: 'pointer' }}>
                                {peak.tags.name} ({peak.tags.ele})
                            </List.Item>
                        )}
                    />
                )}
            </Card>
        </div>
    );
};

export default MountainTrailsMap;
