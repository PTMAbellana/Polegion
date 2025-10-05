export default function LeaderboardPage({ params }: { params: { roomId: number } }) {
    const { roomId } = params;

    return (
        <div>
            <h1>Room: {roomId}</h1>
        </div>
    );
}