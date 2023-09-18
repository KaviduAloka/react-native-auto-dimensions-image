# react-native-auto-dimensions-image

This component can adjust the dimensions according to the given height or width. Both dimensions can be set for any local or server image

## Installation

`npm i react-native-auto-dimensions-image`

## Usage

```
import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

import AutoDimensionImage from 'react-native-auto-dimensions-image';

export default class Test extends Component {
  render() {
    return (
      <View>
        {/* Remote image URL */}
        <AutoDimensionImage
          source={{
            uri: 'https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d37?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Ym13JTIwY2FyfGVufDB8fDB8fA%3D%3D&w=1000&q=80'
          }}
          dimensionType="height"
          dimensionValue={350}
          otherDimensionMaxValue={200}
          style={styles.image}
          defaultImageProps={{blurRadius: 10}}
        />

        {/* Local image URL */}
        <AutoDimensionImage
          source={require('./X5ModelImage.jpeg')}
          dimensionType="height"
          dimensionValue={200}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
  },
});
```

### Dimension change according to the input params (width & height)

![Simulator Screen Recording - iPhone 12 - 2022-04-04 at 03 59 19](https://user-images.githubusercontent.com/31509440/161451497-55532ef8-717f-4c87-afc6-b43db90edba1.gif)

### Adding `otherDimensionMaxValue`

By adding this, we can add maximum limit to the dynamic dimension which gets changed according to the constant dynamic value (`dimensionValue`)

![Simulator Screen Recording - iPhone 12 - 2022-04-04 at 04 01 07](https://user-images.githubusercontent.com/31509440/161451533-0b4864ab-9b81-4591-8fba-814d57d9a95a.gif)

## Props

| name                   |           type            | isRequired | default | description                                                                                                                                                                            |
| ---------------------- | :-----------------------: | :--------: | :-----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dimensionType          | `enum('width', 'height')` |    YES     |    -    | Mention the constant dimension. (width/height)                                                                                                                                         |
| dimensionValue         |         `number`          |    YES     |    -    | Constant dimension value                                                                                                                                                               |
| source                 |       `ImageSource`       |    YES     |    -    | The image source (either a remote URL or a local file resource)                                                                                                                        |
| otherDimensionMaxValue |         `number`          |     NO     |    -    | Can set the maximum value for the other dimension. If that value exceeds when setting the value for constant dimension, the image will fit to the given `otherDimensionMaxValue` value |
| style                  |    `Image Style Props`    |     NO     |   {}    | Image styling                                                                                                                                                                          |
| defaultImageProps      |         `Object`          |     NO     |   {}    | The default props available in `Image`                                                                                                                                                 |
