import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "@/models/User";
import { get } from "@/utils/httpHelper";
import { PeakDto } from "@/models/PeakDto";
import '@/styles/user-profile.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faMountain, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ListGroup, Collapse, Button, Modal, Carousel } from "react-bootstrap";
import axios from "axios";

const UserProfile = () => {
    const { nick } = useParams<{ nick: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [peaks, setPeaks] = useState<PeakDto[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalSystemPeaks, setTotalSystemPeaks] = useState<number>(0);
    const [openPeak, setOpenPeak] = useState<string | null>(null);
    const [images, setImages] = useState<{ [key: string]: string }>({});
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<number>(0);
    const limit = 10;

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userResponse = await get(`/users/${nick}`);
                setUser(userResponse.data.data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };
        fetchUserProfile();
    }, [nick]);

    useEffect(() => {
        const fetchUserPeaks = async () => {
            try {
                const peaksResponse = await get(`/users/${nick}/peaks`, { page, limit });
                setPeaks(peaksResponse.data.data);
                setTotalPages(peaksResponse.data.totalPages);
                setTotalSystemPeaks(peaksResponse.data.totalSystemPeaks);
            } catch (error) {
                console.error("Error fetching user peaks:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserPeaks();
    }, [page, nick]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const imageMap: { [key: string]: string } = {};
                for (const peak of peaks) {
                    const response = await axios.get(`https://placehold.co/600x400/000000/444?text=${peak.name}`, { responseType: 'blob' });
                    const imageUrl = URL.createObjectURL(response.data);
                    imageMap[peak._id] = imageUrl;
                }
                setImages(imageMap);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };
        if (peaks.length > 0) {
            fetchImages();
        }
    }, [peaks]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const togglePeak = (peakId: string) => {
        setOpenPeak(openPeak === peakId ? null : peakId);
    };

    const openImageModal = (index: number) => {
        setSelectedImage(index);
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    return (
        <div className="user-profile">
            <h1>
                <em>{user?.nick}</em><br />
                {user?.name} {user?.surname}
            </h1>
            <div>
                <p><strong>Zdobyte szczyty:</strong> {user?.peaksAchieved?.length ?? 0} / {totalSystemPeaks}</p>
                <progress value={(user?.peaksAchieved?.length ?? 0) / totalSystemPeaks}></progress>
            </div>

            <h3>Lista zdobytych szczytów</h3>
            {loading ? (
                <LoadingSpinner />
            ) : (
                peaks.length > 0 ? (
                    <div>
                        <ListGroup>
                            {peaks.map((peak: PeakDto, index) => (
                                <ListGroup.Item key={peak._id} className="expandable-item">
                                    <div className="item-header" onClick={() => togglePeak(peak._id)}>
                                        <FontAwesomeIcon icon={faMountain} />
                                        {peak.name} - {peak.ele} m n.p.m.
                                        <FontAwesomeIcon icon={openPeak === peak._id ? faChevronUp : faChevronDown} className="chevron" />
                                    </div>
                                    <Collapse in={openPeak === peak._id}>
                                        <div className="item-details">
                                            <img 
                                                src={images[peak._id]} 
                                                alt={peak.name} 
                                                className="peak-image" 
                                                onClick={() => openImageModal(index)}
                                                style={{ cursor: 'pointer' }}
                                            />                                            
                                        </div>
                                    </Collapse>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>

                        <div className="pagination">
                            <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </Button>
                            <span>{page} of {totalPages}</span>
                            <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p>Brak zdobytych szczytów.</p>
                )
            )}
            
            <Modal show={showModal} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Zdjęcia szczytów</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Carousel activeIndex={selectedImage} onSelect={setSelectedImage} interval={3000}>
                        {peaks.map((peak) => (
                            <Carousel.Item key={peak._id}>
                                <img
                                    className="d-block w-100"
                                    src={images[peak._id]}
                                    alt={peak.name}
                                />
                                <Carousel.Caption>
                                    <h5>{peak.name}</h5>
                                </Carousel.Caption>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Zamknij
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default UserProfile;
