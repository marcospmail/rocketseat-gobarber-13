import styled, { css } from 'styled-components/native'
import FeatherIcon from 'react-native-vector-icons/Feather'

interface ContainerProps {
  isFocused: boolean
  isErrored: boolean
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: 60px;
  padding: 0 16px;
  background: #232129;
  border-radius: 10px;
  margin-bottom: 8px;
  border: 2px solid #232129;

  ${({ isFocused }) =>
    isFocused &&
    css`
      border-color: #ff9000;
    `}

  ${({ isErrored }) =>
    isErrored &&
    css`
      border-color: #c53030;
    `}


  flex-direction: row;
  align-items: center;
`

export const TextInput = styled.TextInput`
  flex: 1;
  height: 100%;
  color: #fff;
  font-size: 16px;
  font-family: 'RobotoSlab-Regular';
`

export const Icon = styled(FeatherIcon)`
  margin-right: 16px;
`
