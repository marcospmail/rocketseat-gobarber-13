import styled, { keyframes } from 'styled-components'
import { shade } from 'polished'

import signUpBackgroundImg from '../../assets/sign-up-background.png'

export const Container = styled.div`
  height: 100vh;
  display: flex;
`

const appearFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  width: 100%;
  max-width: 700px;

  animation: ${appearFromRight} 1s;

  form {
    margin: 80px 0;
    width: 340px;

    display: flex;
    flex-direction: column;

    > div:first-of-type {
      margin-top: 24px;
    }

    a {
      color: #f4ede8;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }

  > a {
    color: #ff9000;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    svg {
      margin-right: 16px;
    }

    &:hover {
      color: ${shade(0.2, '#ff9000')};
    }
  }
`

export const Background = styled.div`
  flex: 1;
  background: url(${signUpBackgroundImg}) no-repeat center;
  background-size: cover;
`
