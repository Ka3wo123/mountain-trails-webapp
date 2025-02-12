import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Peak } from '@/models/Peak';
import { Saddle } from '@/models/Saddle';
import { Icon } from 'leaflet';
import icon from '@/assets/mountain-marker.png';
import { Button, Offcanvas, Form, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { get } from '@/utils/httpHelper';
import { useAuth } from '@/context/authContext';

const MAX_ZOOM = 13;

const MapUpdater = ({ setPeaks, setSaddles, showSaddles }:
    {
        setPeaks: (peaks: Peak[]) => void;
        setSaddles: (saddles: Saddle[]) => void;
        showSaddles: boolean
    }) => {

    const map = useMap();

    useEffect(() => {
        const updateData = async () => {
            const bounds = map.getBounds();
            const boundsParams = `lat1=${bounds.getSouthWest().lat}&lon1=${bounds.getSouthWest().lng}&lat2=${bounds.getNorthEast().lat}&lon2=${bounds.getNorthEast().lng}`;

            if (map.getZoom() >= MAX_ZOOM) {
                const peaksData = await get(`/peaks?${boundsParams}`);

                setPeaks(peaksData.data);

                if (showSaddles) {
                    const saddlesData = await get(`/saddles?${boundsParams}`);
                    setSaddles(saddlesData.data);
                }
            } else {
                setPeaks([]);
                setSaddles([]);
            }
        };

        map.on('moveend', updateData);
        updateData();

        return () => {
            map.off('moveend', updateData)
        };
    }, [map, setPeaks, setSaddles, showSaddles]);

    return null;
};

const MountainTrailsMap = () => {
    const [peaks, setPeaks] = useState<Peak[]>([]);
    const [_, setSaddles] = useState<Saddle[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSaddles, setShowSaddles] = useState(false);
    const [filteredPeaks, setFilteredPeaks] = useState<Peak[]>([]);
    const [showMenu, setShowMenu] = useState(false);
    const { isAuthenticated } = useAuth();

    const peakMarker = new Icon({
        iconUrl: icon,
        iconSize: [30, 30]
    });

    const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value) {
            const filteredData = await get(`/peaks?search=${encodeURIComponent(value)}`);
            setFilteredPeaks(filteredData.data);
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
            <MapContainer center={[50.0044, 20.5910]} zoom={13} style={{ flex: 1 }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                <MapUpdater setPeaks={setPeaks} setSaddles={setSaddles} showSaddles={showSaddles} />

                {peaks.map((peak) => (
                    <Marker key={peak.id} position={[peak.lat, peak.lon]} icon={peakMarker} >
                        <Popup>
                            <b>{peak.tags.name}</b><br />
                            Wysokość: {peak.tags.ele} m n.p.m.<br />
                            <small>Koordynaty: {peak.lat.toFixed(5)}, {peak.lon.toFixed(5)}</small>
                            {isAuthenticated &&
                                <div className="mt-2">
                                    <Button>
                                        Dodaj do zdobytych
                                    </Button>
                                </div>}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <Button
                variant="primary"
                style={{
                    position: 'relative',
                    right: 20,
                    top: 20,
                    zIndex: 1000,
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onClick={() => setShowMenu(true)}
            >
                <FontAwesomeIcon icon={faArrowLeft} />
            </Button>

            <Offcanvas
                show={showMenu}
                onHide={() => setShowMenu(false)}
                placement="end"
                scroll={true}
                backdrop={false}
                style={{
                    height: '100vh',
                    width: window.innerWidth > 768 ? '30%' : '100vw',
                    maxWidth: '400px'
                }}
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Wyszukaj szczyt</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form.Control
                        type="text"
                        placeholder="Wpisz nazwę szczytu"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="mb-3"
                    />
                    {filteredPeaks.length > 0 && (
                        <ListGroup>
                            {filteredPeaks.map((peak) => (
                                <ListGroup.Item key={peak.id} action onClick={() => handleSuggestionClick(peak)}>
                                    {peak.tags.name} ({peak.tags.ele} m)
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                    <Form.Check
                        type="checkbox"
                        label="Pokaż przełęcze"
                        checked={showSaddles}
                        onChange={(e) => setShowSaddles(e.target.checked)}
                        className="mt-3"
                    />
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default MountainTrailsMap;
