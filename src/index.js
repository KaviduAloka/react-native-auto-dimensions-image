import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {Image, View, ActivityIndicator, StyleSheet} from 'react-native';

export const imageDimensionTypes = {
  WIDTH: 'width',
  HEIGHT: 'height',
};

const AutoDimensionImage = ({
  uri,
  localSource,
  dimensionValue,
  otherDimensionMaxValue,
  dimensionType,
  style,
}) => {
  const [loading, setLoading] = useState(true);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    setImageDimensions();
  }, [dimensionValue, dimensionType, otherDimensionMaxValue]);

  /**
   * @returns {Promise}
   */
  const getImageDimensions = () => {
    return new Promise((resolve, reject) => {
      if (uri) {
        //  server image
        Image.getSize(
          uri,
          (width, height) => resolve({width, height}),
          () => reject(null),
        );
      } else if (localSource) {
        //  local image
        const {width, height} = Image.resolveAssetSource(localSource);
        resolve({width, height});
      }
    });
  };

  const setImageDimensions = () => {
    getDynamicDimensions(dimensionType, dimensionValue)
      .then(({width, height}) => {
        const dynamicWidth = dimensionType === imageDimensionTypes.WIDTH;

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
              dimensionType === imageDimensionTypes.HEIGHT
                ? imageDimensionTypes.WIDTH
                : imageDimensionTypes.HEIGHT,
              otherDimensionMaxValue,
            )
              .then(({width: _width, height: _height}) => {
                setImageWidth(_width);
                setImageHeight(_height);
              })
              .catch(error => console.log(`_ `, error));
          }
        }

        setLoading(false);
      })
      .catch(error => console.log(error));
  };

  /**
   * @returns {Promise}
   */
  const getDynamicDimensions = (type, value) => {
    return new Promise((resolve, reject) => {
      getImageDimensions()
        .then(data => {
          if (type === imageDimensionTypes.WIDTH) {
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
      {!loading ? (
        <Image
          source={uri ? {uri} : localSource}
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

AutoDimensionImage.defaultProps = {
  style: {},
  dimensionType: imageDimensionTypes.WIDTH,
};

AutoDimensionImage.propTypes = {
  uri: PropTypes.string,
  style: PropTypes.object,
  dimensionValue: PropTypes.number.isRequired,
  otherDimensionMaxValue: PropTypes.number,
  dimensionType: PropTypes.oneOf(['width', 'height']).isRequired,
  localSource: PropTypes.number,
};

export default AutoDimensionImage;
