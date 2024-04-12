/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Pressable, ScrollView, Image, Platform } from 'react-native'
import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import * as GlobalStyles from '../../styles/GlobalStyles'
import * as ExpoImagePicker from 'expo-image-picker'
import restaurantLogo from '../../../assets/restaurantLogo.jpeg'
import DropDownPicker from 'react-native-dropdown-picker'
import { Formik } from 'formik'
import { showMessage } from 'react-native-flash-message'
import { getRestaurantCategories } from '../../api/RestaurantEndpoints'

export default function CreateRestaurantScreen () {
  const [restaurantCategories, setRestaurantCategories] = useState([])
  const [open, setOpen] = useState(false)
  useEffect(() => {
    async function fetchRestaurantCategories () {
      try {
        const fetchedRestaurantCategories = await getRestaurantCategories()
        const fetchedRestaurantCategoriesReshaped = fetchedRestaurantCategories.map((e) => {
          return {
            label: e.name,
            value: e.id
          }
        })
        setRestaurantCategories(fetchedRestaurantCategoriesReshaped)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving restaurant categories. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchRestaurantCategories()
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
  const initialRestaurantValues = {
    name: null,
    description: null,
    address: null,
    postalCode: null,
    url: null,
    shippingCosts: null,
    email: null,
    phone: null,
    restaurantCategoryId: null
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
      initialValues={initialRestaurantValues}
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
                  name='address'
                  label='Address:'
                />
                <InputItem
                  name='description'
                  label='Description:'
                />
                <InputItem
                  name='postalCode'
                  label='Postal Code:'
                />
                <InputItem
                  name='url'
                  label='URL:'
                />
                <InputItem
                  name='shippingCosts'
                  label='Shipping costs:'
                />
                <InputItem
                  name='email'
                  label='email:'
                />
                <InputItem
                  name='phone'
                  label='Phone:'
                />
                <InputItem
                  name='description'
                  label='Description:'
                />
                  <DropDownPicker
                  open={open}
                  value={values.restaurantCategoryId}
                  items={restaurantCategories}
                  setOpen={setOpen}
                  onSelectItem={ item => {
                    setFieldValue('restaurantCategoryId', item.value)
                  }}
                  setItems={setRestaurantCategories}
                  placeholder="Select the restaurant category"
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
  }
})
