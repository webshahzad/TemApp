//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Modal } from 'react-native'
import { ImageViewer as ImageZoomViewer } from 'react-native-image-zoom-viewer'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { ImageViewerManager } from 'models/app/ImageViewerManager'

export function ImageViewer({ manager }: { manager: ImageViewerManager }): JSX.Element {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    manager.configure(setVisible)
  })

  return (
    <Modal visible={visible} transparent animationType='fade'>
      <ImageZoomViewer
        imageUrls={manager.images}
        index={manager.imageIndex}
        onCancel={() => manager.close()}
        enableSwipeDown
        saveToLocalByLongPress={false}
        renderIndicator={manager.images.length == 1 ? () => <></> : undefined}
        renderHeader={() => (
          <Icon
            name='close'
            size={25}
            color='white'
            style={{
              borderRadius: 1000,
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1,
              alignItems: 'center',
            }}
            onPress={() => manager.close()}
          />
        )}
      />
    </Modal>
  )
}
