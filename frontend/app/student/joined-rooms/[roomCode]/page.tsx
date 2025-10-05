export default function RoomPage({ params: stringifyParams }: { params: { roomCode: string } }) {
    const { roomCode } = stringifyParams;

    return (
        <div>
            <h1>Room: {roomCode}</h1>
        </div>
    );
}
