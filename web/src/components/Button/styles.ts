import styled from 'styled-components'
import { shade } from 'polished'

export const Container = styled.div`
  background: #ff9000;
  height: 56px;
  border-radius: 10px;
  border: 0;
  margin-top: 16px;
  transition: background-color 0.2s;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${shade(0.2, '#ff9000')};
  }

  button {
    background: transparent;
    border: 0;
    color: #312e38;
    font-weight: 500;

    width: 100%;
    height: 100%;
  }
`
