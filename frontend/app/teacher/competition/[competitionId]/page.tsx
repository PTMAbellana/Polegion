import { use } from "react";

export default function TeacherCompetitionPage({ params }: { params: Promise<{ competitionId: number }> }) {

    const { competitionId } = use(params);
    return (
        <div>
            <h1>Teacher Competition Page</h1>
            <p>Competition ID: {competitionId}</p>
        </div>
    );
}   
