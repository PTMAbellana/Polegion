import React from 'react';
import { RoomCardProps } from '@/types/common/room';
import styles from '@/styles/dashboard-wow.module.css';

const RoomCard: React.FC<RoomCardProps> = ({ 
  room, 
  onViewRoom, 
  useRoomCode = true, 
  showClickableCard = false,
  showEditButton = false,
  showDeleteButton = false,
  showRoomCode = false,
  onEditRoom,
  onDeleteRoom
}) => {
  const handleCardClick = () => {
    if (showClickableCard) {
      const identifier = useRoomCode ? room.code : room.id;
      if (identifier) {
        onViewRoom(identifier, room.id);
      }
    }
  };

  const handleViewButtonClick = (e: React.MouseEvent) => {
    if (showClickableCard) {
      e.stopPropagation(); // Prevent double action when card is also clickable
    }
    const identifier = useRoomCode ? room.code : room.id;
    if (identifier) {
      onViewRoom(identifier, room.id);
    }
  };

  const handleEditButtonClick = (e: React.MouseEvent) => {
    if (showClickableCard) {
      e.stopPropagation();
    }
    if (onEditRoom) {
      onEditRoom(room);
    }
  };

  const handleDeleteButtonClick = (e: React.MouseEvent) => {
    if (showClickableCard) {
      e.stopPropagation();
    }
    if (onDeleteRoom && room.id) {
      onDeleteRoom(room.id);
    }
  };

  return (
    <div 
      className={`${styles["room-card"]} ${showClickableCard ? styles["clickable-card"] : ''}`}
      onClick={handleCardClick}
      style={{ cursor: showClickableCard ? 'pointer' : 'default' }}
    >
      <div className={styles["room-card-banner"]}>
        {room.banner_image && typeof room.banner_image === 'string' ? (
          <img 
            src={room.banner_image} 
            alt={room.title || 'Room'} 
            className={styles["room-banner-image"]}
          />
        ) : (
          <div className={styles["room-card-banner-placeholder"]}>
            No Image
          </div>
        )}
      </div>
      <div className={styles["room-card-content"]}>
        <h3 className={styles["room-card-title"]}>{room.title || 'Untitled Room'}</h3>
        <p className={styles["room-card-description"]}>
          {room.description || 'No description available'}
        </p>
        <p className={styles["room-card-mantra"]}>
          {room.mantra || 'No mantra'}
        </p>
        {showRoomCode && room.code && (
          <div className={styles["room-code"]}>
            <strong>Room Code: {room.code}</strong>
          </div>
        )}
        <div className={styles["room-card-actions"]}>
          <button
            className={styles["view-btn"]}
            onClick={handleViewButtonClick}
          >
            View
          </button>
          {showEditButton && onEditRoom && (
            <button
              className={styles["edit-btn"]}
              onClick={handleEditButtonClick}
            >
              Edit
            </button>
          )}
          {showDeleteButton && onDeleteRoom && (
            <button
              className={styles["delete-btn"]}
              onClick={handleDeleteButtonClick}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;