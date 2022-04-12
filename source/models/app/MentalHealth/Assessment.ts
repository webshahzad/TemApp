//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

export interface Assessment {
  readonly userAssessmentId: string
  readonly name: string
  readonly description: string
  readonly questions: AssessmentQuestion[]
  readonly answers: UserAssessmentAnswer[]
}

export interface AssessmentQuestion {
  readonly text: string
  readonly options: string[]
}

export interface UserAssessmentAnswer {
  readonly questionIndex: number
  readonly answerIndex: number
}
