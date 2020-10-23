import React, { useState, useCallback, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../contexts/auth'
import Icon from 'react-native-vector-icons/Feather'

import api from '../../services/api'

import * as defaults from '../../utils/defaults'

import { Provider } from './types'

import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderInfo,
  ProviderName,
  ProviderMetaText,
  ProviderMeta,
  ProviderListTitle
} from './styles'

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([])

  const { user, signOut } = useAuth()
  const { navigate } = useNavigation()

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await api.get('providers')

        setProviders(response.data)
      } catch (err) {
        if (err.response.status === 401) signOut()
      }
    }

    fetchProviders()
  }, [signOut])

  const navigateToProfile = useCallback(() => {
    navigate('Profile')
  }, [navigate])

  const navigateToCreateNewAppoint = useCallback(
    provider_id => {
      navigate('CreateAppointment', { provider_id })
    },
    [navigate]
  )

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem vindo, {'\n'}
          <UserName>{user?.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar
            source={{ uri: user?.avatar_url ?? defaults.images.avatar_url }}
          />
        </ProfileButton>
      </Header>

      <ProvidersList
        data={providers}
        keyExtractor={provider => provider.id}
        ListHeaderComponent={
          <ProviderListTitle>Cabeleireiros</ProviderListTitle>
        }
        renderItem={({ item: provider }) => (
          <ProviderContainer
            onPress={() => navigateToCreateNewAppoint(provider.id)}
          >
            <ProviderAvatar
              source={{
                uri: provider.avatar_url ?? defaults.images.avatar_url
              }}
            />

            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>

              <ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9000" />
                <ProviderMetaText>Segunda à sexta</ProviderMetaText>
              </ProviderMeta>

              <ProviderMeta>
                <Icon name="clock" size={14} color="#ff9000" />
                <ProviderMetaText>8h às 18h</ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  )
}

export default Dashboard
