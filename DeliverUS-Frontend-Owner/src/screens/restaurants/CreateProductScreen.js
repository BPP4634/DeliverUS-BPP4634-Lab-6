/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Pressable, ScrollView, Image, Platform, Switch } from 'react-native'
import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import * as GlobalStyles from '../../styles/GlobalStyles'
import * as ExpoImagePicker from 'expo-image-picker'
import restaurantLogo from '../../../assets/restaurantLogo.jpeg'
import DropDownPicker from 'react-native-dropdown-picker'
import { Formik } from 'formik'
import { showMessage } from 'react-native-flash-message'
import { getProductCategories } from '../../api/RestaurantEndpoints'

export default function CreateProductScreen () {
  const [productCategories, setProductCategories] = useState([])
  const [open, setOpen] = useState(false)
  useEffect(() => {
    async function fetchProductCategories () {
      try {
        const fetchedProductCategories = await getProductCategories()
        const fetchedProductCategoriesReshaped = fetchedProductCategories.map((e) => {
          return {
            label: e.name,
            value: e.id
          }
        })
        setProductCategories(fetchedProductCategoriesReshaped)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving product categories. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchProductCategories()
  }, [])
  const pickImage = async (onSuccess) => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    })
    if (!result.canceled) {
      if (onSuccess) {
        onSuccess(result)
      }
    }
  }
  const initialProductValues = {
    name: null,
    description: null,
    price: null,
    order: null,
    productCategory: null,
    availability: null
  }
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
        }
      }
    })()
  }, [])
  return (
      <Formik
      initialValues={initialProductValues}
      >
        {({ setFieldValue, values }) => (
          <ScrollView>
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: '60%' }}>
                <Pressable onPress={() =>
                  pickImage(
                    async result => {
                      await setFieldValue('logo', result)
                    }
                  )
                }
                style={styles.imagePicker}
                >
                  <TextRegular>Logo: </TextRegular>
                  <Image style={styles.image} source={values.logo ? { uri: values.logo.assets[0].uri } : restaurantLogo} />
                </Pressable>
                <InputItem
                  name='name'
                  label='Name:'
                />
                <InputItem
                  name='description'
                  label='Description:'
                />
                <InputItem
                  name='price'
                  label='Price:'
                />
                <InputItem
                  name='order'
                  label='Order:'
                />
                <TextRegular style={styles.switch}>Is it available?</TextRegular>
                <Switch
                  trackColor={{ false: GlobalStyles.brandSecondary, true: GlobalStyles.brandPrimary }}
                  thumbColor={values.availability ? GlobalStyles.brandSecondary : '#f4f3f4'}
                  value={values.availability}
                  style={styles.switch}
                  onValueChange={value =>
                    setFieldValue('availability', value)
                  }
                />
                <DropDownPicker
                  open={open}
                  value={values.productCategory}
                  items={productCategories}
                  setOpen={setOpen}
                  onSelectItem={ item => {
                    setFieldValue('productCategory', item.value)
                  }}
                  setItems={setProductCategories}
                  placeholder="Select the product category"
                  containerStyle={{ height: 40, marginTop: 20 }}
                  style={{ backgroundColor: GlobalStyles.brandBackground }}
                  dropDownStyle={{ backgroundColor: '#fafafa' }}
                />
              </View>
            </View>
          </ScrollView>
        )}
      </Formik>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginLeft: 5
  },
  imagePicker: {
    height: 40,
    paddingLeft: 10,
    marginTop: 20,
    marginBottom: 80
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 5
  },
  switch: {
    marginTop: 20
  }
})
