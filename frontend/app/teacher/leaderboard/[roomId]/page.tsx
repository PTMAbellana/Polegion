export default function RecordPage({ params }: { params: { roomId: number } }) {
    const { roomId } = params;

    return (
        <div>
            <h1>Room: {roomId}</h1>
        </div>
    );
}