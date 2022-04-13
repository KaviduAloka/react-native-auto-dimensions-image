import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Image, View, ActivityIndicator, StyleSheet } from "react-native";

export const imageDimensionTypes = {
   WIDTH: "width",
   HEIGHT: "height",
};

const AutoDimensionImage = ({
   source,
   dimensionValue,
   otherDimensionMaxValue,
   dimensionType,
   style,
}) => {
   const [loading, setLoading] = useState(true);
   const [imageWidth, setImageWidth] = useState(0);
   const [imageHeight, setImageHeight] = useState(0);

   useEffect(() => {
      if (source) {
         setImageDimensions();
      } else {
         console.error("Image source should not be empty");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [source, dimensionType, dimensionValue, otherDimensionMaxValue]);

   const setImageDimensions = () => {
      getDynamicDimensions(dimensionType, dimensionValue)
         .then(({ width, height }) => {
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
                     otherDimensionMaxValue
                  )
                     .then(({ width: _width, height: _height }) => {
                        setImageWidth(_width);
                        setImageHeight(_height);
                     })
                     .catch((error) => console.error(error));
               }
            }

            setLoading(false);
         })
         .catch((error) => console.log(error));
   };

   /**
    * @returns {Promise}
    */
   const getImageDimensions = () => {
      const localImage = source.uri === undefined;

      return new Promise((resolve, reject) => {
         if (!localImage) {
            //  server image
            Image.getSize(
               source.uri,
               (width, height) => resolve({ width, height }),
               () => reject(null)
            );
         } else {
            //  local image
            const { width, height } = Image.resolveAssetSource(source);
            resolve({ width, height });
         }
      });
   };

   /**
    * @returns {Promise}
    */
   const getDynamicDimensions = (type, value) => {
      return new Promise((resolve, reject) => {
         getImageDimensions()
            .then((data) => {
               if (type === imageDimensionTypes.WIDTH) {
                  resolve({
                     width: value,
                     height: (data.height * value) / data.width,
                  });
               } else {
                  resolve({
                     width: (data.width * value) / data.height,
                     height: value,
                  });
               }
            })
            .catch((error) =>
               reject(`Could not get the image dimensions : ${error}`)
            );
      });
   };

   return (
      <View>
         {!loading && source ? (
            <Image
               source={source}
               style={[{ width: imageWidth, height: imageHeight }, style]}
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
      alignSelf: "center",
   },
});

AutoDimensionImage.defaultProps = {
   style: {},
};

AutoDimensionImage.propTypes = {
   style: PropTypes.object,
   source: PropTypes.oneOfType([
      PropTypes.shape({ uri: PropTypes.string }),
      PropTypes.number,
   ]).isRequired,
   dimensionValue: PropTypes.number.isRequired,
   dimensionType: PropTypes.oneOf(["width", "height"]).isRequired,
   otherDimensionMaxValue: PropTypes.number,
};

export default AutoDimensionImage;
