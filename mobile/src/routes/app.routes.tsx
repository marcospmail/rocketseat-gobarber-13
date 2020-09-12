import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Dashboard from '../pages/Dashboard'

const Auth = createStackNavigator()

const AppRoutes: React.FC = () => (
  <Auth.Navigator
    initialRouteName="SignIn"
    screenOptions={{
      // headerShown: false,
      cardStyle: { backgroundColor: '#312e38' }
    }}
  >
    <Auth.Screen name="SignIn" component={Dashboard} />
  </Auth.Navigator>
)

export default AppRoutes
