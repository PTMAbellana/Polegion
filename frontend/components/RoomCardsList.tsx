import React from 'react';
import RoomCard from './RoomCard';
import Loader from './Loader';
import styles from '@/styles/dashboard-wow.module.css';
import { RoomCardsListProps } from '@/types';

const RoomCardsList: React.FC<RoomCardsListProps> = ({
  title,
  rooms,
  onViewRoom,
  useRoomCode = true,
  showClickableCard = false,
  showEditButton = false,
  showDeleteButton = false,
  showRoomCode = false,
  onEditRoom,
  onDeleteRoom,
  emptyMessage = "No rooms found.",
  isLoading = false,
  className = "",
  viewButtonText = "View",
  deleteButtonText = "Delete"
}) => {
  if (isLoading) {
    return (
      <div className={`${styles["room-cards-section"]} ${className}`}>
        {title && <h2>{title}</h2>}
        <div className={styles["loading-indicator"]}>
          <Loader />
        </div>
      </div>
    );
  }

  const isEmpty = !rooms || rooms.length === 0;
  const sectionClass = isEmpty 
    ? `${styles["room-cards-section"]} ${styles["room-cards-section-empty"]} ${className}`
    : `${styles["room-cards-section"]} ${className}`;

  return (
    <div className={sectionClass}>
      {title && <h2>{title}</h2>}
      <div className={styles["room-cards"]}>
        {rooms && rooms.length > 0 ? (
          rooms.map((room, index) => (
            <RoomCard
              key={room.id || index}
              room={room}
              onViewRoom={onViewRoom}
              useRoomCode={useRoomCode}
              showClickableCard={showClickableCard}
              showEditButton={showEditButton}
              showDeleteButton={showDeleteButton}
              showRoomCode={showRoomCode}
              onEditRoom={onEditRoom}
              onDeleteRoom={onDeleteRoom}
              viewButtonText={viewButtonText}
              deleteButtonText={deleteButtonText}
            />
          ))
        ) : (
          <div className={styles["no-data"]}>
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCardsList;