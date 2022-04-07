# react-native-auto-dimensions-image

This component can adjust the dimensions according to the given height or width. Both dimensions can be set for any local or server image

## Installation
`npm i react-native-auto-dimensions-image`

## Usage

```
import React, {Component} from 'react';
import {View} from 'react-native';

import AutoDimensionImage, {imageDimensionTypes} from 'react-native-auto-dimensions-image';

export default class Test extends Component {
  render() {
    return (
      <View>
        <AutoDimensionImage
          uri="https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d37?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Ym13JTIwY2FyfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
          dimensionType={imageDimensionTypes.WIDTH}
          dimensionValue={300}
          otherDimensionMaxValue={200}
          style={{ alignSelf: 'center' }}
        />

        <AutoDimensionImage
          dimensionType={imageDimensionTypes.HEIGHT}
          localSource={require('../image.png')}
          dimensionValue={300}
        />
      </View>
    );
  }
}
```

### Dimension change according to the input params (width & height)
![Simulator Screen Recording - iPhone 12 - 2022-04-04 at 03 59 19](https://user-images.githubusercontent.com/31509440/161451497-55532ef8-717f-4c87-afc6-b43db90edba1.gif)


### Adding `otherDimensionMaxValue`
By adding this, we can add maximum limit to the dynamic dimension which gets changed according to the constant dynamic value (`dimensionValue`)

![Simulator Screen Recording - iPhone 12 - 2022-04-04 at 04 01 07](https://user-images.githubusercontent.com/31509440/161451533-0b4864ab-9b81-4591-8fba-814d57d9a95a.gif)



## Props

| name | type | isRequired | default | description |
| --- |  :---: |  :---: |  :---: |  --- |
| dimensionType | `enum('width', 'height')` | YES | width | Mention the constant dimension. (width/height) |
| dimensionValue | Number | YES | - | Constant dimension value |
| uri | String | NO | - | URL of the server image |
| localSource | `ImageSource` | NO | - | Local image path (`require('assets/image.jpg')`)
| otherDimensionMaxValue | Number | NO | - | Can set the maximum value for the other dimension. If that value exceeds when setting the value for constant dimension, the image will fit to the given `otherDimensionMaxValue` value |
| style | `Image Style Props` | NO | {} | Image styling | 
