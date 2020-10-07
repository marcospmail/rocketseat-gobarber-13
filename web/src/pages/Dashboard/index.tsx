import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { FiClock, FiPower } from 'react-icons/fi'
import DayPicker, { DayModifiers } from 'react-day-picker'
import { isToday, format, parseISO, isAfter } from 'date-fns'
import ptBr from 'date-fns/locale/pt-BR'
import 'react-day-picker/lib/style.css'

import { useAuth } from '../../hooks/auth'

import logoImg from '../../assets/logo.svg'

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  Calendar,
  NextAppointment,
  Section,
  Appointment,
} from './styles'
import api from '../../services/api'

interface MonthAvailabilityItem {
  day: number
  available: boolean
}

interface Appointment {
  id: string
  date: string
  formattedHour: string
  user: {
    id: string
    name: string
    avatar_url: string
  }
}

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([])

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day)
    }
  }, [])

  const handleMonthChange = useCallback((month: Date) => {
    setSelectedMonth(month)
  }, [])

  useEffect(() => {
    api
      .get(`/appointments/${user.id}/month-availability`, {
        params: {
          month: selectedMonth.getMonth() + 1,
          year: selectedMonth.getFullYear(),
        },
      })
      .then(response => {
        setMonthAvailability(response.data)
      })
  }, [selectedMonth, user.id])

  const disabledDays = useMemo(() => {
    return monthAvailability
      .filter(monthDay => monthDay.available === false)
      .map(monthDay => {
        const month = selectedMonth.getMonth()
        const year = selectedMonth.getFullYear()

        return new Date(year, month, monthDay.day)
      })
  }, [monthAvailability, selectedMonth])

  const today = useMemo(() => isToday(selectedDate), [selectedDate])

  const formattedDay = useMemo(
    () =>
      format(selectedDate, "'Dia' d", {
        locale: ptBr,
      }),
    [selectedDate]
  )

  const formattedWeekDay = useMemo(
    () =>
      format(selectedDate, 'cccc', {
        locale: ptBr,
      }),
    [selectedDate]
  )

  useEffect(() => {
    api
      .get<Appointment[]>(`appointments/schedule`, {
        params: {
          day: selectedDate.getDate(),
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear(),
        },
      })
      .then(response => {
        const data = response.data.map(d => ({
          ...d,
          formattedHour: format(parseISO(d.date), 'HH:mm'),
        }))

        setAppointments(data)
      })
  }, [selectedDate])

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date())
    )
  }, [appointments])

  const morningAppointments = useMemo(() => {
    return appointments.filter(
      appointment => parseISO(appointment.date).getHours() < 12
    )
  }, [appointments])

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(
      appointment => parseISO(appointment.date).getHours() >= 12
    )
  }, [appointments])

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />

            <div>
              <span>Bem-vindo,</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>

          <p>
            {today && <span>Hoje</span>}
            <span>{formattedDay}</span>
            <span>{formattedWeekDay}</span>
          </p>

          {today && nextAppointment && (
            <NextAppointment>
              <strong>Atendimento a seguir</strong>
              <div>
                <img
                  src={nextAppointment?.user.avatar_url}
                  alt={nextAppointment?.user.name}
                />

                <strong>{nextAppointment?.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment?.formattedHour}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>

            {!morningAppointments.length ? (
              <p>Não há agendamentos</p>
            ) : (
              morningAppointments.map(ma => {
                return (
                  <Appointment key={ma.id}>
                    <span>
                      <FiClock />
                      {ma.formattedHour}
                    </span>

                    <div>
                      <img src={ma.user.avatar_url} alt={ma.user.name} />

                      <strong>{ma.user.name}</strong>
                    </div>
                  </Appointment>
                )
              })
            )}
          </Section>

          <Section>
            <strong>Tarde</strong>

            {!afternoonAppointments.length ? (
              <p>Não há agendamentos</p>
            ) : (
              afternoonAppointments.map(ma => {
                return (
                  <Appointment key={ma.id}>
                    <span>
                      <FiClock />
                      {ma.formattedHour}
                    </span>

                    <div>
                      <img src={ma.user.avatar_url} alt={ma.user.name} />

                      <strong>{ma.user.name}</strong>
                    </div>
                  </Appointment>
                )
              })
            )}
          </Section>
        </Schedule>

        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onMonthChange={handleMonthChange}
            onDayClick={handleDateChange}
            selectedDays={selectedDate}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  )
}
export default Dashboard
