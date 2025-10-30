import { use } from "react";

export default function CompetitionPage({ params }: { params: Promise<{ competitionId: number }> }) {
    const { competitionId } = use(params);
    return (
        <div>
            <h1>Competition Page</h1>
            <p>Competition ID: {competitionId}</p>
        </div>
    );
}