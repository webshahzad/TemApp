//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { cached, monitor, Reentrance, reentrance, ObservableObject, transaction, reaction } from 'reactronic'
import { Api, ApiData } from '../Api'
import { Monitors } from '../Monitors'
import { Assessment } from './Assessment'
import { Exercise } from './Exercise'
import { MentalPlatformProgressStatus as Status } from './MentalPlatformProgressStatus'

export class MentalHealth extends ObservableObject {
  assessment?: Assessment = undefined
  exercises: Exercise[] = []
  additionalExercises: Exercise[] = []

  answeredQuestions: AnsweredQuestion[] = []

  status: Status = Status.NotStarted
  assessmentNotificationDisabled: boolean = false
  shouldNotify(): boolean { return !this.assessmentNotificationDisabled && this.status !== Status.ExercisesAvailable }

  private static firstAssessmentStatuses = [Status.NotStarted, Status.FirstAssessmentAvailable, Status.FirstAssessmentInProgress, Status.FirstAssessmentTimedOut]
  shouldOpenAssessmentDirectly(): boolean { return MentalHealth.firstAssessmentStatuses.includes(this.status) }

  hasAllAnswers(): boolean { return this.answeredQuestions.every(x => x.answerIndex !== undefined) }

  shouldShowAdditionalExercises(): boolean { return this.additionalExercises?.length !== 0 }

  @reaction
  protected async initStatus(): Promise<void> {
    if (!Api.isAuthenticated()) return
    const response = await Api.call<
      ApiData<{ status: Status, assessmentNotificationDisabled: boolean }>>(
        'GET', 'mental-health/status')
    this.status = response.data.status
    this.assessmentNotificationDisabled = !!response.data.assessmentNotificationDisabled
  }

  @transaction
  @reentrance(Reentrance.OverwritePrevious)
  async refresh(): Promise<void> {
    const response = await Api.call<ApiData<{
      assessment: Assessment,
      exercises: Exercise[],
      additionalExercises: Exercise[],
      status: Status,
      assessmentNotificationDisabled: boolean,
    }>>('POST', 'mental-health/session')
    this.assessment = response.data.assessment
    this.exercises = response.data.exercises
    this.additionalExercises = response.data.additionalExercises
    this.status = response.data.status
    this.assessmentNotificationDisabled = !!response.data.assessmentNotificationDisabled
  }

  @reaction
  protected initAnsweredQuestions(): void {
    if (!this.assessment) return
    this.answeredQuestions = []
    for (let i = 0; i < this.assessment.answers.length; i++) {
      const answer = this.assessment.answers[i]
      this.answeredQuestions[answer.questionIndex] = new AnsweredQuestion(answer.answerIndex)
    }
    for (let i = 0; i < this.assessment.questions.length; i++) {
      if (!(this.answeredQuestions[i] as AnsweredQuestion | undefined)) {
        this.answeredQuestions[i] = new AnsweredQuestion()
      }
    }
  }

  @cached
  getAllExercises(): Exercise[] {
    const result: Exercise[] = []
    for (let i = 0; i < this.exercises.length; i++)
      result.push(this.exercises[i])
    for (let j = 0; j < this.additionalExercises.length; j++)
      result.push(this.additionalExercises[j])
    return result
  }

  @transaction
  @monitor(Monitors.Loading)
  async submitAssessment(): Promise<void> {
    if (!this.assessment) return
    await Api.call('POST', `mental-health/assessment/${this.assessment.userAssessmentId}/complete`)
    this.status = Status.ExercisesAvailable
  }

  @transaction
  async completeExercise(ex: Exercise, text?: string): Promise<void> {
    const response = await Api.call('POST', `/mental-health/exercise/${ex._id}/complete`, { text })
    await this.refresh()
  }

  @transaction
  async selectAnswer(questionIndex: number, answerIndex: number): Promise<void> {
    if (!this.assessment) return
    await Api.call('POST', `mental-health/assessment/${this.assessment.userAssessmentId}/progress`, {
      questionIndex,
      answerIndex,
    })
    this.answeredQuestions[questionIndex].answerIndex = answerIndex
  }

  @transaction
  async setAssessmentNotificationsEnabled(enable: boolean): Promise<void> {
    await Api.call('POST', `mental-health/notifications/assessment/${enable ? 'enable' : 'disable'}`)
    this.assessmentNotificationDisabled = !enable
  }

  @cached
  getNotDoneExerciseIndex(): number {
    let index = this.exercises.findIndex(x => !x.doneBefore)
    if (index < 0) {
      index = this.additionalExercises.findIndex(x => !x.doneBefore)
      if (index >= 0)
        index += this.exercises.length
    }
    return index
  }
}

export class AnsweredQuestion extends ObservableObject {
  constructor(
    public answerIndex: number | undefined = undefined
  ) {
    super()
  }
}
