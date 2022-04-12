//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction } from 'reactronic'

export interface IAccordionSection {
  name: string,
  content: JSX.Element
}

export class AccordionManager extends ObservableObject {
  sections: IAccordionSection[]
  expandedSection?: number

  constructor(sections: IAccordionSection[], expandedSection?: number) {
    super()
    this.sections = sections
    this.expandedSection = expandedSection
  }

  @transaction
  expand(section: number): void {
    this.expandedSection = section
  }

  @transaction
  collapse(): void {
    this.expandedSection = undefined
  }

  @transaction
  toggle(section: number): void {
    this.expandedSection = (this.expandedSection === section) ? undefined : section
  }
}
