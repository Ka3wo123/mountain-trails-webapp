import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User } from '@/models/User';
import { PeakDto } from '@/models/PeakDto';
import '@/styles/user-profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faMountain,
  faChevronDown,
  faChevronUp,
  faExpand,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ListGroup, Collapse, Button, Modal, Carousel, Dropdown } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '@/utils/axiosInstance';
import {  
  ALERT_MESSAGES,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from '@/constants';
import { useAuth } from '@/context/authContext';

const UserProfile = () => {
  const { nick } = useParams<{ nick: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [peaks, setPeaks] = useState<PeakDto[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [totalSystemPeaks, setTotalSystemPeaks] = useState<number>(0);
  const [openPeakId, setOpenPeakId] = useState<string | null>(null);
  const [images, setImages] = useState<{
    [peakId: string]: { url: string; publicId: string }[];
  }>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedPeakId, setSelectedPeakId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const limit = 10;
  const cloudinaryFolderName = import.meta.env.VITE_CLOUDINARY_FOLDER_NAME;
  const { isAuthenticated } = useAuth();

  const fetchUserProfile = async () => {
    try {
      await axiosInstance.get(API_ENDPOINTS.USERS.ONE(nick!)).then((response) => {
        setUser(response.data.data);

        const imagesData: {
          [peakId: string]: { url: string; publicId: string }[];
        } = {};
        response.data.data.peaksAchieved.forEach((peak: any) => {
          const peakImages = peak.imgData || [];
          imagesData[peak.peakId] = peakImages;
        });
        setImages(imagesData);
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserPeaks = async () => {
    try {
      const peaksResponse = await axiosInstance.get(API_ENDPOINTS.USERS.PEAK_FOR(nick!), {
        params: { page, limit },
      });
      setPeaks(peaksResponse.data.data);
      setTotalPages(peaksResponse.data.totalPages);
      setTotalSystemPeaks(peaksResponse.data.totalSystemPeaks);
    } catch (error) {
      console.error('Error fetching user peaks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
  }, [nick]);

  useEffect(() => {
    fetchUserPeaks();
    fetchUserProfile();
  }, [page, nick]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const togglePeak = (peakId: string) => {
    if (openPeakId === peakId) {
      setOpenPeakId(null);
      setSelectedFile(null);
    } else {
      setOpenPeakId(peakId);
      setSelectedFile(null);
    }
  };

  const openImageModal = (peakId: string) => {
    setSelectedPeakId(peakId);
    setSelectedImageIndex(0);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleFilePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async (peakId: string) => {
    const file = selectedFile;
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('nick', nick!);
    formData.append('peakId', peakId);
    formData.append('folder', cloudinaryFolderName);

    try {
      await axiosInstance.post(API_ENDPOINTS.PHOTOS.UPLOAD, formData);
      await fetchUserProfile();
      setSelectedFile(null);
      toast.success(SUCCESS_MESSAGES.PHOTO_UPLOADED);
    } catch (error: any) {
      switch (error.status) {
        case HTTP_STATUS.BAD_REQUEST:
          toast.error(ERROR_MESSAGES.FILE_OVERSIZE);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (peakId: string, publicId: string) => {
    if (!publicId) {
      console.error('Invalid publicId');
      return;
    }

    try {
      setIsDeleting(true);
      const response = await axiosInstance.delete(API_ENDPOINTS.PHOTOS.DELETE, {
        data: { nick, peakId, publicId },
      });

      if (response.status !== 200) {
        return toast.error(ERROR_MESSAGES.SERVER_ERROR);
      }

      setImages((prevImages) => ({
        ...prevImages,
        [peakId]: prevImages[peakId].filter((imgData) => !imgData.url.includes(publicId)),
      }));

      toast.success(SUCCESS_MESSAGES.PHOTO_DELETED);
      setShowModal(false);      
      await fetchUserProfile();

    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeletePeak = async (peakId: string) => {
    const isConfirmed = window.confirm(ALERT_MESSAGES.PEAK_DELETE);
    if (!isConfirmed) return;
    try {
      await axiosInstance.delete(API_ENDPOINTS.USERS.PEAK_FOR(nick!), {
        data: {
          peakId: peakId,
        },
      });
      toast.success(SUCCESS_MESSAGES.PEAK_DELETED);
      await fetchUserProfile();
      await fetchUserPeaks();
    } catch (error) {
      toast.error(ERROR_MESSAGES.SERVER_ERROR);
    }
  };

  return (
    <div className="user-profile">
      <h1>
        <em>{user?.nick}</em>
        <br />
        {user?.name} {user?.surname}
      </h1>
      <div>
        <p>
          <strong>Zdobyte szczyty:</strong> {user?.peaksAchieved?.length ?? 0} / {totalSystemPeaks}
        </p>
        <progress value={(user?.peaksAchieved?.length ?? 0) / totalSystemPeaks}></progress>
      </div>

      <h3>Lista zdobytych szczytów</h3>
      {peaks.length > 0 ? (
        <div>
          <ListGroup>
            {peaks.map((peak: PeakDto) => (
              <ListGroup.Item key={peak.peakId} className="expandable-item">
                <div className="item-header" onClick={() => togglePeak(peak.peakId)}>
                  <FontAwesomeIcon icon={faMountain} />
                  {peak.name} - {peak.ele} m n.p.m.
                  <FontAwesomeIcon
                    icon={openPeakId === peak.peakId ? faChevronUp : faChevronDown}
                    className="chevron"
                  />
                </div>
                <Collapse in={openPeakId === peak.peakId}>
                  <div>
                    <div className="item-details">
                      {images[peak.peakId] && images[peak.peakId].length > 0 ? (
                        <div className="peak-images-container">
                          {images[peak.peakId].slice(0, 3).map((imgData, index) => (
                            <img
                              key={index}
                              src={imgData.url}
                              alt={`${peak.name} - image ${index + 1}`}
                              className="peak-image"
                              onClick={() => openImageModal(peak.peakId)}
                              style={{
                                cursor: 'pointer',
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <p>Brak zdjęć</p>
                      )}
                      {isAuthenticated ? (
                        <>
                          <input
                            type="file"
                            onChange={(e) => {
                              handleFilePick(e);
                            }}
                          />
                          {selectedFile && (
                            <Button onClick={() => handleUpload(openPeakId!)}>Prześlij</Button>
                          )}
                        </>
                      ) : (
                        <p>Zaloguj się, aby dodać zdjęcia.</p>
                      )}
                      <hr />
                      <div className="settings">
                        <Button
                          variant="outline-danger"
                          onClick={() => handleDeletePeak(peak.peakId)}
                        >
                          Usuń ze zdobytych
                        </Button>
                      </div>
                    </div>
                  </div>
                </Collapse>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <div className="pagination">
            <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            <span>
              {page} z {totalPages}
            </span>
            <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </div>
        </div>
      ) : (
        <p>Brak zdobytych szczytów.</p>
      )}

      {loading && <LoadingSpinner label="Pobieranie zdobytych szczytów" />}
      {isUploading && <LoadingSpinner label="Przesyłanie zdjęcia" />}
      {isDeleting && <LoadingSpinner label="Usuwanie zdjęcia" />}

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Body>
          <Carousel
            fade={false}
            activeIndex={selectedImageIndex}
            onSelect={(index: number) => setSelectedImageIndex(index)}
          >
            {selectedPeakId &&
              images[selectedPeakId].map((imgData, index: number) => {
                return (
                  <Carousel.Item key={imgData.publicId}>
                    <div className="image-options">
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="light"
                          id="dropdown-basic"
                          style={{ background: 'none' }}
                        />
                        <Dropdown.Menu>
                          {isAuthenticated && (
                            <Dropdown.Item
                              onClick={() => handleDeleteImage(selectedPeakId, imgData.publicId)}
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                style={{
                                  marginRight: '6px',
                                }}
                              />
                              Usuń zdjęcie
                            </Dropdown.Item>
                          )}
                          <Dropdown.Item onClick={() => window.open(imgData.url, '_blank')}>
                            <FontAwesomeIcon
                              icon={faExpand}
                              style={{
                                marginRight: '6px',
                              }}
                            />
                            Zobacz w pełnym oknie
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <img
                      className="peak-gallery-image"
                      src={imgData.url}
                      alt={`Peak Image ${index + 1}`}
                    />
                  </Carousel.Item>
                );
              })}
          </Carousel>
        </Modal.Body>
      </Modal>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default UserProfile;
