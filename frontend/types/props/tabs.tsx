import { CompetitionType, SProblemType, TProblemType } from '@/types'

export interface CompetitionsTabProps {
    competitions: CompetitionType[]
}

export interface TabContainerProps {
    problems: (TProblemType | SProblemType)[]
    competitions: CompetitionType[]
    roomCode: string
}
