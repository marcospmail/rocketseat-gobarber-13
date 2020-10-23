import styled from 'styled-components/native'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'

export const Container = styled.View`
  flex: 1;
  margin-top: ${getStatusBarHeight()}px;
`

export const BackButton = styled.TouchableOpacity`
  margin-top: 10px;
  margin-left: 30px;
`

export const Content = styled.View`
  padding: 0 30px;
`

export const Title = styled.Text`
  font-size: 24px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 10px 0 24px;
`

export const Avatar = styled.TouchableOpacity`
  align-items: center;
`

export const AvatarImage = styled.Image`
  width: 180px;
  height: 180px;
  border-radius: 90px;
`

export const SignOut = styled.TouchableOpacity`
  margin: 30px 0;
`

export const SignOutText = styled.Text`
  color: #f4ede8;
  font-size: 16px;
  font-family: 'RobotoSlab-Regular';
  text-align: center;
`
