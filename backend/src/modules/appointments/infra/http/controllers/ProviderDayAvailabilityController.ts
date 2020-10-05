import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

class ProviderDayAvailabilityController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { provider_id } = req.params
    const { day, month, year } = req.query

    const listProviderDayAvailabilityService = container.resolve(
      ListProviderDayAvailabilityService
    )

    const dayAvailability = await listProviderDayAvailabilityService.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year)
    })

    return res.json(dayAvailability)
  }
}

export default ProviderDayAvailabilityController
