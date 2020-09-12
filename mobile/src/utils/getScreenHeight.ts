import { Dimensions } from 'react-native'

const getScreenHeight = (): number => {
  return Math.round(Dimensions.get('window').height) - 12
}

export default getScreenHeight
