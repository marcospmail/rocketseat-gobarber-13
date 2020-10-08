import styled from 'styled-components'
import { shade } from 'polished'

export const Container = styled.div`
  height: 100vh;

  > header {
    height: 144px;
    background: #28262e;

    display: flex;
    align-items: center;

    > div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;

      svg {
        color: #999591;
        width: 24px;
        height: 24px;
      }
    }
  }
`

export const Content = styled.div`
  width: 100%;
  width: 340px;

  margin: 0 auto;
  margin-top: -167px;

  form {
    margin: 80px 0;
    text-align: center;

    h1 {
      font-size: 20px;
      text-align: left;
      margin-bottom: 24px;
    }

    > div:nth-of-type(4) {
      margin-top: 24px;
    }

    > div {
      color: #fff;
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
`

export const AvatarInput = styled.div`
  margin-bottom: 36px;
  position: relative;
  display: inline-block;

  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
    object-fit: cover;
  }

  label {
    position: absolute;
    width: 48px;
    height: 48px;
    right: 0;
    bottom: 0;
    background: #ff9000;
    border: 0;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    transition: background 0.2s;

    input {
      display: none;
    }

    svg {
      width: 20px;
      height: 20px;
    }

    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }
  }
`
