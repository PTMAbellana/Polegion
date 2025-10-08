import { use } from 'react'

export default function LeaderboardPage({ params }: { params: Promise<{ roomId: number }> }) {
    const { roomId } = use(params);

    return (
        <div>
            <h1>Room: {roomId}</h1>
        </div>
    );
}