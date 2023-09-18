import React, {useState, useEffect} from 'react';
import {
  Image,
  View,
  ActivityIndicator,
  StyleSheet,
  ImageStyle,
  ImageProps,
} from 'react-native';

type Props = {
  source: number | {uri: string};
  dimensionValue: number;
  otherDimensionMaxValue?: number;
  dimensionType?: 'width' | 'height';
  style?: ImageStyle;
  defaultImageProps?: ImageProps;
};

const AutoDimensionImage: React.FC<Props> = ({
  source,
  dimensionValue,
  otherDimensionMaxValue,
  dimensionType = 'width',
  style,
  defaultImageProps,
}) => {
  const [loading, setLoading] = useState(true);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    if (source) {
      setImageDimensions();
    } else {
      console.error('Image source should not be empty');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, dimensionType, dimensionValue, otherDimensionMaxValue]);

  const setImageDimensions = () => {
    getDynamicDimensions(dimensionType, dimensionValue)
      .then(({width, height}) => {
        const dynamicWidth = dimensionType === 'width';

        if (!otherDimensionMaxValue) {
          setImageWidth(width);
          setImageHeight(height);
        } else {
          if (
            (dynamicWidth && height < otherDimensionMaxValue) ||
            (!dynamicWidth && width < otherDimensionMaxValue)
          ) {
            //  not exceeding the given otherDimensionMaxValue
            setImageWidth(width);
            setImageHeight(height);
          } else {
            //  exceeding the max value
            getDynamicDimensions(
              dimensionType === 'height' ? 'width' : 'height',
              otherDimensionMaxValue,
            )
              .then(({width: _width, height: _height}) => {
                setImageWidth(_width);
                setImageHeight(_height);
              })
              .catch(error => console.error(error));
          }
        }

        setLoading(false);
      })
      .catch(error => console.log(error));
  };

  const getImageDimensions = (): Promise<{width: number; height: number}> => {
    return new Promise((resolve, reject) => {
      if (typeof source !== 'number') {
        //  server image
        Image.getSize(
          source.uri,
          (width, height) => resolve({width, height}),
          () => reject(null),
        );
      } else {
        //  local image
        const {width, height} = Image.resolveAssetSource(source);
        resolve({width, height});
      }
    });
  };

  const getDynamicDimensions = (
    type: 'width' | 'height',
    value: number,
  ): Promise<{width: number; height: number}> => {
    return new Promise((resolve, reject) => {
      getImageDimensions()
        .then(data => {
          if (type === 'width') {
            resolve({width: value, height: (data.height * value) / data.width});
          } else {
            resolve({width: (data.width * value) / data.height, height: value});
          }
        })
        .catch(error =>
          reject(`Could not get the image dimensions : ${error}`),
        );
    });
  };

  return (
    <View>
      {!loading && source ? (
        <Image
          {...defaultImageProps}
          source={source} //  {uri: String, cache:  default || reload || force-cache || only-if-cached}
          style={[{width: imageWidth, height: imageHeight}, style]}
        />
      ) : (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingWrapper: {
    padding: 10,
    alignSelf: 'center',
  },
});

export default AutoDimensionImage;
