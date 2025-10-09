import { use } from "react";

export default function CreateProblemPage({ params }: { params: Promise<{ roomCode: string }> })  {
    const { roomCode } = use(params)

    return (
        <div>
            <h1>Create Problem for Room: {roomCode}</h1>
            {/* Add your form or problem creation logic here */}
        </div>
    );
};  