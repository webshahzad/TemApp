//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Dimensions } from 'react-native'
import HTML from 'react-native-render-html'

interface FixedHtmlProps extends HTML.ContainerProps {
 }

export function FixedHtml(p: FixedHtmlProps): React.ReactElement {
  const windowWidth = Dimensions.get("window").width;
  const { html, ...props } = p
  return (
    <HTML    
      html={fixSpaces(html)}
      {...props}
     baseFontStyle={{fontSize:12}}
     containerStyle={{width:(windowWidth/100)*70}}
    />
  )
}

// HTML component does not properly handle whitespaces.
// This function fixes spaces between two adjacent tags.
// see issue: https://github.com/archriss/react-native-render-html/issues/118
function fixSpaces(html: string): string {
  const tagWithSpaceMatch = /<([^>]+)>\s+<([^>]+)>/.exec(html)
  if (tagWithSpaceMatch) {
    const tagWithSpace = tagWithSpaceMatch[0]
    const newTagWithSpace = tagWithSpace.replace(/\s/g, '') + ' '
    const newHtml = html.replace(tagWithSpace, newTagWithSpace)
    return fixSpaces(newHtml)
  } else {
    return html
  }
}
