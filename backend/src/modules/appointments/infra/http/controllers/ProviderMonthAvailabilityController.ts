import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

class ProviderMonthAvailabilityController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { provider_id } = req.params
    const { month, year } = req.query

    const listProviderMonthAvailabilityService = container.resolve(
      ListProviderMonthAvailabilityService
    )

    const dayAvailability = await listProviderMonthAvailabilityService.execute({
      provider_id,
      month: Number(month),
      year: Number(year)
    })

    return res.json(dayAvailability)
  }
}

export default ProviderMonthAvailabilityController
