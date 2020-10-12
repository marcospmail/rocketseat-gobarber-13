import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { FlatList, Platform, Alert } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useAuth } from '../../contexts/auth'
import Icon from 'react-native-vector-icons/Feather'
import DateTimePicker from '@react-native-community/datetimepicker'
import { format } from 'date-fns'

import api from '../../services/api'
import * as Defaults from '../../utils/defaults'

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProvidersContainer,
  Providers,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
  ProfileButton
} from './styles'

interface Provider {
  id: string
  name: string
  avatar_url: string
}

interface RouteParams {
  provider_id: string
}

interface DayAvailability {
  hour: number
  available: boolean
}

const CreateAppointment: React.FC = () => {
  const providersListRef = useRef<FlatList>(null)
  const { user } = useAuth()
  const route = useRoute()
  const { provider_id } = route.params as RouteParams

  const [dayAvailability, setDayAvailability] = useState<DayAvailability[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProviderId, setSelectedProviderId] = useState(provider_id)
  const [showDateTimePicker, setShowDateTimePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedHour, setSelectedHour] = useState(0)

  const { goBack, navigate } = useNavigation()

  const navigateBack = useCallback(() => {
    goBack()
  }, [goBack])

  useEffect(() => {
    const fetchDayAvailability = async () => {
      const params = {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate()
      }

      const response = await api.get(
        `appointments/${selectedProviderId}/day-availability`,
        {
          params
        }
      )

      setDayAvailability(response.data)
    }

    fetchDayAvailability()
  }, [selectedProviderId, selectedDate])

  const morningAvailability = useMemo(() => {
    return dayAvailability
      .filter(hourAvailability => hourAvailability.hour < 12)
      .map(hourAvailability => ({
        ...hourAvailability,
        formattedHour: format(
          new Date().setHours(hourAvailability.hour),
          'HH:00'
        )
      }))
  }, [dayAvailability])

  const afternoonAvailability = useMemo(() => {
    return dayAvailability
      .filter(hourAvailability => hourAvailability.hour >= 12)
      .map(hourAvailability => ({
        ...hourAvailability,
        formattedHour: format(
          new Date().setHours(hourAvailability.hour),
          'HH:00'
        )
      }))
  }, [dayAvailability])

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour)
  }, [])

  const handleDateChange = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') setShowDateTimePicker(false)

    if (date) {
      setSelectedDate(date)
    }
  }, [])

  const handleScheduleAppointment = useCallback(async () => {
    const appointmentDate = new Date(selectedDate)
    appointmentDate.setHours(selectedHour)
    appointmentDate.setMinutes(0)

    try {
      await api.post('appointments', {
        provider_id: selectedProviderId,
        date: appointmentDate
      })

      navigate('AppointmentCreated', {
        date: appointmentDate.getTime()
      })
    } catch (err) {
      Alert.alert(
        'Erro',
        'Falha ao criar o agendamento, tente novamente mais tarde'
      )
    }
  }, [selectedDate, selectedHour, navigate, selectedProviderId])

  const changeSelectedProviderToFirstPosition = useCallback(
    (providersList: Provider[], newSelectedProviderId: string): Provider[] => {
      const providersWithoutSelectedProvider = providersList.filter(
        provider => provider.id !== newSelectedProviderId
      )
      const selectedProvider = providersList.filter(
        provider => provider.id === newSelectedProviderId
      )

      const newProviders = [
        ...selectedProvider,
        ...providersWithoutSelectedProvider
      ]

      return newProviders
    },
    []
  )

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const { data } = await api.get<Provider[]>('providers')

        const newProviders = changeSelectedProviderToFirstPosition(
          data,
          provider_id
        )
        setProviders(newProviders)
      } catch (err) {}
    }

    fetchProviders()
  }, [changeSelectedProviderToFirstPosition, provider_id])

  const selectProvider = useCallback(
    (newSelectedProviderId: string) => {
      const newProviders = changeSelectedProviderToFirstPosition(
        providers,
        newSelectedProviderId
      )
      setProviders(newProviders)

      setSelectedProviderId(newSelectedProviderId)

      providersListRef?.current?.scrollToOffset({ animated: true, offset: 0 })
    },
    [providers, setSelectedProviderId, changeSelectedProviderToFirstPosition]
  )
  const handleToggleDateTimePicker = useCallback(() => {
    setShowDateTimePicker(oldState => !oldState)
  }, [])

  const navigateToProfile = useCallback(() => {
    navigate('Profile')
  }, [navigate])

  return (
    <Container>
      <Header>
        <BackButton
          onPress={() => {
            navigateBack()
          }}
        >
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar source={{ uri: user?.avatar_url }} />
        </ProfileButton>
      </Header>

      <Content>
        <ProvidersContainer>
          <Providers
            ref={providersListRef}
            data={providers}
            keyExtractor={provider => provider.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                selected={provider.id === selectedProviderId}
                onPress={() => {
                  selectProvider(provider.id)
                }}
              >
                <ProviderAvatar
                  source={{
                    uri: provider.avatar_url ?? Defaults.images.avatar_url
                  }}
                />
                <ProviderName selected={provider.id === selectedProviderId}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersContainer>

        <Calendar>
          <Title>Escolha a data</Title>

          <OpenDatePickerButton onPress={handleToggleDateTimePicker}>
            <OpenDatePickerButtonText>
              Selecionar outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>

          {showDateTimePicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              onChange={handleDateChange}
              value={selectedDate}
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailability.map(({ formattedHour, hour, available }) => (
                <Hour
                  key={hour}
                  enabled={available}
                  available={available}
                  selected={selectedHour === hour}
                  onPress={() => {
                    handleSelectHour(hour)
                  }}
                >
                  <HourText selected={selectedHour === hour}>
                    {formattedHour}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoonAvailability.map(
                ({ formattedHour, hour, available }) => (
                  <Hour
                    key={hour}
                    enabled={available}
                    available={available}
                    selected={selectedHour === hour}
                    onPress={() => {
                      handleSelectHour(hour)
                    }}
                  >
                    <HourText selected={selectedHour === hour}>
                      {formattedHour}
                    </HourText>
                  </Hour>
                )
              )}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleScheduleAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  )
}

export default CreateAppointment
