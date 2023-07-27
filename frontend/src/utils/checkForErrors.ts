import { SortType } from '../next_components'
import { ErrorType } from '../types'

export const checkForErrors = async (
  errorChecks: ErrorType[]
): Promise<string[]> => {
  return errorChecks
    .map((error: { condition: boolean; errorMessage: string }) =>
      error.condition ? error.errorMessage : ''
    )
    .filter((errorMessage: string) => errorMessage !== '')
}

export const sortMethods: SortType[] = [
  'A - Z',
  'Z - A',
  'Alt zuerst',
  'Neu zuerst',
]
