import { use } from 'react'

export default function RoomPage({ params }: { params: Promise<{ roomCode: string }> }) {
    const { roomCode } = use(params);

    return (
        <div>
            <h1>Room: {roomCode}</h1>
        </div>
    );
}
