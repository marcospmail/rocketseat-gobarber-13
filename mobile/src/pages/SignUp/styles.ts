import { getBottomSpace } from 'react-native-iphone-x-helper'
import styled from 'styled-components/native'

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;

  margin-top: -50px;
  padding: 0 30px;
  position: relative;
`

export const Title = styled.Text`
  font-size: 24px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 32px 0 24px;
`

export const BackToSignInButton = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  background: #312e38;
  border-color: #232129;
  border-top-width: 1px;
  padding: 16px 0 ${16 + getBottomSpace()}px;

  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const BackToSignInButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-family: 'RobotoSlab-Regular';
  margin-left: 16px;
`
