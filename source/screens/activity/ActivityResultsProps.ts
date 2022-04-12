//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ActivitySummary } from 'models/data/Activity'

export interface ActivityResultsProps {
  summary: ActivitySummary
  showNewButton?: boolean
  showHomeButton?: boolean
}
