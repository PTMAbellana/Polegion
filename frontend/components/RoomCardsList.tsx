import React from 'react';
import { RoomCardsListProps } from '@/types/common/room';
import RoomCard from './RoomCard';
import Loader from './Loader';
import styles from '@/styles/dashboard-wow.module.css';

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
  className = ""
}) => {
  if (isLoading) {
    return (
      <div className={`${styles["room-cards-section"]} ${className}`}>
        <h2>{title}</h2>
        <div className={styles["loading-indicator"]}>
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles["room-cards-section"]} ${className}`}>
      <h2>{title}</h2>
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