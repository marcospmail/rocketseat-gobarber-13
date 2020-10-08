import styled, { css } from 'styled-components'

import Tooltip from '../Tooltip'

interface ContainerProps {
  isFocused: boolean
  isFilled: boolean
  isErrored: boolean
}

export const Container = styled.div<ContainerProps>`
  background: #232129;
  border-radius: 10px;
  border: 2px solid #232129;
  padding: 0 16px;
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;

  margin-top: 8px;

  ${props =>
    props.isFocused &&
    css`
      border: 2px solid #ff9000;
    `}

  ${props =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}

  input {
    flex: 1;
    background: transparent;
    border: 0;
    color: #fff;
    height: 47px;
  }

  > svg {
    color: #666360;
    margin-right: 8px;

    ${({ isFilled }) =>
      isFilled &&
      css`
        color: #ff9000;
      `}
  }
`

export const Error = styled(Tooltip)`
  span {
    background-color: #c53030;
    color: #fff;

    ::before {
      border-color: #c53030 transparent;
    }
  }
`
