import { getAll } from '~/commands/get-all'
import { getDetail } from '~/commands/get-detail'
import { readLocation } from '~/commands/read-location'
import { compareCoords } from '~/commands/compare-coords'

export const commands = [getAll, getDetail, readLocation, compareCoords]
