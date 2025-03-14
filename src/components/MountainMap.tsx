import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Peak } from '@/models/Peak';
import { Saddle } from '@/models/Saddle';
import { Icon } from 'leaflet';
import peakMarker from '@/assets/mountain-marker.png';
import saddleMarker from '@/assets/saddle-marker.png';
import { Button, Offcanvas, Form, ListGroup, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faWarning, faX } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/context/authContext';
import { toast, Toaster } from 'react-hot-toast';
import { getNickname } from '@/utils/jwtDecoder';
import '@/styles/map.css';
import { useDebounce } from '@/utils/hooks';
import L from 'leaflet';
import axiosInstance from '@/utils/axiosInstance';
import { API_ENDPOINTS, ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from '@/constants';

const MAX_ZOOM = 13;

const MapUpdater = ({
  setPeaks,
  setSaddles,
  showSaddles,
}: {
  setPeaks: (peaks: Peak[]) => void;
  setSaddles: (saddles: Saddle[]) => void;
  showSaddles: boolean;
}) => {
  const map = useMap();

  useEffect(() => {
    const updateData = async () => {
      const bounds = map.getBounds();
      const boundsParams = `lat1=${bounds.getSouthWest().lat}&lon1=${bounds.getSouthWest().lng}&lat2=${bounds.getNorthEast().lat}&lon2=${bounds.getNorthEast().lng}`;

      if (map.getZoom() >= MAX_ZOOM) {
        await axiosInstance.get(API_ENDPOINTS.PEAKS.WITH_BOUNDS(boundsParams)).then((response) => {
          setPeaks(response.data.data);
        });

        if (showSaddles) {
          await axiosInstance
            .get(API_ENDPOINTS.SADDLES.WITH_BOUNDS(boundsParams))
            .then((response) => setSaddles(response.data));
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
  const [showMenu, setShowMenu] = useState(false);
  const [nick, setNick] = useState<string | undefined>(undefined);
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState<number>(1);
  const [totalDocuments, setTotalDocuments] = useState<number>(0);
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<{ [key: string]: L.Marker | null }>({});
  const peakIcon = new Icon({
    iconUrl: peakMarker,
    iconSize: [30, 30],
  });

  const saddleIcon = new Icon({
    iconUrl: saddleMarker,
    iconSize: [30, 30],
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setNick(getNickname());
  }, []);

  useEffect(() => {
    const getFilteredData = async () => {
      if (debouncedSearchTerm) {
        const filteredData = await axiosInstance.get(
          API_ENDPOINTS.PEAKS.SEARCH_PAGINATION(debouncedSearchTerm, page)
        );
        if (page === 1) {
          setFilteredPeaks(filteredData.data.data);
        } else {
          setFilteredPeaks((prev) => [...prev, ...filteredData.data.data]);
        }
        setTotalDocuments(filteredData.data.total);
      } else {
        setFilteredPeaks([]);
        setPage(1);
      }
    };
    getFilteredData();
  }, [debouncedSearchTerm, page]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleSuggestionClick = (peak: Peak) => {
    setShowMenu(false);

    const map = mapRef.current;
    if (map) {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          layer.closePopup();
        }
      });
      map.setView([peak.lat, peak.lon], 15);
    }
    setTimeout(() => {
      const marker = markerRefs.current[peak.id];
      if (marker) {
        marker.openPopup();
      }
    }, 900);

    setSearchTerm(peak.tags.name);
    setFilteredPeaks([]);
  };

  const handleAddPeak = async (peakId: string) => {
    try {
      if (nick) {
        await axiosInstance.post(API_ENDPOINTS.USERS.PEAK_FOR(nick), { peakId });
        toast.success(SUCCESS_MESSAGES.PEAK_ADDED);
      }
    } catch (error: any) {
      switch (error.status) {
        case HTTP_STATUS.CONFLICT:
          toast(ERROR_MESSAGES.PEAK_ACHIEVED, {
            icon: <FontAwesomeIcon icon={faWarning} color="#ebc500" />,
          });
          break;
        case HTTP_STATUS.UNAUTHORIZED:
          toast.error(ERROR_MESSAGES.UNAUTHORIZED);
          break;
        default:
          toast.error(ERROR_MESSAGES.SERVER_ERROR);
      }
    }
  };

  const loadMore = () => {
    setPage(page + 1);
  };

  function handleClear() {
    setSearchTerm('');
  }

  return (
    <div className="map-container">
      <MapContainer center={[50.0044, 20.591]} zoom={13} className="map" ref={mapRef}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <MapUpdater setPeaks={setPeaks} setSaddles={setSaddles} showSaddles={showSaddles} />

        {peaks &&
          peaks.map((peak) => (
            <Marker
              key={peak.id}
              position={[peak.lat, peak.lon]}
              icon={peakIcon}
              ref={(e) => {
                markerRefs.current[peak.id] = e;
              }}
            >
              <Popup>
                <b>{peak.tags.name}</b>
                <br />
                Wysokość: {peak.tags.ele} m n.p.m.
                <br />
                <small>
                  {peak.lat.toFixed(5)}, {peak.lon.toFixed(5)}
                </small>
                {isAuthenticated && (
                  <div className="mt-2 sm">
                    <Button className="success" onClick={() => handleAddPeak(peak._id)}>
                      Dodaj do zdobytych
                    </Button>
                  </div>
                )}
              </Popup>
            </Marker>
          ))}
        {showSaddles &&
          saddles.map((saddle) => (
            <Marker key={saddle.id} position={[saddle.lat, saddle.lon]} icon={saddleIcon}>
              <Popup>
                <b>{saddle.tags.name}</b>
                <br />
                Wysokość: {saddle.tags.ele} m n.p.m.
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
          zIndex: 500,
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
          maxWidth: '400px',
        }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Wyszukaj szczyt</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Wpisz nazwę szczytu"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <Button className="danger ms-1" onClick={handleClear}>
                <FontAwesomeIcon icon={faX} />
              </Button>
            )}
          </InputGroup>

          {filteredPeaks.length > 0 && (
            <ListGroup>
              {filteredPeaks.map((peak) => (
                <ListGroup.Item
                  key={peak.id}
                  onClick={() => handleSuggestionClick(peak)}
                  className="list-item"
                >
                  {peak.tags.name} ({peak.tags.ele} m n.p.m.)
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          {filteredPeaks.length < totalDocuments && debouncedSearchTerm && (
            <Button onClick={loadMore}>
              Załaduj więcej ({totalDocuments - 10 * page} szczytów)
            </Button>
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
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default MountainTrailsMap;
